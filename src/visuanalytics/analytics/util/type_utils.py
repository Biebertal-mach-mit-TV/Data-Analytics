from typing import Type

from visuanalytics.analytics.util.step_errors import StepTypeError, raise_step_error


def register_type_func(types: dict, error: Type[Exception], func):
    """ Registriert die Übergebene Funktion,
    und versieht sie mit einem try except block

    :param types: Dict wo der type registriert werden soll.
    :param error: fehler der geworfen werden soll.
    :param func: Zu registrierende Funktion.
    :return: funktion mit try, catch block.
    """
    func = raise_step_error(error)(func)

    types[func.__name__] = func
    return func


def get_type_func(values: dict, types: dict):
    func = types.get(values.get("type", ""), None)

    if func is None:
        StepTypeError(values.get("type", None))

    return func

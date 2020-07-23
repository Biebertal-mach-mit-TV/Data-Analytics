import json
import logging

import requests

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util.step_errors import APIError, raise_step_error, APiRequestError
from visuanalytics.analytics.util.type_utils import get_type_func, register_type_func
from visuanalytics.util import resources

logger = logging.getLogger(__name__)

API_TYPES = {}


@raise_step_error(APIError)
def api(values: dict, data: StepData):
    data.init_data(api_request(values["api"], data, values["name"]))


@raise_step_error(APIError)
def api_request(values: dict, data: StepData, name: str, ignore_testing=False):
    api_func = get_type_func(values, API_TYPES)

    return api_func(values, data, name, ignore_testing)


def register_api(func):
    return register_type_func(API_TYPES, APIError, func)


@register_api
def request(values: dict, data: StepData, name: str, ignore_testing=False):
    """Fragt einmal die gewünschten Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    if data.get_config("testing", False) and not ignore_testing:
        return _load_test_data(name)

    return _fetch(values, data)


@register_api
def input(values: dict, data: StepData, name: str, ignore_testing=False):
    return data.format_api(values["input"], values.get("api_key_name", None), values)


@register_api
def request_memory(values: dict, data: StepData, name: str, ignore_testing=False):
    """Ließt Daten aus einer Memory datei (Json-Format) zu einem bestimmtem Datum.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """
    try:
        if values.get("timedelta", None) is None:
            with resources.open_specific_memory_resource(data.get_config("job_name"), values["name"],
                                                         values.get("use_last", 1)) as fp:
                return json.loads(fp.read())
        else:
            with resources.open_memory_resource(data.get_config("job_name"),
                                                values["name"], values["timedelta"]) as fp:
                return json.loads(fp.read())
    except (FileNotFoundError, IndexError):
        return api_request(values["alternative"], data, name)


@register_api
def request_multiple(values: dict, data: StepData, name: str, ignore_testing=False):
    """Fragt für einen variablen Key, mehrere Male gewünschte Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """

    if data.get_config("testing", False) and not ignore_testing:
        return _load_test_data(name)

    if data.format(values.get("use_loop_as_key", False), values):
        data_dict = {}
        for _, key in data.loop_array(values["steps_value"], values):
            data_dict[key] = _fetch(values, data)
        return data_dict

    data_array = []
    for _ in data.loop_array(values["steps_value"], values):
        data_array.append(_fetch(values, data))
        return data_array


@register_api
def request_multiple_custom(values: dict, data: StepData, name: str, ignore_testing=False):
    """Fragt unterschiedliche Daten einer API ab.

    :param values: Werte aus der JSON-Datei
    :param data: Daten aus der API
    """

    if data.get_config("testing", False) and not ignore_testing:
        return _load_test_data(name)

    if values.get("use_loop_as_key", False):
        data_dict = {}

        for idx, key in enumerate(values["steps_value"]):
            data_dict[key] = api_request(values["requests"][idx], data, name)
        return data_dict

    data_array = []
    for idx, value in enumerate(values["requests"]):
        data_array.append(api_request(value, data, name))
    return data_array


def _load_test_data(name):
    logger.info(f"Loading test data from 'exampledata/{name}.json'")
    with resources.open_resource(f"exampledata/{name}.json") as fp:
        return json.loads(fp.read())

    # TODO(max) Catch possible errors


def _fetch(values: dict, data: StepData):
    """Abfrage einer API und Umwandlung der API-Antwort ein Angegebenes Format.

    :param req_data: Dictionary das alle informationen für den request enthält.
    :return: Antwort der API im Angegebenen Format
    """
    # Build Http request
    req_data = _create_query(values, data)

    req = requests.Request(req_data["method"], req_data["url"], headers=req_data["headers"],
                           json=req_data.get("json", None),
                           data=req_data.get("other", None), params=req_data["params"])
    # Make the Http request
    s = requests.session()
    response = s.send(req.prepare())

    if not response.ok:
        raise APiRequestError(response)

    # Get the Right Return Format
    if req_data["res_format"].__eq__("json"):
        res = response.json()
    elif req_data["res_format"].__eq__("text"):
        res = response.text
    else:
        res = response.content

    if req_data["include_headers"]:
        return {"headers": response.headers, "content": res}

    return res


def _create_query(values: dict, data: StepData):
    req = {}
    api_key_name = values.get("api_key_name", None)

    # Get/Format Method and Headers
    req["method"] = data.format(values.get("method", "get"))
    req["headers"] = data.deep_format(values.get("headers", None), api_key_name, values)

    # Get/Format Body Data
    req["body_type"] = data.format(values.get("body_type", "json"), values)

    if req["body_type"].__eq__("json"):
        req[req["body_type"]] = data.deep_format(values.get("body", None), api_key_name, values)
    else:
        req[req["body_type"]] = data.format(values.get("body", None))

        if values.get("body_encoding", None) is not None:
            req[req["body_type"]] = req[req["body_type"]].encode(values["body_encoding"])

    # Get/Format Url
    req["url"] = data.format_api(values["url_pattern"], api_key_name, values)

    # Get/Format Params
    req["params"] = data.deep_format(values.get("params", None), api_key_name, values)
    if values.get("params_array", None) is not None:
        _build_params_array(values, data, api_key_name, req)

    # Get/Format Response, Format
    req["res_format"] = data.format(values.get("response_format", "json"))
    req["include_headers"] = values.get("include_headers", False)

    return req


def _build_params_array(values: dict, data: StepData, api_key_name: str, req: dict):
    if req["params"] is None:
        req["params"] = {}

    for params in values["params_array"]:
        params_array = data.get_data_array(params["array"], values)
        data.deep_format(params_array, api_key_name, values)

        param = "".join(
            [
                f"{data.format(params['pattern'], values)}{data.format(params.get('delimiter', ''), values)}"
                for _ in data.loop_array(params_array, values)
            ])
        req["params"][params["key"]] = param[:-1]

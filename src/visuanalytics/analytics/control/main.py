import logging
import os
import uuid
from pathlib import Path

from visuanalytics.analytics.control.pipeline import Pipeline
from visuanalytics.analytics.control.procedures.history import HistorySteps
from visuanalytics.analytics.control.procedures.weather import WeatherSteps
from visuanalytics.analytics.control.procedures.weather_single import SingleWeatherSteps
from visuanalytics.analytics.control.schedule import Scheduler
from visuanalytics.analytics.util import resources, external_programms, config_manager

# TODO(Max) Implement (current just for testing)

testing = True
h264_nvenc = False


def main(path=None):
    # todo Max, Pfad aus datei einlesen oder default wert
    if path is None:
        path = str(Path.home()) + "/Videos-Data-Analytics"
    # Not ready will be moved later
    init(path)

    # TODO(max) run in other Thread

    # Scheduler().start()
    # Pipeline(uuid.uuid4().hex, WeatherSteps({"testing": testing, "h264_nvenc": h264_nvenc, "output_path": path})).start()
    Pipeline(uuid.uuid4().hex,
             SingleWeatherSteps(
                 {"testing": testing, "city_name": "Biebertal", "p_code": "35444", "h264_nvenc": h264_nvenc,
                  "output_path": path})).start()


# Pipeline(uuid.uuid4().hex, HistorySteps({"testing": testing, "h264_nvenc": h264_nvenc})).start()


def init(path):
    # Check if all external Programmes are installed
    external_programms.all_installed(config_manager.get_public().get("external_programms", []))

    # initialize logging
    level = logging.INFO if testing else logging.WARNING
    logging.basicConfig(format='%(module)s %(levelname)s: %(message)s', level=level)

    # create temp and out directory
    os.makedirs(path, exist_ok=True)
    os.makedirs(resources.get_resource_path("temp"), exist_ok=True)
    os.makedirs(resources.get_resource_path("out"), exist_ok=True)


if __name__ == "__main__":
    main()

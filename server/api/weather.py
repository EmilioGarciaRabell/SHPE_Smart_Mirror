from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse

import os, requests

class Weather(Resource):

    def get(self):
        openWeatherURL = "https://api.open-meteo.com/v1/forecast?latitude=43.161030&longitude=-77.610924&current=temperature_2m&timezone=America/New_York&temperature_unit=fahrenheit"
        weather = requests.get(openWeatherURL)
        return weather.json()
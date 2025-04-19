from flask import jsonify
from flask_cors import cross_origin
from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse

import os, requests


class Weather(Resource):

    @cross_origin()
    def get(self):
        openWeatherURL = "https://api.open-meteo.com/v1/forecast?latitude=43.1566&longitude=-77.6088&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America%2FChicago"
        weather = requests.get(openWeatherURL)
        return weather.json()
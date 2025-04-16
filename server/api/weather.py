from flask_cors import cross_origin
from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse

import os, requests

# https://docs.tomorrow.io/reference/weather-forecast

class Weather(Resource):

    @cross_origin()
    def get(self):
        openWeatherURL = "https://api.tomorrow.io/v4/weather/forecast?location=new%20york&timesteps=1d&apikey=YfBMivvegXnnh7ZxeptGwmcjz44lbq3w"
        weather = requests.get(openWeatherURL)
        return weather.json()
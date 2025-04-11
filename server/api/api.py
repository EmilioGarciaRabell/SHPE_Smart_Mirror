from flask import Flask
from flask_restful import Api, Resource

from flask_restful import request
from flask_restful import reqparse
from  weather import Weather

app = Flask(__name__)
api = Api(app)


api.add_resource(Weather, '/weather')

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource

from flask_restful import request
from flask_restful import reqparse
from  weather import Weather


app = Flask(__name__)
api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})



api.add_resource(Weather, '/weather')

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from RITNews import RITNewsApi
from Weather import Weather
from TrafficLevel import TrafficLevel
from LocalNews import LocalNews
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(RITNewsApi, "/api/rit-news")
api.add_resource(Weather, "/api/weather")
api.add_resource(TrafficLevel, "/api/traffic-level")
api.add_resource(LocalNews, "/api/local-news")

if __name__ == "__main__":
    app.run(debug=True)

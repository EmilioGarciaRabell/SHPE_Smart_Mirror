from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from RITNews import RITNewsApi

import requests
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)
api = Api(app)

# Register RITNews route BEFORE creating another app (this was the issue!)
api.add_resource(RITNewsApi, "/RITNews")


# TomTom API config
TOMTOM_API_KEY = os.getenv('TOMTOM_API_KEY')
TRAFFIC_BASE_URL = 'https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json'
ROUTE_FLOW_BASE_URL = 'https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json'

# News API config
NEWSDATA_API_KEY = os.getenv('NEWSDATA_API_KEY')
NEWSDATA_BASE_URL = 'https://newsdata.io/api/1/news'

class TrafficLevel(Resource):
    def get(self):
        # === Point near RIT ===
        rit_lat = 43.0848
        rit_lon = -77.6744

        rit_params = {
            'point': f'{rit_lat},{rit_lon}',
            'key': TOMTOM_API_KEY
        }

        # === Route from Home (e.g., Genesee St) to RIT ===
        home_lat = 43.1406
        home_lon = -77.6355
        

        route_params = {
            'point': f'{home_lat},{home_lon}',
            'to': f'{rit_lat},{rit_lon}',
            'key': TOMTOM_API_KEY
        }

        try:
            # Traffic level at RIT
            rit_res = requests.get(TRAFFIC_BASE_URL, params=rit_params)
            rit_res.raise_for_status()
            rit_data = rit_res.json()

            flow = rit_data.get('flowSegmentData', {})
            current = flow.get('currentSpeed', 0)
            free_flow = flow.get('freeFlowSpeed', 1)
            rit_congestion = (free_flow - current) / free_flow
            if rit_congestion < 0.2:
                rit_level = 'Low'
            elif rit_congestion < 0.5:
                rit_level = 'Moderate'
            else:
                rit_level = 'High'

            # Traffic from Home to RIT
            route_res = requests.get(ROUTE_FLOW_BASE_URL, params=route_params)
            route_res.raise_for_status()
            route_data = route_res.json()

            route_flow = route_data.get('flowSegmentData', {})
            route_current = route_flow.get('currentSpeed', 0)
            route_free = route_flow.get('freeFlowSpeed', 1)
            route_congestion = (route_free - route_current) / route_free
            if route_congestion < 0.2:
                route_level = 'Low'
            elif route_congestion < 0.5:
                route_level = 'Moderate'
            else:
                route_level = 'High'

            return jsonify({
                'traffic_at_rit': rit_level,
                'current_speed_rit': current,
                'free_flow_speed_rit': free_flow,
                'traffic_from_home': route_level,
                'current_speed_route': route_current,
                'free_flow_speed_route': route_free
            })

        except requests.RequestException as e:
            return jsonify({'error': str(e)}), 500

class LocalNews(Resource):
    def get(self):
        country = request.args.get('country', default='us')
        city = request.args.get('city', default=None)

        params = {
            'apikey': NEWSDATA_API_KEY,
            'country': country,
            'language': 'en',
            'category': 'top'
        }

        if city:
            params['q'] = city

        try:
            res = requests.get(NEWSDATA_BASE_URL, params=params)
            res.raise_for_status()

            try:
                data = res.json()
            except ValueError:
                return jsonify({'error': 'Invalid JSON response from NewsData API'}), 502

            return jsonify(data)

        except requests.RequestException as e:
            return jsonify({'error': str(e)}), 500


# Register route
api.add_resource(TrafficLevel, '/api/traffic-level')
api.add_resource(LocalNews, '/api/local-news')

if __name__ == '__main__':
    app.run(debug=True)

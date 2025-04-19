from flask import Flask, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)
api = Api(app)

# TomTom API config
TOMTOM_API_KEY = os.getenv('TOMTOM_API_KEY')
TRAFFIC_BASE_URL = 'https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json'

# /api/traffic-level
class TrafficLevel(Resource):
    def get(self):
        # Hardcoded RIT coordinates
        lat = 43.0848
        lon = -77.6744


        params = {
            'point': f'{lat},{lon}',
            'key': TOMTOM_API_KEY
        }

        try:
            res = requests.get(TRAFFIC_BASE_URL, params=params)
            res.raise_for_status()
            data = res.json()

            flow = data.get('flowSegmentData', {})
            current = flow.get('currentSpeed', 0)
            free_flow = flow.get('freeFlowSpeed', 1)

            congestion = (free_flow - current) / free_flow
            if congestion < 0.2:
                level = 'Low'
            elif congestion < 0.5:
                level = 'Moderate'
            else:
                level = 'High'

            return jsonify({
                'traffic_level': level,
                'current_speed': current,
                'free_flow_speed': free_flow
            })

        except requests.RequestException as e:
            return jsonify({'error': str(e)}), 500

# Register route
api.add_resource(TrafficLevel, '/api/traffic-level')

if __name__ == '__main__':
    app.run(debug=True)

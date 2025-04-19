from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Create Flask instance
app = Flask(__name__)
CORS(app)
api = Api(app)

# News API config
NEWSDATA_API_KEY = os.getenv('NEWSDATA_API_KEY')
NEWSDATA_BASE_URL = 'https://newsdata.io/api/1/news'

# Define Resource (Flask-RESTful style)
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
            data = res.json()
            return jsonify(data)
        except requests.RequestException as e:
            return jsonify({'error': str(e)}), 500

# Register resource
api.add_resource(LocalNews, '/api/local-news')

if __name__ == '__main__':
    app.run(debug=True)

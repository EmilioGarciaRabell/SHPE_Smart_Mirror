from flask import request, jsonify
from flask_restful import Resource
import os
import requests

NEWSDATA_API_KEY = os.getenv('NEWSDATA_API_KEY')
NEWSDATA_BASE_URL = 'https://newsdata.io/api/1/news'

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

from flask import render_template
from flask_restful import Resource
import requests

class RITNewsApi(Resource):
    def get(self):
        url = 'https://www.rit.edu/news'
        response = requests.get(url)
        if response.status_code != 200:
            return {'Error': 'Failed to fetch news'}, response.status_code
        text = response.text
        news_items = []
        sections = text.split('<a href="/news/')[1:]
        for news in sections:
            try:
                link = news.split('"')[0]
                title = news.split('>')[1].split('<')[0]
                news_items.append({
                    'Source':'RIT News',
                    'title': title.strip(),
                    'link': f"https://www.rit.edu/news/{link}"
                })
            except IndexError:
                continue
        return news_items[:10]
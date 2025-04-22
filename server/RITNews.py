import requests
from bs4 import BeautifulSoup
from flask_restful import Resource

class RITNewsApi(Resource):
    def get(self):
        url = 'https://www.rit.edu/news'
        response = requests.get(url)
        if response.status_code != 200:
            return {'Error': 'Failed to fetch news'}, response.status_code
        news = BeautifulSoup(response.text, 'html.parser')
        news_items = []
        articles = news.find_all('article', class_='news-teaser', limit=5)
        for article_news in articles:
            try:
                a_tag = article_news.find('a')
                link = a_tag['href']
                title = a_tag.get_text(strip=True)
                news_items.append({
                    'Source': 'RIT News',
                    'title': title,
                    'link': f"https://www.rit.edu{link}" if link.startswith('/') else link
                })
            except Exception as e:
                continue
        return news_items

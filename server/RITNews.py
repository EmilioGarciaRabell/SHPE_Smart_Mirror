import requests
from bs4 import BeautifulSoup
from flask_restful import Resource
from datetime import datetime

class RITNewsApi(Resource):
    def get(self):
        url = 'https://www.rit.edu/news'
        response = requests.get(url)
        if response.status_code != 200:
            return {'Error': 'Failed to fetch news'}, response.status_code

        soup = BeautifulSoup(response.text, 'html.parser')
        news_items = []

        articles = soup.find_all('article', class_='news-teaser', limit=5)

        for article in articles:
            try:
                a_tag = article.find('a')
                link = a_tag['href']
                full_link = f"https://www.rit.edu{link}" if link.startswith('/') else link
                title = a_tag.get_text(strip=True)

                # Attempt to grab a short description from a <div>, <p>, or use title fallback
                desc_tag = article.find('div', class_='field__item') or article.find('p')
                description = desc_tag.get_text(strip=True) if desc_tag else ''

                news_items.append({
                    'Source': 'RIT News',
                    'title': title,
                    'link': full_link,
                    'description': description,
                    'pubDate': datetime.utcnow().isoformat()
                })
            except Exception:
                continue

        return news_items

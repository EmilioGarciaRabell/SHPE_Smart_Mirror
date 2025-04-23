from flask import Flask, jsonify
from flask_restful import Resource
from jokeapi import Jokes
import asyncio

app = Flask(__name__)

class Joke(Resource):
    def get(self):
        try:
            async def fetch_joke():
                j = await Jokes()
                # could specify type: miscellaneous, pun, programming, dark...probably not dark
                joke = await j.get_joke(blacklist=['nsfw', 'racist', 'religious', 'political', 'sexist', 'explicit'])
                if joke["type"] == "single":
                    return joke["joke"]
                else: 
                    return joke['setup'] + "\n" + joke['delivery']
            joke_text = asyncio.run(fetch_joke())
            print(joke_text)
            return {'joke': joke_text}, 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500


from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS
from jokegenerator import Joke

app = Flask(__name__) #create Flask instance
CORS(app) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

api.add_resource(Joke, '/joke')

if __name__ == '__main__':
    app.run(debug=True)
import subprocess
from flask import Flask, jsonify, send_from_directory
from flask_restful import Resource, Api
from flask_cors import CORS
import os
from python_scripts import facial_recognition_login as fr

app = Flask(__name__) #create Flask instance
CORS(app) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

@app.route("/api/auth/register", methods=["POST"])    
def register_user():
    try:
        return fr.registerUser()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/face", methods=["GET"])
def faceAuth():
    try:
        return fr.faceAuth()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/auth/pin", methods=["POST"])
def authPin():
    try:
        return fr.authPin()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
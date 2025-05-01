from flask import Flask, jsonify, request, send_from_directory
from services.faceRecScript import faceRec
from services.createUser import register_User
from services.camera_script import image_recieve_ui
from services.user_gallery import get_user_gallery
import services.login as l
from flask_cors import CORS
from flask_restful import Api
import time as t
import os
import json
import traceback
from server.services.RITNews import RITNewsApi
from server.services.Weather import Weather
from server.services.TrafficLevel import TrafficLevel
from server.services.LocalNews import LocalNews
from server.services.JokeGenerator import Joke
from dotenv import load_dotenv


app = Flask(__name__)
CORS(app)
api = Api(app)

fr = faceRec()
faceTH = 85

"""
This function calls the register_User service function which handles all of the file I/O.
It recieves the dictionary with the success status and reason/user_name depending on if 
the function successfully created the user data or failed.
"""
@app.route("/api/auth/register", methods=["POST"])
def registerUser():
    data = request.get_json()
    user_name = data.get("user_name")
    user_key = data.get("user_key")
    image_data = data.get("image") 
    #print("Received data:", data)
    if not user_name or not user_key or not image_data:
        return jsonify({"success": False, "reason": "Missing fields"}), 400
    result = register_User(user_name=user_name, user_key=user_key, image_data=image_data)
    return jsonify(result), 200 if result["success"] else 400

"""
This function 
"""
@app.route("/api/auth/face", methods=["GET"])
def faceAuth():
    result = l.faceLogin()
    return jsonify(result), 200 if result["success"] else 401

@app.route("/api/auth/pin", methods=["POST"])
def authPin():
    data = request.get_json() or {}
    user_name = data.get("user")
    pin = data.get("pin")
    result = l.pinLogin(user_name=user_name, user_key=pin)
    return jsonify(result), 200 if result["success"] else 401

@app.route("/api/capture", methods=["POST"])
def capture_image():
    data = request.get_json()
    user_name = data.get("user_name")
    image_data = data.get("image")

    with open("data/users.json") as f:
        users = json.load(f)
    user = next((u for u in users if u["user_name"] == user_name), None)

    if not user:
        return jsonify({"success": False, "reason": "User not found"}), 404

    result = image_recieve_ui(str(user["user_id"]), image_data)
    return jsonify(result), 200 if result["success"] else 500

@app.route("/api/gallery", methods=["POST"])
def gallery():
    data = request.get_json()
    user_name = data.get("user_name")
    result = get_user_gallery(user_name)
    return jsonify(result), 200 if result["success"] else 404

@app.route("/user_images/<user_id>/<filename>")
def serve_user_image(user_id, filename):
    return send_from_directory(os.path.join("data", "user_data", user_id), filename)


load_dotenv()

api.add_resource(RITNewsApi, "/api/rit-news")
api.add_resource(Weather, "/api/weather")
api.add_resource(TrafficLevel, "/api/traffic-level")
api.add_resource(LocalNews, "/api/local-news")
api.add_resource(Joke, '/api/joke')

if __name__ == "__main__":
    app.run(debug=True)

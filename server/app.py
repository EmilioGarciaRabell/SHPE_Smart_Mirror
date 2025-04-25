from flask import Flask, jsonify, request
from services.faceRecScript import faceRec
from services.createUser import register_User
from services.camera_script import image_recieve_ui
import services.login as l
from flask_cors import CORS
import time as t
import cv2
import os
import json
import traceback


app = Flask(__name__)
CORS(app)

fr = faceRec()
faceTH = 85


@app.route("/api/auth/register", methods=["POST"])
def registerUser():
    data = request.get_json()
    user_name = data.get("user_name")
    user_key = data.get("user_key")
    result = register_User(user_name=user_name, user_key=user_key)
    return jsonify(result), 200 if result["success"] else 400

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



    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)

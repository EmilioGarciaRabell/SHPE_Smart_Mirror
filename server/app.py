from flask import Flask, jsonify, request
from server.services.faceRecScript import faceRec
from server.services.createUser import register_User
import server.services.login as l
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


    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)

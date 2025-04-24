'''
    Authenticate the user by checking if their pin is correct. 
'''

from flask import Flask, jsonify, request
from python_scripts.facial_recognition_scripts.faceRecScript import faceRec
import time as t


fr = faceRec()
faceTH = 85

def authPin():
    data = request.get_json() or {}
    user = data.get("user")
    pin = data.get("pin")
    expected = fr.userKeys.get(user)
    try:
        if expected is not None and int(pin) == int(expected):
            return jsonify({"status": "ok", "message": "Pin correct"}), 200
    except (TypeError, ValueError):
        pass
    return jsonify({"status": "error", "message": "Pin incorrect"}), 400


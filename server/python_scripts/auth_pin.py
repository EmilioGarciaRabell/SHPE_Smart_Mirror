'''
    Authenticate the user by checking if their pin is correct. 
'''

from flask import Flask, jsonify, request
from server.python_scripts.facial_recognition_scripts.faceRecScript import faceRec
import time as t
import cv2
import os
import json
import traceback

fr = faceRec()
faceTH = 85
userData =  request.get_json()
userName = userData.get("user_name")
userKey = userData.get("user_key")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

jsonFile = os.path.join(BASE_DIR, "user_data/users.json")
facesFolder = os.path.join(BASE_DIR, "user_data/faces")

def authPin():
    data = request.get_json() or {}
    user = data.get("user")
    pin = data.get("pin")
    expected = fr.userKeys.get(user)
    try:
        if expected is not None and int(pin) == int(expected):
            print("Pin correct")
    except (TypeError, ValueError):
        pass
    print("Pin incorrect")
    raise ValueError("Pin incorrect")


if __name__ == "__main__":
    authPin()
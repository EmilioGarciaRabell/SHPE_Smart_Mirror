'''
 Verify the user by checking if their face is recognized and if so, return their name.
'''

from flask import Flask, jsonify, request
import os
import sys
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.join(current_dir, "facial_recognition_scripts")
sys.path.append(parent_dir)
from faceRecScript import faceRec
import time as t
import cv2
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


def faceAuth():
    frLockOut = 5
    startTime = t.time()
    while t.time() - startTime < frLockOut:
        name, percentage = fr.authUser()
        if percentage >= faceTH:
            print (f"Recognized {name} with confidence {percentage:.2f}%")
        t.sleep(0.1)
    raise ValueError("Face recognition timed out")


if __name__ == "__main__":
    faceAuth()
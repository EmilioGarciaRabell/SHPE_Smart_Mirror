
'''
 Register a new user by capturing their face and storing it in the faces folder
 as well as creating a new user in the users.json file.
'''

from flask import Flask, jsonify, request
from python_scripts.facial_recognition_scripts.faceRecScript import faceRec
import time as t
import cv2
import os
import json
import traceback

fr = faceRec()
faceTH = 85


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

jsonFile = "user_data/users.json"#os.path.join(BASE_DIR, "user_data/users.json")
facesFolder = "user_data/faces"#os.path.join(BASE_DIR, "user_data/faces")


def register_user(userData, userName, userKey):
    if not userName or not userKey: 
        raise ValueError("Missing username or key")
    pictureName = f"{userName}.jpg"
    picturePath = os.path.join(facesFolder, pictureName)
    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        raise ValueError("Webcam not found")
    t.sleep(2)
    for _ in range(5):
        cam.read()
    ret, frame = cam.read()
    cam.release()
    if not ret:
        
        raise ValueError("Failed to capture image")
    cv2.imwrite(picturePath, frame)
    if not os.path.exists(jsonFile):
        users = []
    else:
        with open(jsonFile, "r") as f:
            users = json.load(f)
    existingIds = [user.get("user_id", 0) for user in users if isinstance(user.get("user_id"), int)]
    nextId = max(existingIds, default=0) + 1
    users.append({
        "user_id": nextId,
        "user_name": userName,
        "user_key": userKey,
        "user_image": pictureName
    })
    with open(jsonFile, "w") as f:
        json.dump(users, f, indent=4)
    fr.users = users
    fr.userKeys = {u['user_name']: u['user_key'] for u in users}
    fr.knownFaceEncodings = []
    fr.knownFaceNames = []
    fr.encodeFaces()
    print("User registered successfully")

# if __name__ == "__main__":
#     register_user()
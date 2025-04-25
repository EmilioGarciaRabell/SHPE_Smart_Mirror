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

jsonFile = "user_data/users.json"#os.path.join(BASE_DIR, "user_data/users.json")
facesFolder = "user_data/faces"#os.path.join(BASE_DIR, "user_data/faces")
'''
 Register a new user by capturing their face and storing it in the faces folder
 as well as creating a new user in the users.json file.
'''
def registerUser():

    if not userName or not userKey:
        return jsonify({"error": "Missing username or key"}), 400
    pictureName = f"{userName}.jpg"
    picturePath = os.path.join(facesFolder, pictureName)
    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        return jsonify({"error": "Webcam not found"}), 500
    t.sleep(2)
    for _ in range(5):
        cam.read()
    ret, frame = cam.read()
    cam.release()
    if not ret:
        return jsonify({"error": "Failed to capture image"}), 500
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
    return jsonify({"message": "User registered successfully"}), 200

'''
 Verify the user by checking if their face is recognized and if so, return their name.
'''
def faceAuth():
    frLockOut = 5
    startTime = t.time()
    while t.time() - startTime < frLockOut:
        name, percentage = fr.authUser()
        if percentage >= faceTH:
            return jsonify({"success": True, "user": name}), 200
        t.sleep(0.1)
    return jsonify({"success": False, "error": "face_not_recognized"}), 401

'''
    Authenticate the user by checking if their pin is correct. 
'''
def authPin():
    data = request.get_json() or {}
    user = data.get("user")
    pin = data.get("pin")
    expected = fr.userKeys.get(user)
    try:
        if expected is not None and int(pin) == int(expected):
            return jsonify({"success": True}), 200
    except (TypeError, ValueError):
        pass
    return jsonify({"success": False, "error": "pin_incorrect"}), 401
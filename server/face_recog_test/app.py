from flask import Flask, jsonify, request
from faceRecScript import faceRec
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
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
jsonFile = os.path.join(BASE_DIR, "users.json")
facesFolder = os.path.join(BASE_DIR, "faces")


@app.route("/api/auth/register", methods=["POST"])
def registerUser():
    try:
        userData =  request.get_json()
        userName = userData.get("user_name")
        userKey = userData.get("user_key")
        if not userName or not userKey:
            return jsonify({"error": "Missing username or key"}), 400
        pictureName = f"{userName}.jpg"
        picturePath = os.path.join(facesFolder, pictureName)
        cam = cv2.VideoCapture(0)
        if not cam.isOpened():
            return jsonify({"error": "Webcam not found"}), 500
        t.sleep(2)
        for _ in range(5):
            cam.release()
        ret, frame = cam.read()
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
        return jsonify({"message": "User registered successfully"}), 200
    except Exception as e:
        print("❌ Registration failed with exception:")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500


@app.route("/api/auth/face", methods=["GET"])
def faceAuth():
    frLockOut = 5
    startTime = t.time()
    while t.time() - startTime < frLockOut:
        name, percentage = fr.authUser()
        if percentage >= faceTH:
            return jsonify({"success": True, "user": name}), 200
        t.sleep(0.1)
    return jsonify({"success": False, "error": "face_not_recognized"}), 401

@app.route("/api/auth/pin", methods=["POST"])
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


    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)

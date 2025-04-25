import os
import cv2
import json
import time as t
import traceback
from services.faceRecScript import faceRec

"""
Directory to access the users.json file and the faces folder
"""
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
JSONFILE_DIR = os.path.join(DATA_DIR, "users.json")
FACES_DIR = os.path.join(DATA_DIR, "faces")

fr = faceRec()

def register_User(user_name: str, user_key: str) -> dict:
    try:
        if not user_name or not user_key:
            return {"success": False, "reason": "Missing username or pin"}
        userFace = f"{user_name}.jpg"
        userFacePath = os.path.join(FACES_DIR, userFace)
        webcamCapture = cv2.VideoCapture(0)
        if not webcamCapture:
            return {"success": False, "reason": "Webcam error"}
        t.sleep(2)
        for _ in range(5):
            webcamCapture.read()
        ret, frame = webcamCapture.read()
        webcamCapture.release()
        if not ret:
            return {"success": False, "reason": "Capture failed"}
        cv2.imwrite(userFacePath, frame)
        if not os.path.exists(JSONFILE_DIR):
            users = []
        else:
            with open(JSONFILE_DIR, "r") as f:
                users = json.load(f)
        existingIds = [user.get("user_id", 0) for user in users if isinstance(user.get("user_id"), int)]
        nextId = max(existingIds, default=0) + 1
        users.append({
            "user_id": nextId,
            "user_name": user_name,
            "user_key": user_key,
            "user_image": userFace
        })
        with open(JSONFILE_DIR, "w") as f:
            json.dump(users, f, indent=4)
        fr.users = users
        fr.userKeys = {u['user_name']: u['user_key'] for u in users}
        fr.knownFaceEncodings = []
        fr.knownFaceNames = []
        fr.encodeFaces()
        return {"success": True, "user": user_name}
    except:
        print("Registration failed with exception:")
        traceback.print_exc()
        return {"success": False, "reason": "internal_error"}
import os
import cv2
import json
import time as t
import traceback
from services.faceRecScript import faceRec
import base64

"""
Directory to access the users.json file and the faces folder
"""
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
JSONFILE_DIR = os.path.join(DATA_DIR, "users.json")
FACES_DIR = os.path.join(DATA_DIR, "faces")

fr = faceRec()

"""
This function is used to create a user for the smart mirror. It decodes the raw face capture data
from the frontend and converts it a jpeg file, which is then stored in the faces directory. Then 
the function writes the user's data to the users.json file. When the user's data is saved to the
json file, the function reads the json file with the updated file so that it can encode the new
user's face. It also uses try statements so the application doesn't crash. If everything is successful,
the function returns a dictionary, which is then used in the app route registerUser() so that the front end
can call this backend function.
Paramters:
    user_name(str): Input string from the frontend used as the username of user.
    user_key(str): Input string from the frontend used as the pin of user in case facial fails.
    image_data(str): Frontend picture capture raw data, which is then converted to jpeg.
Return:
    (dictionary): Contains the success status (boolean) with either the reason of failure if the
                  function failed to create user or the name of user when the function saves the
                  user data successfully.
"""
def register_User(user_name: str, user_key: str, image_data: str) -> dict:
    try:
        if not user_name or not user_key or not image_data:
            return {"success": False, "reason": "Missing data"}
        userFace = f"{user_name}.jpg"
        userFacePath = os.path.join(FACES_DIR, userFace)
        if "," in image_data:
            image_data = image_data.split(",")[1] 
        img_bytes = base64.b64decode(image_data)
        with open(userFacePath, "wb") as f:
            f.write(img_bytes)
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
        try:
            fr.knownFaceEncodings = []
            fr.knownFaceNames = []
            fr.encodeFaces()
        except Exception as face_error:
            print("Warning: Face encoding failed:", face_error)
            # Still proceed even if face encoding failed.
        return {"success": True, "user": user_name}
    except Exception as e:
        print("Registration failed with exception:")
        traceback.print_exc()
        return {"success": False, "reason": "internal_error"}

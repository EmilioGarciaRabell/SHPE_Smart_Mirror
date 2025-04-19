from flask import Flask, jsonify, request
from faceRecScript import faceRec
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

fr = faceRec()
faceTH = 85

@app.route("/api/auth/face", methods=["GET"])
def faceAuth():
    name, percentage = fr.authUser()
    if percentage >= faceTH:
        return jsonify({"success": True, "user": name}), 200
    return jsonify({"success": False, "error": "face_not_recognized"}), 401

@app.route("/api/auth/pin", methods=["GET"])
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


    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

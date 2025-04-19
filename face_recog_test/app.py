from flask import Flask, jsonify, request
from login import faceLogin, pinLogin
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/api/auth/face", methods=["POST"])
def faceAuth():
    result = faceLogin()
    status = 200 if result["success"] else 401
    return jsonify(result), status

@app.route("/api/auth/pin", methods=["POST"])
def authPin():
    data = request.get_json(force=True)
    user = data.get("name")
    pin = data.get("pin")
    result = pinLogin(user, pin)
    status = 200 if result["success"] else 401
    return jsonify(result), status

    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

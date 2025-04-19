from flask import Flask, jsonify, request
from login import login
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/api/login", methods=["POST"])
def apiLogin():
    userCheck = login()
    if userCheck:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False}), 401
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

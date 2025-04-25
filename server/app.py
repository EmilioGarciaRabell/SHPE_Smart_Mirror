import subprocess
from flask import Flask, jsonify, request, send_from_directory
from flask_restful import Resource, Api
from flask_cors import CORS
import os


from python_scripts.facial_recognition_scripts.auth_pin import authPin
from python_scripts.facial_recognition_scripts.register_user import register_user


app = Flask(__name__) #create Flask instance
CORS(app) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

@app.route("/api/auth/register", methods=["POST"])    
def reg_user():
    try:
        userData =  request.get_json()
        userName = userData.get("user_name")
        userKey = userData.get("user_key")
        register_user(userData, userName, userKey)

        # output = subprocess.check_output(['python3', 'python_scripts/facial_recognition_scripts/register_user.py'])
        # image_path = output.decode().strip()
        # filename = os.path.basename(image_path)
        return jsonify({'status': 'ok'})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/face", methods=["GET"])
def faceAuth():
    try:
        output = subprocess.check_output(['python3', 'python_scripts/facial_recognition_scripts/face_auth.py'])
        image_path = output.decode().strip()
        return jsonify({'status': 'ok', 'image_path': f"/images/{image_path}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/auth/pin", methods=["POST"])
def authPassword():
    return authPin()



@app.route('/api/capture', methods=['GET'])
def capture_image():
    try:
        output = subprocess.check_output(['python3', 'camera_script.py'])
        image_path = output.decode().strip()
        filename = os.path.basename(image_path)
        return jsonify({'status': 'ok', 'image_path': f"/images/{filename}"})
    except subprocess.CalledProcessError as e:
        return jsonify({'status': 'error', 'message': e.output.decode().strip()}), 500

if __name__ == '__main__':
    app.run(debug=True)
import subprocess
from flask import Flask, jsonify, send_from_directory
from flask_restful import Resource, Api
from flask_cors import CORS
import os


app = Flask(__name__) #create Flask instance
CORS(app) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

@app.route("/api/auth/register", methods=["POST"])    
def register_user():
    try:
        output = subprocess.check_output(['python3', 'python_scripts/facial_recognition_scripts/register_user.py'])
        image_path = output.decode().strip()
        filename = os.path.basename(image_path)
        return jsonify({'status': 'ok', 'image_path': f"/images/{filename}"})
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
def authPin():
    try:
        #return fr.authPin()
        output = subprocess.check_output(['python3', 'python_scripts/auth_pin.py'])
        return jsonify({'status': 'ok', 'message': output.decode().strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



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
import subprocess
from flask import Flask, jsonify, send_from_directory
from flask_restful import Resource, Api
from flask_cors import CORS
import os

app = Flask(__name__) #create Flask instance
CORS(app) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

@app.route('/api/capture', methods=['GET'])
def capture_image():
    try:
        output = subprocess.check_output(['python3', 'camera_script.py'])
        image_path = output.decode().strip()
        filename = os.path.basename(image_path)
        return jsonify({'status': 'ok', 'image_path': f"/images/{filename}"})
    except subprocess.CalledProcessError as e:
        return jsonify({'status': 'error', 'message': e.output.decode().strip()}), 500

# This serves images from the static/images folder
@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory('static/images', filename)

@app.route('/api/led/<action>', methods=['GET'])
def control_led(action):
    try:
        # Call the led_control.py script with the action (on/off)
        output = subprocess.check_output(['python3', 'led_control.py', action])
        message = output.decode().strip()
        return jsonify({'status': 'ok', 'message': message})
    except subprocess.CalledProcessError as e:
        return jsonify({'status': 'error', 'message': e.output.decode().strip()}), 500

@app.route('/api/face_recognition', methods=['GET'])
def face_recognition():
    try:
        # Call the faceRecScript.py script
        output = subprocess.check_output(['python3', 'face_recog_test/faceRecScript.py'])
        message = output.decode().strip()
        return jsonify({'status': 'ok', 'message': message})
    except subprocess.CalledProcessError as e:
        return jsonify({'status': 'error', 'message': e.output.decode().strip()}), 500

if __name__ == '__main__':
    app.run(debug=True)
import base64
import cv2
from datetime import datetime
import os

"""
# Generate timestamped filename
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
image_dir = os.path.join(os.path.dirname(__file__), 'images')
os.makedirs(image_dir, exist_ok=True)

image_path = os.path.join(image_dir, f"image_{timestamp}.jpg")

# Access USB camera (usually index 0)
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Camera not accessible")
    exit(1)

ret, frame = cap.read()
cap.release()

if ret:
    cv2.imwrite(image_path, frame)
    print(image_path)
else:
    print("Failed to capture image")
    exit(1)
"""


def image_capture(user_id: str) -> dict:
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    base_dir = os.path.dirname(__file__)
    user_data_dir = os.path.join(base_dir, "..", "data", "user_data")
    this_user_data_dir = os.path.join(user_data_dir, user_id)
    os.makedirs(this_user_data_dir, exist_ok=True)
    image_path = os.path.join(this_user_data_dir, f"image_{timestamp}.jpg")
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        #raise RuntimeError("Camera not accessible")
        return {"success": False, "reason": "Camera not accessible"}
    ret, frame = cap.read()
    cap.release()   
    if ret:
        cv2.imwrite(image_path, frame)
        return {"success": True, "image_name": f"image_{timestamp}.jpg"}
    else:
        return {"success": False, "reason": "Failed to capture"}
    
def image_recieve_ui(user_id: str, image_data: str) -> dict:
    try:
        # Create timestamped filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        base_dir = os.path.dirname(__file__)
        user_data_dir = os.path.join(base_dir, "..", "data", "user_data")
        this_user_data_dir = os.path.join(user_data_dir, user_id)
        os.makedirs(this_user_data_dir, exist_ok=True)

        filename = f"image_{timestamp}.jpg"
        image_path = os.path.join(this_user_data_dir, filename)

        # Strip off base64 header if present
        if "," in image_data:
            image_data = image_data.split(",")[1]

        # Decode and write to file
        with open(image_path, "wb") as f:
            f.write(base64.b64decode(image_data))

        return {"success": True, "image_name": filename}
    except Exception as e:
        return {"success": False, "reason": str(e)}
    
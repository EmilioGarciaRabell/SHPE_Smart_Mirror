import cv2
from datetime import datetime
import os

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

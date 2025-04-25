import cv2
import face_recognition

# Start video capture
video_capture = cv2.VideoCapture(0)

print("Press 'q' to quit.")

while True:
    ret, frame = video_capture.read()

    # Convert from BGR (OpenCV) to RGB (face_recognition needs RGB)
    rgb_frame = frame[:, :, ::-1]

    # Detect all face locations using face_recognition (HOG-based by default)
    face_locations = face_recognition.face_locations(rgb_frame)

    # Draw boxes on the original BGR frame
    for top, right, bottom, left in face_locations:
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

    # Display the resulting frame
    cv2.imshow('Face Detection (face_recognition)', frame)

    # Exit on 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup
video_capture.release()
cv2.destroyAllWindows()

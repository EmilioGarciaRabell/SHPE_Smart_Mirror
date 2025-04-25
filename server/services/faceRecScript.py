import face_recognition
import cv2
import os, sys
import numpy as np
import math
import json


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
usersFileIn = os.path.join(DATA_DIR, "users.json")
facesFolder = os.path.join(DATA_DIR, "faces")

"""
A data class that handles the facial recognition.
"""
class faceRec:
    """
    This initializes the faceRec data class and encodes the pictures from the 'faces' folder.
    """
    def __init__(self, usersFileIn, facesFolder):
        with open(usersFileIn, 'r') as f:
            self.users = json.load(f)
        self.userKeys = {u['user_name']: u['user_key'] for u in self.users}
        self.facesFolder = facesFolder
        self.faceLocations = []
        self.faceEncodings = []
        self.faceNames = []
        self.knownFaceEncodings = []
        self.knownFaceNames = []
        self.procActualFace = True
        self.encodeFaces()


    """
    This encodes all of the faces stored in the 'faces' folder. Each picture is processed and its
    encoding is stored along with the file name
    """
    def encodeFaces(self):
        for user in self.users:
            imgPath = os.path.join(self.facesFolder, user['user_image'])
            if not os.path.exists(imgPath):
                raise FileNotFoundError(f"Missing file: {imgPath}")
            faceImage = face_recognition.load_image_file(imgPath)
            encodings = face_recognition.face_encodings(faceImage)
            if not encodings:
                raise RuntimeError(f"No face found in {imgPath}")
            self.knownFaceEncodings.append(encodings[0])
            self.knownFaceNames.append(user['user_name'])
        print("Loaded users:", self.knownFaceNames)

    """
    This function starts the facial recognition using the webcam. It detects faces in real-time,
    matches them with known faces, and displays the results. To exit out of the window, the key
    'q' can be pressed to exit out of th webcam window. The exiting method is just for testing 
    purposes.
    """
    def runFR(self):
        webcamVideo = cv2.VideoCapture(0)
        if not webcamVideo.isOpened():
            sys.exit('Webcam not found!')
        while True:
            ret, frame = webcamVideo.read()

            if self.procActualFace:
                smallFrame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
                rgbSmallFrame = np.ascontiguousarray(smallFrame)
                self.faceLocations = face_recognition.face_locations(rgbSmallFrame)
                self.faceEncodings = face_recognition.face_encodings(rgbSmallFrame, self.faceLocations)
                self.faceNames = []
                for faceEncoding in self.faceEncodings:
                    matches =  face_recognition.compare_faces(self.knownFaceEncodings, faceEncoding)
                    name = 'Unknown'
                    confidence = 'Unknown'
                    faceDistances = face_recognition.face_distance(self.knownFaceEncodings, faceEncoding)
                    bestMatchIndex = np.argmin(faceDistances)
                    if matches[bestMatchIndex]:
                        name = self.knownFaceNames[bestMatchIndex]
                        confidence = faceMatchPercentage(faceDistances[bestMatchIndex])
                    self.faceNames.append(f'{name} ({confidence})')
            self.procActualFace = not self.procActualFace
            for(top, right, bottom, left), name in zip(self.faceLocations, self.faceNames):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255, 2))
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), -1)
                cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)
            cv2.imshow('Face Recognition', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        webcamVideo.release()
        cv2.destroyAllWindows()
    
    def authUser(self, cameraIndex = 0, faceTH=0.60):
        webcamVideo = cv2.VideoCapture(0)
        if not webcamVideo:
            raise RuntimeError("Cannot open camera")
        ret, frame = webcamVideo.read()
        webcamVideo.release()
        if not ret:
            raise RuntimeError("Cannot read frame")
        small = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb = np.ascontiguousarray(small[:, :, ::-1])
        locs = face_recognition.face_locations(rgb)
        if not locs:
            return None, 0.0
        encodings = face_recognition.face_encodings(rgb, locs)
        distances = face_recognition.face_distance(self.knownFaceEncodings, encodings[0])
        bestIndex = np.argmin(distances)
        percentageStr = faceMatchPercentage(distances[bestIndex])
        percentageStr = percentageStr.rstrip("%")
        percentage = float(percentageStr)
        if distances[bestIndex] <= faceTH:
            nameTemp = self.knownFaceNames[bestIndex]
            name, ext = os.path.splitext(nameTemp)
            return name, percentage
        else:
            return None, percentage

"""
This function calculates the percentage of a face match based on the face distance.
Parameters:
    faceDistance(float): The distance between the known face encoding and the detected
                         face encoding.
    faceTH: The threshold value for face matching, which the default is set to 60%.
Return:
    (str): The confidence percentage as a string so that it can be printed on webcam feed's face rectangle.
"""
def faceMatchPercentage(faceDistance, faceTH=0.60):
    range = 1.0 - faceTH
    linearVal = (1.0 - faceDistance) / (range * 2.0)
    if faceDistance > faceTH:
        return str(round(linearVal * 100 , 2)) + "%"
    else:
        val = (linearVal + ((1.0 - linearVal) * math.pow((linearVal - 0.5) * 2, 0.2))) * 100
        return str(round(val, 2)) + "%"
    
"""
The main function of the facial recognition script. It calls the facial recognition data class to
initialize it and after that the facial recognition process begins. 
"""
if __name__ == '__main__':
    facialRecognition = faceRec()
    facialRecognition.runFR()

    




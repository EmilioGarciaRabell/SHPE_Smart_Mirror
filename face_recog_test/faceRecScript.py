import face_recognition
import cv2
import os, sys
import numpy as np
import math

class faceRec:
    faceLocations = []
    faceEncodings = []
    faceNames = []
    knownFaceEncodings = []
    knownFaceNames = []
    procActualFace = True

    def __init__(self):
        self.encodeFaces()

    def encodeFaces(self):
        for image in os.listdir('faces'):
            faceImage = face_recognition.load_image_file(f'faces/{image}')
            faceEncoding =  face_recognition.face_encodings(faceImage)[0]
            self.knownFaceEncodings.append(faceEncoding)
            self.knownFaceNames.append(image)
        print(self.knownFaceNames)

    def runFR(self):
        webcamVideo = cv2.VideoCapture(0)
        if not webcamVideo.isOpened():
            sys.exit('Webcam not found!')
        while True:
            ret, frame = webcamVideo.read()
            if self.procActualFace:
                smallFrame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
                rgbSmallFrame = smallFrame[:, :, ::-1]
                self.faceLocations = face_recognition.face_locations(rgbSmallFrame)
                self.faceEncodings = face_recognition.face_encodings(rgbSmallFrame, self.faceLocations)
                self.faceNames = []
                for faceEncoding in self.faceEncodings:
                    matches =  face_recognition.compare_faces(self.knownFaceEncodings, faceEncoding)
                    name = "Unknown"
                    confidence = "Unknown"
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
                if cv2.waitKey(1) == ord('q'):
                    break
            webcamVideo.release()
            cv2.destroyAllWindows()


def faceMatchPercentage(faceDistance, faceTH=0.60):
    range = 1.0 - faceTH
    linearVal = (1.0 - faceDistance) / (range * 2.0)
    if faceDistance > faceTH:
        return str(round(linearVal * 100 , 2)) + "%"
    else:
        val = (linearVal + ((1.0 - linearVal) * math.pow((linearVal - 0.5) * 2, 0.2))) * 100
        return str(round(val, 2)) + "%"
    

if __name__ == '__main__':
    facialRecognition = faceRec()
    facialRecognition.runFR()

    




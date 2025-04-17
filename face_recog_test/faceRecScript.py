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
    
    




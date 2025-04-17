import face_recognition
import cv2
import os, sys
import numpy as np
import math

def faceMatchPercentage(faceDistance, faceTH=0.60):
    range = 1.0 - faceTH
    linearVal = (1.0 - faceDistance) / (range * 2.0)
    if faceDistance > faceTH:
        return str(round(linearVal * 100 , 2)) + "%"
    else:
        value = 
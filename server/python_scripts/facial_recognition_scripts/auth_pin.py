'''
    Authenticate the user by checking if their pin is correct. 
'''

from flask import Flask, jsonify, request
import os
import sys
from faceRecScript import faceRec
import time as t
import cv2
import json
import traceback

fr = faceRec()
faceTH = 85

def authPin():
    data = request.get_json() or {}
    user = data.get("user")
    pin = data.get("pin")
    expected = fr.userKeys.get(user)
    try:
        if expected is not None and int(pin) == int(expected):
            print("Pin correct")
    except (TypeError, ValueError):
        pass
    print("Pin incorrect")
    raise ValueError("Pin incorrect")


if __name__ == "__main__":
    authPin()
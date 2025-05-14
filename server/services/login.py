from services.faceRecScript import faceRec
import time as t
import getpass as g

faceTH = 85
frLockOut = 5

"""
This function uses the faceRec data class function authUser, which contains
the facial recognition logic. The authUser then returns the name of user and
there facial match percentage comparing the current face capture to the stored
face pictures. If the percentage is 85% or more, this function returns a dictionary
with the success status, name of user, and percentage match. Otherwise it returns
a the success status and the reason that the facial recognition failed. This function
runs the facial recognition for 5 seconds, then terminates if the face is not recognized.
Return:
    (dictionary): contains the success status()
"""
def faceLogin() -> dict:
    fr = faceRec()
    start = t.time()
    while t.time() - start < frLockOut:
        name, percentage = fr.authUser()
        if percentage >= faceTH:
            return {"success": True, "user": name, "percentage": percentage}
        t.sleep(0.1)
    return {"success": False, "reason": "face_not_recognized"}

def pinLogin(user_name: str, user_key: str) -> dict:
    fr = faceRec()
    expected = fr.userKeys.get(user_name)
    try:
        if expected is not None and int(user_key) == int(expected):
            return {"success": True}
    except (TypeError, ValueError):
        pass
    return {"success": False, "reason": "pin_incorrect"}


def loginTest():
    frLockOut = 5
    faceTH = 85
    startTime = t.time()
    nameOfUser = ""
    while t.time() - startTime < frLockOut:
        name, percentage = fr.authUser()
        if percentage >= faceTH:
            print(f"Welcome {name}")
            nameOfUser += name
            return True
        t.sleep(0.1)
    print("Face not recognized! You must use your pin to login.")
    for _ in range(3):
        pin = g.getpass("PIN: ")
        if pin == "1234":
            print(f"Correct pin, welcome {nameOfUser}!")
            return True
        else:
            print("Incorrect pin, try again!")
    print("Access Denied!")
    return False

if __name__ == "__main__":
    loginTest()

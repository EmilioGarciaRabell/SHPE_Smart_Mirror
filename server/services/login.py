from services.faceRecScript import faceRec
import time as t
import getpass as g

faceTH = 85
frLockOut = 5


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

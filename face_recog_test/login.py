from faceRecScript import faceRec as fr
import time as t
import getpass as g

def faceLogin() -> dict:
    auth = fr()
    start = t.time()
    frLockOut = 5
    faceTH = 85
    while t.time() - start < frLockOut:
        name, percentage = auth.authUser()
        if percentage >= faceTH:
            return {"success": True, "user": name, "percentage": percentage}
        t.sleep(0.1)
    return {"success": False, "reason": "face_not_recognized"}

def pinLogin(user: str, pin: str) -> dict:
    auth = fr()
    if user not in auth.userKeys:
        return {"success": False, "reason": "no_such_user"}
    if str(auth.userKeys[user]) == str(pin):
        return {"success": True}
    else:
        return {"success": False, "reason": "wrong_pin"}


def loginTest():
    auth = fr()
    frLockOut = 5
    faceTH = 85
    startTime = t.time()
    nameOfUser = ""
    while t.time() - startTime < frLockOut:
        name, percentage = auth.authUser()
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

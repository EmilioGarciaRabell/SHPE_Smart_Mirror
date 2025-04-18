from faceRecScript import faceRec as fr
import time as t
import getpass as g


def login():
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
    userVerification = login()
    if userVerification == True:
        print("Go to main menu")
    else:
        print("Shut screen off.")

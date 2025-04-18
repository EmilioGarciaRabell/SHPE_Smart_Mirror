from faceRecScript import faceRec

auth = faceRec()
name, percentage = auth.authUser()
faceTH = 85
if(percentage >= faceTH):
    print(f"Welcome {name}!")
else:
    print(f"Access Denined!")


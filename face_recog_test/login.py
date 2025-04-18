from faceRecScript import faceRec

auth = faceRec()
name, percentage = auth.authUser()
if({name}):
    print(f"Welcome {name} ({percentage:.1f}%)")
else:
    print(f"Access denied! ({percentage:.1f}%)")


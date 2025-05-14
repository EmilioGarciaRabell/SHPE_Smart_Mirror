import os
import json

def get_user_gallery(user_name:str) -> dict:
    try:
        users_file = os.path.join(os.path.dirname(__file__), "..", "data", "users.json")
        with open(users_file) as f:
            users = json.load(f)

        user = next((u for u in users if u["user_name"] == user_name), None)
        if not user:
            return {"success": False, "reason": "User not found"}

        user_id = str(user["user_id"])
        user_dir = os.path.join(os.path.dirname(__file__), "..", "data", "user_data", user_id)
        if not os.path.exists(user_dir):
            return {"success": True, "images": []}

        images = sorted(
            [f for f in os.listdir(user_dir) if f.lower().endswith(".jpg")],
            reverse=True
        )

        image_urls = [f"/user_images/{user_id}/{img}" for img in images]
        return {"success": True, "images": image_urls}

    except Exception as e:
        return {"success": False, "reason": str(e)}
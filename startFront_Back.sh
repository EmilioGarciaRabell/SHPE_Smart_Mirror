#!/bin/bash

# Kill any process using port 5000 (Flask default)
echo "Killing any process using port 5000..."
fuser -k 5000/tcp


# Go to the backend directory
cd ~/SHPE_Smart_Mirror/server || exit 1

# Activate Python virtual environment
#source py3.9env/bin/activate

# Start the backend in the background
echo "Starting Flask backend..."
python app.py &
BACKEND_PID=$!

# Go to the frontend directory
cd ../front/client || exit 1

# Start the frontend
echo "Starting Vite frontend..."
npm run dev

# If frontend stops, kill backend
echo "Stopping backend..."
kill $BACKEND_PID

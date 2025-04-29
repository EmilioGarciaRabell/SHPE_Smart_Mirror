#!/bin/bash

# Kill any process using port 5000 (Flask default)
echo "Killing any process using port 5000..."
fuser -k 5000/tcp

export VITE_API_URL="http://localhost:5000"

# Start the backend (Flask app) in the background
echo "Starting backend..."
cd ~/SHPE_Smart_Mirror/server || exit 1
python app.py &
BACKEND_PID=$!
cd ..

# Start the frontend (Vite) in the background
echo "Starting frontend..."
cd ~/SHPE_Smart_Mirror/front/client || exit 1
npm install
npm run build &
FRONTEND_PID=$!

# Give the frontend a few seconds to fully start
sleep 8

# Open Chromium in fullscreen to localhost:5173
echo "Opening Chromium in fullscreen mode..."
chromium-browser --start-fullscreen http://localhost:5173 &

# Wait for background processes if needed
wait $BACKEND_PID
wait $FRONTEND_PID

#!/usr/bin/env bash
set -euo pipefail

echo "Killing anything on port 5000..."
fuser -k 5000/tcp || true

# ——— START BACKEND ———
echo "Launching backend in LXTerminal..."
lxterminal --title="SmartMirror Backend" \
  --command="bash -c 'cd \"$HOME/SHPE_Smart_Mirror/server\" || exit 1; \
               echo \"Running Flask server...\"; \
               python app.py; \
               exec bash'" &

# ——— START FRONTEND ———
echo "Launching frontend in LXTerminal..."
lxterminal --title="SmartMirror Frontend" \
  --command="bash -c 'cd \"$HOME/SHPE_Smart_Mirror/front\" || exit 1; \
               export VITE_API_URL=\"http://localhost:5000\"; \
               echo \"Running Vite dev server...\"; \
               npm run dev; \
               exec bash'" &

# ——— GIVE SERVERS TIME TO SPIN UP ———
echo "Waiting for services to start..."
sleep 8

# ——— OPEN CHROMIUM ———
echo "Opening Chromium in fullscreen mode..."
chromium-browser --start-fullscreen http://localhost:5173 &

echo "All done. Check your two terminals for logs and your browser for the app!"

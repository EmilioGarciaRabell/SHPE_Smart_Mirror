#!/bin/bash
echo "[INFO] Looking for processes using /dev/video0..."

pids=$(lsof /dev/video0 | awk 'NR>1 {print $2}' | sort -u)

if [ -z "$pids" ]; then
  echo "[INFO] No processes using /dev/video0"
else
  echo "[INFO] Killing PIDs: $pids"
  kill -9 $pids
fi

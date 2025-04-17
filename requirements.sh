#!/bin/bash

# Update package list and ensure pip is installed
# echo "Updating system and installing pip..."
# sudo apt update
# sudo apt install -y python3-pip

# Install required Python packages
echo "Installing Python packages..."
pipenv install Flask==2.2.2 \
             Flask-Cors==3.0.10 \
             Flask-RESTful==0.3.9 \
             psycopg2-binary

echo "Installation complete."

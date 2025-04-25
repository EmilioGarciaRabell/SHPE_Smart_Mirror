#!/bin/bash
set -euo pipefail

PYTHON_VERSION=3.9.18
VENV_NAME=py3.9env

sudo apt update
sudo apt install -y \
  build-essential curl git libssl-dev zlib1g-dev libbz2-dev \
  libreadline-dev libsqlite3-dev wget llvm libncurses5-dev \
  libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev

if [ ! -d "$HOME/.pyenv" ]; then
  git clone https://github.com/pyenv/pyenv.git ~/.pyenv
  git clone https://github.com/pyenv/pyenv-virtualenv.git ~/.pyenv/plugins/pyenv-virtualenv
fi

export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

if ! pyenv versions --bare | grep -qx "$PYTHON_VERSION"; then
  pyenv install "$PYTHON_VERSION"
else
  echo "Python $PYTHON_VERSION already installed"
fi

if pyenv virtualenvs --bare | grep -qx "$VENV_NAME"; then
  echo "Virtualenv $VENV_NAME already exists"
else
  pyenv virtualenv "$PYTHON_VERSION" "$VENV_NAME"
fi

pyenv local py3.9env

pyenv activate "$VENV_NAME"

echo "Now using: $(python --version)  (from $(which python))"

# Update package list and ensure pip is installed
# echo "Updating system and installing pip..."
# sudo apt update
# sudo apt install -y python3-pip
pip install --upgrade pipenv

# Install required Python packages
echo "Installing Python packages..."
pip install Flask==2.2.2 \
                Flask-Cors==3.0.10 \
                Flask-RESTful==0.3.9 \
                psycopg2-binary \
                face-recognition \
                opencv-python \
                jokeapi

echo "Installation complete."

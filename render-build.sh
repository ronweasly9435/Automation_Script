#!/bin/bash
set -e # Exit on error

# Install Chrome (correct package name for Render)
sudo apt-get update
sudo apt-get install -y wget gnupg
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Verify installation
ls -la /usr/bin/google-chrome # This should exist

# Install Node dependencies
npm install --production
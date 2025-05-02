#!/bin/bash
set -ex # Debug mode

# Install latest Chrome
curl -Lo chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./chrome.deb
rm chrome.deb

# Verify exact binary path
sudo find / -name "chrome" -type f 2>/dev/null | grep -i google

# Install Node modules
npm install --production
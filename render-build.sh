#!/bin/bash

# Install Chrome for Puppeteer
apt-get update
apt-get install -y google-chrome-stable

# Install Node.js dependencies
npm install --production
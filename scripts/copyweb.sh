#!/bin/bash
# This script copies the web files to the dist folder

# Create necessary directories if they don't exist
mkdir -p ./dist/web

# Remove existing directories
rm -rf ./dist/web/public
rm -rf ./dist/web/html

# Create new directories
mkdir -p ./dist/web/public
mkdir -p ./dist/web/html

# Copy files from source to destination
cp -r ./src/web/public/* ./dist/web/public/
cp -r ./src/web/html/* ./dist/web/html/

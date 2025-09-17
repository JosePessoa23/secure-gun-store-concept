#!/bin/sh

# Ensure the script fails on any command error
set -e

# Define your key and remote server details
KEY="desofs_key.pem"
REMOTE_USER="azureuser"
REMOTE_HOST="172.174.228.188"
REMOTE_DIR="/home/azureuser/locknload/backend/"
ENV_CONTENT="YOUR_ENV_VARIABLES_HERE"

# Save the current directory
CURRENT_DIR=$(pwd)

# Go to dist/backend/backend and delete config.js and config.js.map
cd dist/backend/backend
rm config.js
rm config.js.map

# Go back to the dist/backend directory
cd ..

# Create a tarball of the backend dist folder
touch backend.tar.gz
tar --exclude=backend.tar.gz -zcvf backend.tar.gz .

# Move back to the original directory
cd "$CURRENT_DIR"

# Update permissions and deploy the tarball
chmod 600 $KEY
scp -o StrictHostKeyChecking=no -i $KEY dist/backend/backend.tar.gz $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

# Clean up the local tarball
rm dist/backend/backend.tar.gz

# Connect to the server, extract the tarball, create the .env file, and restart PM2 processes
ssh -o StrictHostKeyChecking=no -i $KEY $REMOTE_USER@$REMOTE_HOST "
  tar -xzf $REMOTE_DIR/backend.tar.gz -C $REMOTE_DIR &&
  rm $REMOTE_DIR/backend.tar.gz &&
  pm2 restart all
"

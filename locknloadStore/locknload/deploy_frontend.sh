#!/bin/sh

# Ensure the script fails on any command error
set -e

# Define your key and remote server details
KEY="desofs_key.pem"
REMOTE_USER="azureuser"
REMOTE_HOST="172.174.228.188"
REMOTE_DIR="/home/azureuser/locknload/frontend/"

# Save the current directory
CURRENT_DIR=$(pwd)

# Go to dist/frontend/assets and delete config.json
cd dist/frontend/assets
rm config.json

# Go back to the dist/frontend directory
cd ..

# Create a tarball of the frontend dist folder
touch frontend.tar.gz
tar --exclude=frontend.tar.gz -zcvf frontend.tar.gz .

# Move back to the original directory
cd "$CURRENT_DIR"

# Update permissions and deploy the tarball
chmod 600 $KEY
scp -o StrictHostKeyChecking=no -i $KEY dist/frontend/frontend.tar.gz $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

# Clean up the local tarball
rm dist/frontend/frontend.tar.gz

# Connect to the server and extract the tarball
ssh -o StrictHostKeyChecking=no -i $KEY $REMOTE_USER@$REMOTE_HOST "tar -xzf $REMOTE_DIR/frontend.tar.gz -C $REMOTE_DIR && rm $REMOTE_DIR/frontend.tar.gz"

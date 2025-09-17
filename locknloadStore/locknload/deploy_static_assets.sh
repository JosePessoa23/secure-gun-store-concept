#!/bin/bash

STATIC_ASSETS_PATH="node_modules/@taiga-ui/icons/src"
REMOTE_PATH="/home/azureuser/locknload/frontend/assets/taiga-ui/icons/"
REMOTE_HOST="azureuser@172.174.228.188"

scp -o StrictHostKeyChecking=no -i desofs_key.pem -r $STATIC_ASSETS_PATH $REMOTE_HOST:$REMOTE_PATH

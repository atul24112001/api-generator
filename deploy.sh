#!/bin/bash
export PATH=$PATH:/root/.nvm/versions/node/v20.9.0/bin

POSTGRESS_DATABASE_PASSWORD="$1"
BACKEND_IMAGE_NAME="api-generator-backend"
FRONTEND_IMAGE_NAME="api-generator-frontend"
DATABASE_URL="postgres://postgres:$POSTGRESS_DATABASE_PASSWORD@164.68.103.23:1001"
IMAGE_TAG="latest"
DATABASE_NETWORK="postgres_bridge"
PORTS=(8001 8002)
DATABASE_NAME="api_generator"
FRONTEND_PORT=3001
 
cd ~/api-generator
git stash
git pull origin main

cd ~/api-generator/server
npm install
npm run build
pm2 delete api-generator-backend
pm2 start npm --name "api-generator-backend" -- start

cd ~/api-generator/frontend
npm install
npm run build
pm2 delete api-generator-frontend
pm2 start npm --name "api-generator-frontend" -- start
#!/bin/bash
export PATH=$PATH:/root/.nvm/versions/node/v20.9.0/bin

POSTGRESS_DATABASE_PASSWORD="$1"
BACKEND_IMAGE_NAME="api-generator-backend"
FRONTEND_IMAGE_NAME="api-generator-frontend"
DATABASE_URL="postgres://postgres:$POSTGRESS_DATABASE_PASSWORD@postgres_database:5432"
IMAGE_TAG="latest"
DATABASE_NETWORK="postgres_bridge"
PORTS=(8001 8002)
DATABASE_NAME="api_generator"
FRONTEND_PORT=3001
 
cd ~/api-generator
git pull origin main

if [ $? -eq 0 ]; then
  echo "Git pull api generator successful."
else
  echo "Git pull api generator failed. Aborting deployment."
  exit 1
fi


# back-end 
echo "Running backend build"
cd ~/api-generator/server

for PORT in "${PORTS[@]}"
do
  docker stop $BACKEND_IMAGE_NAME-$PORT
  docker rm $BACKEND_IMAGE_NAME-$PORT
done

docker rmi atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG
docker build -t atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG .

if [ $? -eq 0 ]; then
  echo "Docker image atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG built successfully."
else
  echo "Docker image build failed."
  exit 1
fi

for PORT in "${PORTS[@]}"
do
  docker run -e DATABASE_URL=$DATABASE_URL/$DATABASE_NAME --name $BACKEND_IMAGE_NAME-$PORT --network $DATABASE_NETWORK -d -p $PORT:8000 atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG
done

# Front-end 
echo "Running fronend build"
cd ~/api-generator/frontend
docker stop $FRONTEND_IMAGE_NAME
docker rm $FRONTEND_IMAGE_NAME
docker rmi atul24112001/$FRONTEND_IMAGE_NAME:$IMAGE_TAG
docker build -t atul24112001/$FRONTEND_IMAGE_NAME:$IMAGE_TAG .

if [ $? -eq 0 ]; then
  echo "Docker image atul24112001/$FRONTEND_IMAGE_NAME:$IMAGE_TAG built successfully."
else
  echo "Docker image build failed."
  exit 1
fi
docker run --name $FRONTEND_IMAGE_NAME -d -p $FRONTEND_PORT:3000 atul24112001/$FRONTEND_IMAGE_NAME:$IMAGE_TAG

echo "Build Successfully."
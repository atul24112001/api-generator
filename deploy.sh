#!/bin/bash

BACKEND_IMAGE_NAME="api-generator-backend"
DATABASE_URL="postgres://postgres:$POSTGRESS_DATABASE_PASSWORD@postgres_database:5432"
IMAGE_TAG="latest"
DATABASE_NETWORK="postgres_bridge"
PORTS=(8001 8002)
DATABASE_NAME="api_generator"

git pull origin main
cd server
npm install
cd ../frontend
npm install
cd ..

if [ $? -eq 0 ]; then
  echo "Git backend pull successful."
else
  echo "Git backend pull failed. Aborting deployment."
  exit 1
fi

cd server
for PORT in "${PORTS[@]}"
do
  docker stop $BACKEND_IMAGE_NAME-$PORT
  docker rm $BACKEND_IMAGE_NAME-$PORT
done
docker rmi atul24112001/$BACKEND_IMAGE_NAME
docker build -t atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG .
cd ..

if [ $? -eq 0 ]; then
  echo "Docker image atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG built successfully."
else
  echo "Docker image build failed."
  exit 1
fi

for PORT in "${PORTS[@]}"
do
  docker run -e DATABASE_URL=$DATABASE_URL/$DATABASE_NAME --name $BACKEND_IMAGE_NAME-$PORT --network $DATABASE_NETWORK -d -p $PORT:8000 atul24112001/$BACKEND_IMAGE_NAME
done

cd frontend
rm -r .next
npm run build
cd ..

pm2 restart api-generator-frontend 

echo "Build Successfully."
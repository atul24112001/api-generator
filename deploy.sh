#!/bin/bash
export PATH=$PATH:/root/.nvm/versions/node/v20.9.0/bin

POSTGRESS_DATABASE_PASSWORD="$1"
BACKEND_IMAGE_NAME="api-generator-backend"
DATABASE_URL="postgres://postgres:$POSTGRESS_DATABASE_PASSWORD@postgres_database:5432"
IMAGE_TAG="latest"
DATABASE_NETWORK="postgres_bridge"
PORTS=(8001 8002)
DATABASE_NAME="api_generator"

git pull origin main

if [ $? -eq 0 ]; then
  echo "Git backend pull successful."
else
  echo "Git backend pull failed. Aborting deployment."
  exit 1
fi

cd ~/api-generator/server
npm install

for PORT in "${PORTS[@]}"
do
  docker stop $BACKEND_IMAGE_NAME-$PORT
  docker rm $BACKEND_IMAGE_NAME-$PORT
done

docker rmi atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG
docker build -t atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG .
IMAGE_ID=$(docker build -t $BACKEND_IMAGE_NAME:$IMAGE_TAG . | tail -n 1 | awk '{print $3}')

if [ $? -eq 0 ]; then
  echo "Docker image atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG built successfully."
else
  echo "Docker image build failed."
  exit 1
fi

for PORT in "${PORTS[@]}"
do
  docker run -e DATABASE_URL=$DATABASE_URL/$DATABASE_NAME --name $BACKEND_IMAGE_NAME-$PORT --network $DATABASE_NETWORK -d -p $PORT:8000 $IMAGE_ID
done

cd ~/api-generator/frontend
npm install
rm -r .next
npm install
npm run build

pm2 restart api-generator-frontend 

echo "Build Successfully."
FROM node:latest

WORKDIR /app

COPY package.json package.json
RUN npm install pm2 -G
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD pm2 start ./deploy.json

FROM node:latest

WORKDIR /app
COPY . .
RUN npm install
RUN npm install pm2 -G
RUN npm run build
EXPOSE 3000
CMD pm2 start ./deploy.json

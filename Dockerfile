FROM node:latest

WORKDIR /app
COPY ./package*.json ./
RUN npm install
RUN npm install pm2 --global
COPY . .
RUN npm run build
EXPOSE 3000

CMD pm2-runtime start /app/deploy.json

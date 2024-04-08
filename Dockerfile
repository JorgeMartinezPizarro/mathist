FROM node:latest

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install pm2 --global
RUN pm2 list
EXPOSE 3000
CMD [ "pm2-runtime", "start", "deploy.json", "--watch" ]

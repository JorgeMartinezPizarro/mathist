FROM node:latest

WORKDIR /app
COPY ./package*.json ./
RUN npm install
RUN npm install pm2 --global
COPY . .
RUN npm run build
RUN pm2 list
EXPOSE 3000
CMD npm run start
#CMD pm2-runtime start deploy.json

FROM node:latest

WORKDIR /app
COPY ./package*.json ./
RUN npm install
RUN npm install pm2 --global
COPY . .
RUN npm run build
EXPOSE 3000
RUN pm ls
RUN pm2 stop all
RUN pm2 kill all
CMD ["pm2-runtime", "start", "deploy.json"]

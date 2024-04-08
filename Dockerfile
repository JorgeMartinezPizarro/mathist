FROM node:latest

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm install pm2 -G
EXPOSE 3000
CMD ["sh", "-c", "pm2 deploy.js"]

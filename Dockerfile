FROM node:latest

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm install pm2 -g
RUN pm2 list
EXPOSE 3000
CMD ["sh", "-c", "pm2 start deploy.js"]

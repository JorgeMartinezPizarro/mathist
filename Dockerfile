FROM keymetrics/pm2:latest-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD pm2 start ./deploy.json

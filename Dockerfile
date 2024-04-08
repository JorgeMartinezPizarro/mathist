FROM keymetrics/pm2:latest-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN ls -al -R .
EXPOSE 3000
CMD pm2 start ./deploy.json --no-daemon --watch

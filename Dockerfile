FROM node:latest

WORKDIR /app

COPY package.json package.json
RUN npm install
RUN npm run build
COPY . .
EXPOSE 3000
CMD npm run dev

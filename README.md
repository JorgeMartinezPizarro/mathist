## About

Mathist is a math website, using the power of BigInt and mathjs to do some random calculations. It is deployed under [`mather`](https://mather.ideniox.com).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

To get it running locally, you need to install latest `node` and `npm`.

To run a dev version 

```
npm run dev
```

To build and run production: 
```
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker

There is a version of mathist dockerized under [hub.docker.com](https://hub.docker.com/repository/docker/jorgemartinezpizarro/mathist). 

To run it you need `docker` and `docker-compose` installed on your machine and run:

```
docker run -d jorgemartinezpizarro/mathist:latest
```
## About

Mathist is a math website, using the power of BigInt and mathjs to do the calculations. It is deployed under [`mather.ideniox.com`](https://mather.ideniox.com).

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

Open [localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker

There is a version of mathist dockerized under [hub.docker.com](https://hub.docker.com/repository/docker/jorgemartinezpizarro/mathist).

To run it you need `docker` installed on your system and run:

```
docker run -d jorgemartinezpizarro/mathist:latest
```

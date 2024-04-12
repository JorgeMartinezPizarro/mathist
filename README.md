## About

Mathist is a math website, using the power of BigInt and mathjs to do the calculations. It is deployed under [mather.ideniox.com](https://mather.ideniox.com).

## Local

To get it running locally, you need to install the latest `node` and `npm`.

To run a develop version :

```
npm run dev
```

To build and run a production version: 

```
npm run build
npm run start
```

Running in production will fail the `sieve` to `DOWNLOAD`, `public/files` generated on the fly. Needed an additional strategy. I solved it with a httpd docker.

Open [localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker

There is a version of mathist dockerized under [hub.docker.com](https://hub.docker.com/repository/docker/jorgemartinezpizarro/mathist).

To run it you need `docker` installed on your system and run:

```
docker run -d jorgemartinezpizarro/mathist:latest
```

To generate your own docker image, run:

```
docker build .
```
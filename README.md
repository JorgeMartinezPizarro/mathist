## About

Mathist is a math website project created by a mathematician who loves primes. The name is inspired by a german mathematician, he is the Mathologer, and I am just a mathist.

Developed using `nextjs` and using `BigInt`, `mathjs` and `s-bpsw` to do the computations. 

It is deployed under [math.ideniox.com](https://math.ideniox.com).


## Start

To get it running locally, you need to install the latest `node` and `npm`.

To run a develop version:

```
npm run dev
```

To build and run a production version: 

```
npm run build
npm run start
```

Open [localhost:3000](http://localhost:3000) with your browser to see the result.

Running in production will fail the `sieve` to `DOWNLOAD`, since `public/files` generated on the fly are not accessible, so we need a webserver serving the `public/files` directory.

## Docker

The easiest way to deploy the website is using `docker`.

There is a version of mathist dockerized under [hub.docker.com](https://hub.docker.com/repository/docker/jorgemartinezpizarro/mathist).

To run it you need `docker` installed on your system and run:

```
docker run -d jorgemartinezpizarro/mathist:latest
```

To generate your own docker image, run:

```
docker build .
```

I use an apache2 file server to serve files inside the docker volumes, an example `docker-compose.yml`:

```
services:
  files:
    image: httpd:latest
    volumes:
      -  /VOLUMES_PATH:/usr/local/apache2/htdocs/files
    restart: always
    ports:
      - 2900:80

  mather:
    image: jorgemartinezpizarro/mathist:latest
    restart: always
    ports:
      - 3000:3000
    volumes:
      - /VOLUMES_PATH:/app/public/files
```

and the `/etc/nginx/sites-available/default` nginx config file:

```
server {
        server_name YOUR_DOMAIN;
        location /files {
                proxy_pass http://localhost:2900;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
        }
        location / {
                proxy_pass http://localhost:3000;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
        }
        listen 80;
}
```

For this to work you need to set up a valid value for `YOUR_DOMAIN` and `VOLUME_PATH`. If you plan to host the site on your own, I recommend to use a load balancer with several instances running, since javascript works in single thread.

To start the containers use `docker compose up -d`.

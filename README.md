## Abstract

## Abstract

Mathist is a math website project created by a mathematician who loves primes. The name is inspired by a great German mathematician known as the Mathologer; I am just a mathist.

The platform is built with `nextjs` and leverages powerful computation libraries like `BigInt`, `mathjs`, and `s-bpsw` to explore the fascinating world of prime numbers. Deployed at [math.ideniox.com](https://math.ideniox.com), Mathist allows users to experiment with advanced arithmetic, prime testing, and more.

This project began 25 years ago with my first implementation of the Sieve of Eratosthenes on a machine with just 1GB of RAM. Since then, Mathist has evolved into a robust platform for modern mathematics exploration.

## Reports and benchmarks

At https://math.ideniox.com/files/test.html you can find more informacion about the calculations done in the software.

## TODO, or what is comming

0 - Improve visualization and data export, example of view:

Path entered: 12121221212101010
Steps computed: 17
Time taken: 264 μs

Generated Fibonacci-like square:
[235701, 72811, 381323, 308512]

Pythagorean triple generated:
<89878212423, 44926134464, 100481095865>

Pythagorean tree (depth 3):
<3, 4, 5> <-- Root
    <15, 8, 17>    <21, 20, 29>    <5, 12, 13>
    <35, 12, 37>   <65, 72, 97>    <33, 56, 65>
    <77, 36, 85>   <119, 120, 169> <39, 80, 89>
    <45, 28, 53>   <55, 48, 73>    <7, 24, 25>

Click here to visualize in GeoGebra: [Tree Visualization](https://www.geogebra.org/calculator/hd2hcvas)

1 - An experimental feature involves mersenne primes generation and test. For that I created a separated repository to test and benchmark different languages for the arithmetic computation, https://github.com/JorgeMartinezPizarro/lucas-lehmer-server. Currently I am working on a GPU based implementation. Inspired on the GIMPS project. A lot have been done since the first time I looked at this problem years ago. My current record with CPU goes up to a mersenne prime with about 300000 digits, yet very small. Let's see what can a modern GPU do. Furthermore, LLT is being replaced by PRP in 2021. Besides it, trial divisions and Fermat little theorem may be used before to speed it up.

2 - Avoid main thread usage on the backend. In the first versions I just wanted to try out nextjs. Backend in js may be an issue if it uses the main thread. Nginx load balancer is a workaround but I want to go for multithread single js docker. Let see if I get it working.

3 - Parallelization of Segmented Sieve algorithm, I would like to speed up the process of counting primes up to a number. The current record is about 10**23.

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

## Abstract

Mathist is a math website project created by a mathematician who loves primes. The name is inspired by a great German mathematician known as the Mathologer; I am just a mathist.

The platform is built with `nextjs` and leverages powerful computation libraries like `BigInt`, `mathjs`, and `s-bpsw` to explore the fascinating world of prime numbers. Deployed at [math.ideniox.com](https://math.ideniox.com), Mathist allows users to experiment with advanced arithmetic, prime testing, and more.

This project began 25 years ago with my first implementation of the Sieve of Eratosthenes on a machine with just 1GB of RAM. Since then, Mathist has evolved into a robust platform for modern mathematics exploration.

## Reports and benchmarks

At https://math.ideniox.com/files/test.html you can find more information about the calculations done in the software.

## TODO, or what is coming

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

3 - Parallelization of Segmented Sieve algorithm, I would like to speed up the process of counting primes up to a number. The current world record is pi(10**29), computed by David Baugh and Kim Walisch in 2022 with primecount.

## Start

To get it running locally, you need `node` 22 (see `engines` in `package.json`) and `npm`.

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

## Code structure

```
src/
  app/                 Next.js routes only: pages, API endpoints, layout and CSS
  components/
    sections/          one per page: sieve, tree, factors, series, primes, about
    ui/                pieces shared by the pages: fields, forms, number grids...
  hooks/               useApi, the state of a call to the API
  math/                the algorithms (sieves, factorization, primality, series, triples) and their tests
  server/              used by the API only: errors and JSON answers, admin KEY, reports
  utils/               formatting and small helpers: durations, sizes, percents
  reports/             the long report of /api/report
  sections.ts          the pages of the site, used by the menu and the routes
  constants.ts         limits of the website and the server
```

## Tests

Quick checks, a few seconds, to run after every change. They check the math helpers against known values (primes, factorizations, sieves) and the status codes of every API route:

```
npm test
```

The report endpoint runs a stress test and benchmark of the math with millions of runs, and writes it under `public/files/test.html`. The `short` param picks the size of the run:

| `short` | Run | Duration |
|---|---|---|
| `0` (default) | Full, meant for the server | about 42 hours |
| `1` | Reduced, meant for local checks | about 12 minutes |

```
curl "http://localhost:3011/api/report?KEY=$MATHER_SECRET&short=1"
```

Any other value of `short` is answered with a 400.

## Docker

The easiest way to deploy the website is using `docker`, you need it installed on your system.

To generate your docker image and push it to your registry, run:

```
docker build -t YOUR_DOCKERHUB_USER/YOUR_IMAGE:latest .
docker push YOUR_DOCKERHUB_USER/YOUR_IMAGE:latest
```

To run it:

```
docker run -d -p 3000:3000 YOUR_DOCKERHUB_USER/YOUR_IMAGE:latest
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
    image: YOUR_DOCKERHUB_USER/YOUR_IMAGE:latest
    restart: always
    ports:
      - 3000:3000
    environment:
      - MATHER_SECRET=YOUR_SECRET
      - MATHER_COMPUTE_HOST=YOUR_COMPUTE_HOST
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

For this to work you need to set up a valid value for `YOUR_DOMAIN`, `VOLUMES_PATH` and `YOUR_DOCKERHUB_USER/YOUR_IMAGE`. `MATHER_SECRET` is the `KEY` that unlocks the admin endpoints and the GUI limits, and `MATHER_COMPUTE_HOST` is the host running the [lucas-lehmer-server](https://github.com/JorgeMartinezPizarro/lucas-lehmer-server) used by `/api/mersenne`. If you plan to host the site on your own, I recommend to use a load balancer with several instances running, since javascript works in single thread.

To start the containers use `docker compose up -d`.

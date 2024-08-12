## Table of contents

- [Table of contents](#table-of-contents)
- [Description](#description)
- [Installation](#installation)
  - [Build from source](#build-from-source)
  - [Run from .zip (with release)](#run-from-zip-with-release)
  - [Run with docker (with release)](#run-with-docker-with-release)
- [Configuration](#configuration)
  - [Run behind Nginx proxy](#run-behind-nginx-proxy)
- [Run for contribution](#run-for-contribution)
- [Documentation](#documentation)

---

## Description

Public service API [litminka.ru](litminka.ru).

**requirements:**
    - NodeJS 20, 22, 24
    - git

---
## Installation

### Build from source

1. Clone project repository
```shell
git clone https://github.com/Litminka/LitminkaApi
```

2. Download dependencies
```shell
npm install
```

3. Build typescript code to javascript
```shell
npm run build
```

4. Rename `.env.example` to `.env` and configure server

5. Start database migrations and seeding
```shell
prisma migrate deploy && node dist/prisma/seed.js
```

6. Run main process and workers (in single thread mode)
```shell
node dist/src/index.js
```

### Run from .zip (with release)

### Run with docker (with release)

---

## Configuration

### Run behind Nginx proxy

To work with the shikimori API, a valid certificate is required. 
If you will be using the API behind a proxy, you can disable SSL in the application and configure TLS on Nginx.
For disabling SSL set `SSL=0`.

Nginx configuration example:
```nginx
events {}

http {
    server {
        listen 80;
        # Disable http without TLS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name api.litminka.ru;

        ssl_certificate certificate.pem;
        ssl_certificate_key private.key;

        location / {
            proxy_pass http://localhost:8001;

            # Simple requests
            if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' *;
                add_header 'Access-Control-Allow-Credentials' 'true';
                add_header 'Access-Control-Allow-Headers' 'Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
                add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS,PUT,DELETE,PATCH';
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
            }

            add_header 'Access-Control-Allow-Origin' * always;
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Headers' 'Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
            add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS,PUT,DELETE,PATCH';
        }
    }
}
```

---

## Run for contribution

1. Clone project repository
```shell
git clone https://github.com/Litminka/LitminkaApi
```

2. Download dependencies
```shell
npm install
```

3. Copy `.env.example` to `.env` and configure

4. Run application
```shell
npm run dev
```
> For running queries you can read package.json scripts section
>
> Run only query scripts:
>  - autocheck
>  - relation-update
>  - rating-update
>  - watchlist-importer
>  - shikimori-watchlist-sync
>
> Also you can run some server workers in multithreading mode (NodeJS cluster is not ready at the moment, use at your own risk):
>  - `npm run server` or `node dist/src/server.js`

---

## Documentation

Right now the website is in development, documentation will be available later

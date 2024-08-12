## Table of contents

- [Table of contents](#table-of-contents)
- [Description](#description)
- [Installation](#installation)
  - [Build from source](#build-from-source)
  - [Run from .zip (with release)](#run-from-zip-with-release)
  - [Run with docker (with release)](#run-with-docker-with-release)
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

4. Rename `.env.example` to `.env` and configure

5. Start database migrations and seeding
```shell
prisma migrate deploy && node dist/prisma/seed.js
```

6. Run main process and queries
```shell
node dist/src/queues/autocheck.js & 
node dist/src/queues/ratingUpdate.js & 
node dist/src/queues/relationUpdate.js & 
node dist/src/queues/shikimoriListUpdate.js & 
node dist/src/queues/watchListWorker.js & 
node dist/src/index.js
```

### Run from .zip (with release)

### Run with docker (with release)

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
> For running queries you may read package.json
>
>Run query scripts:
>  - autocheck
>  - relation-update
>  - rating-update
>  - watchlist-importer
>  - shikimori-watchlist-sync

---

## Documentation

Right now the website is in development, documentation will be available later

-

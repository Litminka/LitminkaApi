#!/bin/sh

# TODO: Добавить поддержу параметров, возможность запуска с автосидом.
startApplication() {
    npx prisma migrate deploy &&
        node /app/src/index.js
}

startApplication

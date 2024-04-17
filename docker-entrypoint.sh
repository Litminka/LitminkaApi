#!/bin/sh

# TODO: Добавить поддержу параметров, возможность запуска с автосидом.
startApplication() {
    npm run migrate &&
        node /app/src/index.js
}

startApplication

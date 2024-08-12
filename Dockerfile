FROM node:lts-alpine AS build

LABEL project.maintainer="maks2002bytovskii@gmail.com"
LABEL project="Litminka"
LABEL project.url="https://github.com/Litminka/LitminkaApi"

WORKDIR /app
COPY . .

RUN set -e; \ 
    rm -rf tests; \
    npm install; \
    npm run build; \
    npm prune --omit=dev; 

FROM node:lts-alpine AS runtime

ENV SHIKIMORI_URL=https://shikimori.one \
    APP_URL=http://localhost \
    ROOT_LOGIN=admin \
    ROOT_PASS=admin \ 
    PORT=8080 \
    SSL=0 \
    TOKEN_LIFE=1d \
    REFRESH_TOKEN_LIFE=14d

COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/

WORKDIR /app
RUN dos2unix /docker-entrypoint.sh

CMD [ "sh", "/docker-entrypoint.sh" ]
EXPOSE 8080
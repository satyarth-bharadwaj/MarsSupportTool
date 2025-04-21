ARG NODE_VERSION=21.5.0
ARG ALPINE_VERSION=3.19
 
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as Build
 
ARG NODE_VERSION=21.5.0
ARG ALPINE_VERSION=3.19
 
USER root
 
# ADD TescoRootCA.pem /usr/local/share/ca-certificates/
 
# RUN apk add --no-cache --repository "http://dl-cdn.alpinelinux.org/alpine/v${ALPINE_VERSION}/main" ca-certificates
 
# RUN update-ca-certificates
 
# RUN apk update && apk upgrade --no-cache
 
# # needed for node-gyp build
# RUN apk add g++ make py3-pip --no-cache
 
USER node
 
WORKDIR /app
 
# ENV NODE_EXTRA_CA_CERTS="/usr/local/share/ca-certificates/TescoRootCA.pem"
 
# disable NPM update, to ensure NPM doesn't check for updates in between running scripts
RUN npm config set update-notifier false
 
# Recreate node_modules here, only install prod dependencies
COPY --chown=node:node ./package.json ./yarn.lock ./ 
RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install \
      --frozen-lockfile \
      --non-interactive \
      --no-progress \
      --network-timeout 600000
 
COPY --chown=node:node . .
RUN yarn build

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}



USER node

WORKDIR /app

COPY --from=Build --chown=node:node /app/package.json /app/
COPY --from=Build --chown=node:node /app/yarn.lock /app/
COPY --from=Build --chown=node:node /app/server.js /app/
COPY --from=Build --chown=node:node /app/build /app/build

RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install \
      --frozen-lockfile \
      --production \
      --non-interactive \
      --no-progress \
      --network-timeout 600000
 
# set environment variables

ENV NODE_ENV production
 
CMD ["sh", "-c", "node ./server.js"]
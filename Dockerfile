FROM node:8-alpine

RUN apk update && apk add --no-cache git vim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD . /usr/src/app

RUN npm install

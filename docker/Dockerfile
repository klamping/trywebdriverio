# specify the node base image with your desired version node:<version>
FROM node:alpine

# Install python and deps for fibers
RUN apk update && apk add python make g++

# Copy over tests
COPY wdio /wdio

WORKDIR /wdio

RUN npm install

# queue up wdio run
ENTRYPOINT ["./node_modules/.bin/wdio"]
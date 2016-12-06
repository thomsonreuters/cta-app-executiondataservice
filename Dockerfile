FROM node:4.6.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV=docker
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/

# note that "npm install" must be executed outside Dockerfile
# because it is reading private repositories and it is a nightmare
# to add credentials into a Dockerfile (without compromising security)
COPY node_modules /usr/src/app/node_modules/

# we separate the commands above&below to have benefit of docker cache
COPY bin /usr/src/app/bin/
COPY lib /usr/src/app/lib/

CMD [ "npm", "start" ]

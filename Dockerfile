FROM node:boron-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

# note that "npm install" must be executed outside Dockerfile
# because it is reading private repositories and it is a nightmare
# to add credentials into a Dockerfile (without compromising security)
COPY node_modules /usr/src/app/node_modules/

# we separate the commands above&below to have benefit of docker cache
COPY . /usr/src/app

EXPOSE 3010

CMD [ "npm", "start" ]

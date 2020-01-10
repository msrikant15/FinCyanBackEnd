FROM node:lts-slim as build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
CMD [ "npm", "run","reset" ]
CMD ["npm","run","dev"]
EXPOSE 3000
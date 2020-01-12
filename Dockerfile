FROM node:12 as build
COPY . /
RUN npm i
 
EXPOSE 3000
CMD  npm run-script reset && node index.js

FROM node:20-alpine

WORKDIR /build

COPY package.json /build
COPY tsconfig.json /build
COPY src /build/src

RUN cd /build
RUN npm install
RUN npm run build

COPY ./app ../app

RUN cd ..
RUN rm -rf /build

CMD [ "node", "app/app.js" ]

EXPOSE 3000

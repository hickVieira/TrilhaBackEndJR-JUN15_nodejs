FROM node:22-alpine

WORKDIR /app

COPY package.json .
COPY tsconfig.json .
COPY src ./src
COPY .env .

RUN npm install
RUN npm run build
RUN npm prune --omit=dev

RUN ls dist/src
COPY src/dbreset.sql ./dist/src
RUN ls dist/src

RUN rm -rf /src
RUN rm -rf /tsconfig.json
RUN rm -rf /.env

CMD ["npm", "start"]

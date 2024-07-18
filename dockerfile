FROM node:22-alpine

WORKDIR /app

COPY package.json .
COPY tsconfig.json .
COPY src ./src
COPY .env .

RUN npm install
RUN npm install -g typescript
RUN npm run build
RUN npm prune --omit=dev
RUN npm uninstall -g typescript

COPY src/dbreset.sql ./dist/src

RUN rm -rf /app/dist/test
RUN rm -rf /src
RUN rm -rf /tsconfig.json
RUN rm -rf /.env

CMD ["npm", "start"]

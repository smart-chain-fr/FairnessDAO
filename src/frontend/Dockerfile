FROM node:16

WORKDIR /app

COPY . .

RUN npm install && npm install http-server -g
RUN npm rebuild node-sass
RUN npm run build
ENTRYPOINT ["http-server"]
CMD ["./build","--port","8080"]
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY server.js ./

EXPOSE 5000

CMD [ "node", "server.js" ]

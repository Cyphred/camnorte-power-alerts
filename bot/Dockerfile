FROM node:16-alpine

WORKDIR /app/bot

COPY package*.json /app/bot/
RUN npm install

COPY . /app/bot/

CMD ["npm", "run", "dev"]
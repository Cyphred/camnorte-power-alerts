FROM node:16-alpine

WORKDIR /app/bots/twitter/

COPY package*.json /app/bots/twitter/
RUN npm install

COPY . /app/bots/twitter/

CMD ["npm", "run", "dev"]
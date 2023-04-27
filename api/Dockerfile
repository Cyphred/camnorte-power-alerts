FROM node:16-alpine

WORKDIR /app/api/

COPY package*.json /app/api/
RUN npm install

COPY . /app/api/

CMD ["npm", "run", "dev"]
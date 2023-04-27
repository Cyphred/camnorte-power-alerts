FROM node:16-alpine
LABEL MAINTAINER="Jeremy Andrews Zantua <jeremyzantua@gmail.com>"
WORKDIR /app/backend/
COPY package*.json /app/backend/
RUN npm install
COPY . /app/backend/
EXPOSE 8000
CMD ["npm", "run", "dev"]
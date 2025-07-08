FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache bash netcat-openbsd
COPY package*.json ./
COPY ./scripts/wait-for-rabbit.sh /usr/local/bin/wait-for-rabbit.sh
RUN chmod +x /usr/local/bin/wait-for-rabbit.sh
RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 5037

CMD ["npm","run", "dev"]
FROM node:18-alpine
WORKDIR /app

# Instalacja niezbędnych narzędzi: bash i netcat
RUN apk add --no-cache bash netcat-openbsd

COPY package.json package-lock.json ./
COPY ./scripts/wait-for-rabbit.sh /usr/local/bin/wait-for-rabbit.sh
COPY ./scripts/wait-for-elasticsearch.sh /usr/local/bin/wait-for-elasticsearch.sh
RUN chmod +x /usr/local/bin/wait-for-rabbit.sh
RUN chmod +x /usr/local/bin/wait-for-elasticsearch.sh
RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 4011

# Uruchomienie aplikacji
CMD ["npm", "run", "dev"]

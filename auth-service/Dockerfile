# Użyj oficjalnego obrazu Node.js jako obrazu bazowego
FROM node:18-alpine

# Ustaw katalog roboczy wewnątrz kontenera
WORKDIR /app

# Skopiuj pliki package.json oraz package-lock.json
COPY package*.json ./
COPY ./scripts/wait-for-postgres.sh /usr/local/bin/wait-for-postgres.sh
RUN chmod +x /usr/local/bin/wait-for-postgres.sh


# Zainstaluj zależności
RUN npm install

# Skopiuj resztę plików aplikacji do kontenera
COPY . .


RUN node ./database/sync.js

# Expose port 4010
EXPOSE 4010

FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 4002

CMD ["npm","run", "dev"]
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=development
EXPOSE 3000

# Crea las tablas (idempotente) y arranca la API
CMD ["npm", "run", "start:prod"]

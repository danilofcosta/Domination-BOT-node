# ---------- Build stage ----------
FROM node:24-alpine AS builder

WORKDIR /app

# copiar dependências
COPY package*.json ./

RUN npm install

# copiar códigoQQFROM node:24-alpine

WORKDIR /app

# copiar package files
COPY package*.json ./

# instalar dependências
RUN npm install

# copiar código
COPY . .

# gerar prisma client
RUN npx prisma generate

# iniciar bot
CMD ["npm", "start"]



CMD ["node", "dist/index.js"]
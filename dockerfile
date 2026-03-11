# ---------- Build stage ----------
FROM node:24-alpine AS builder

WORKDIR /app

# copiar dependências
COPY package*.json ./

RUN npm install

# copiar código
COPY . .

# gerar prisma client
RUN npx prisma generate

# compilar typescript
RUN npm run build


# ---------- Runtime stage ----------
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
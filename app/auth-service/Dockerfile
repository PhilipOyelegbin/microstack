# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Production Run
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 5000
CMD ["node", "server.js"]
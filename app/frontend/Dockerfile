FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
ARG REACT_APP_AUTH_URL
ARG REACT_APP_GIN_URL
ENV VITE_APP_AUTH_URL=$REACT_APP_AUTH_URL
ENV VITE_APP_GIN_URL=$REACT_APP_GIN_URL
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
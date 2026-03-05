FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g bun
COPY package.json bun.lock ./
RUN bun install || npm install
COPY . .
RUN npx vite build --config vite.config.prod.ts

FROM nginx:alpine
# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

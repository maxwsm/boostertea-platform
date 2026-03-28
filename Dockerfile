FROM node:22-alpine

WORKDIR /app

# Install native compilation dependencies
RUN apk add --no-cache python3 make g++ 

# Enable pnpm via corepack
RUN corepack enable pnpm

# Copy root manifest and workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy all local project files
COPY . .

# Run deterministic install
RUN pnpm install

EXPOSE 3000 3001 3002

CMD ["pnpm", "run", "dev"]

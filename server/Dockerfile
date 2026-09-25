FROM node:20-alpine AS base

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy server source code
COPY src ./src

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "src/server.js"]

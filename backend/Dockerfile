# Stage 1: Install dependencies 
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci  

# Stage 2: Production Image
FROM node:22-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules

COPY package.json ./
COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.ts ./

RUN mkdir -p logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

CMD ["npm", "start"]
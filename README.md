# Flow - Real-time Chat Application

A modern, real-time chat application featuring 1-on-1 and group chats, typing indicators, read receipts, and more.

## Tech Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS v4
- **Backend**: Express.js, TypeScript, WebSockets (ws)
- **Database**: PostgreSQL with Drizzle ORM

## Prerequisites
- Node.js (v20+)
- Docker & Docker Compose

## Getting Started (Development)

The easiest way to run the application in development is using Docker Compose. It will spin up the Postgres database, the backend, and the frontend.

### 1. Start the services
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Setup Database
Navigate to the backend directory and run the migrations:
```bash
cd backend
npm install
npm run db:push
```

### 3. Access the Application
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`


# Registral Backend (RMS API)

Node.js + Express + MongoDB API for the Registrar Management System.

**Related repo:** [registral-yordi-frontend](https://github.com/TENSAEA/registral-yordi-frontend)

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm start
```

API runs at `http://localhost:5000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run server |
| `npm run dev` | Run with nodemon |
| `npm run seed` | Seed demo data |

## Environment variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT tokens |
| `PORT` | Server port (default: 5000) |

## Deployment

Deploy to Render, Railway, or similar. Set `MONGODB_URI` and `JWT_SECRET` in the host environment.

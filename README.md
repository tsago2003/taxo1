# ReThread — Second-hand Clothes Marketplace

A full-stack marketplace for pre-loved clothes in Georgia (prices in **GEL ₾**).

## Stack

- **Frontend:** SolidJS + Vite + Tailwind CSS (`frontend/`)
- **Backend:** Express.js + TypeScript + PostgreSQL (`backend/`)
- **Database:** PostgreSQL (DigitalOcean managed) — schema in `db/`

## Project structure

```
backend/     Express API (port 4000)
frontend/    SolidJS SPA (Vite dev server, default port 5173)
db/          schema.sql, migrate.sql, seed.sql
```

## Setup

### 1. Backend

```bash
cd backend
npm install
npm run dev        # starts API on http://localhost:4000
```

The backend reads `backend/.env` (already configured with your DB URL + JWT secret).
It uses `ca-certificate.crt` at the repo root for the SSL connection.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # starts Vite on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to the backend on port 4000.

### Production

```bash
cd backend && npm run build && npm start
cd frontend && npm run build && npm run preview
```

## Demo accounts

| Role   | Email                  | Password  |
|--------|------------------------|-----------|
| Seller | demo@thrift-shop.com   | demo1234  |
| Buyer  | buyer@example.com      | buyer1234 |

## Features

- Separate **buyer** and **seller** platforms (login, register, dashboards)
- Browse with search + filters (category, size, condition, price, sort)
- Shopping cart + checkout + order confirmation
- **Recommendation engine** (personalized "For you" based on views, wishlist, purchases)
- Wishlist, product view tracking
- Seller dashboard: product CRUD with image upload, order management
- Multi-vendor orders (each seller sees only orders containing their products)

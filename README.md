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

| Role           | Email                  | Password   |
|----------------|------------------------|------------|
| Platform admin | admin@rethreed.ge      | admin1234  |
| Seller         | demo@thrift-shop.com   | demo1234   |
| Buyer          | buyer@example.com      | buyer1234  |

> The **platform admin** account is created automatically on backend startup
> (from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars) if no admin exists yet.

## Platform admin (general admin)

Run the admin migration once:

```bash
psql "$DATABASE_URL" -f db/migrate-admin.sql
```

Then sign in at `http://localhost:5173/admin/login` (admin@rethreed.ge / admin1234).
The console lives at **`/admin`** and gives you control over:

- **Overview** — platform stats (sellers, buyers, products, orders, revenue, signups) + recent activity
- **Users** — every signup account (buyers + sellers + admins): search, suspend/activate, delete
- **Products** — every listing across all shops: search, mark sold/available, delete
- **Orders** — every order: change status
- **Activity** — an audit log of everything that happens (signups, product changes, orders, admin actions)

The **seller** (business owner) dashboard moved to **`/seller`** — it still only
shows that seller's own products and orders.

## Features

- Separate **buyer**, **seller**, and **platform admin** platforms
- **Platform admin console** (`/admin`): manage all accounts, products, orders, and an activity/audit log
- Browse with search + filters (category, size, condition, price, sort)
- Shopping cart + checkout + order confirmation
- **Recommendation engine** (personalized "For you" based on views, wishlist, purchases)
- Wishlist, product view tracking
- Seller dashboard (`/seller`): product CRUD with image upload, order management
- Multi-vendor orders (each seller sees only orders containing their products)
- Activity/audit logging across the platform

# EkoKintsugi App

EkoKintsugi App is a mobile-first React application for the EkoKintsugi circular luxury ecosystem. It uses the shared Supabase project for authentication and data, and it ships with its own built-in Express checkout server for order creation and Gmail order notifications.

The app is designed to feel premium, cinematic, and database-backed end to end:

- live product catalog from Supabase
- persistent user-scoped cart
- authenticated checkout
- order creation, tree assignment, ESG record creation, and carbon ledger updates
- Gmail notification on successful checkout
- responsive mobile UI with animated transitions

## Highlights

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Motion for page and card transitions
- Supabase Auth + Postgres data model
- Local Express server for checkout and email
- Capacitor-ready Android build support

## Architecture

This project runs as a single app with two parts:

1. Frontend
   React + Vite app served on `http://localhost:3002`

2. App server
   `server.ts` starts Express, mounts the Vite dev middleware in development, exposes local API routes like `/api/orders/checkout`, writes to Supabase, and sends order emails with Nodemailer.

Because of that setup, you only need to run this one project for the app flow.

## Features

### Commerce

- Product catalog loaded from the `products` table
- Product detail pages with live pricing and product images
- Cart persisted per signed-in user
- Cart rehydration against the live catalog so stale product snapshots do not break checkout
- Checkout that creates:
  - `orders`
  - `trees`
  - `esg_records`
  - `carbon_ledger`

### Member data

- Supabase email/password auth
- Profile sync into the `profiles` table
- Order history from `orders`
- Impact metrics from `esg_records` and `carbon_ledger`
- Tree portfolio from `trees`

### Email

- Gmail SMTP via Nodemailer
- Order notification sent after checkout
- Delivery target controlled with `ORDER_NOTIFICATION_EMAIL`

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Express 4
- Supabase JS
- Tailwind CSS 4
- Motion
- Nodemailer
- Capacitor

## Project Structure

```text
.
|-- android/
|-- public/
|   `-- images/
|       `-- products/
|-- src/
|   |-- components/
|   |-- lib/
|   |-- pages/
|   |-- services/
|   |-- App.tsx
|   |-- AuthContext.tsx
|   |-- CartContext.tsx
|   `-- main.tsx
|-- .env.example
|-- capacitor.config.ts
|-- package.json
|-- server.ts
|-- tsconfig.json
`-- vite.config.ts
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 20+ recommended
- npm
- a Supabase project
- the database schema already applied
- a Gmail account with a valid App Password if you want email notifications

## Database Requirements

This app expects the same Supabase schema used by the EkoKintsugi web project.

Required tables include:

- `profiles`
- `products`
- `orders`
- `trees`
- `esg_records`
- `carbon_ledger`

If your schema is not already created, run the SQL from the website project’s `supabase_schema.sql` before using this app.

## Environment Variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Then fill in the values:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"

APP_URL="http://localhost:3002"
PORT=3002

EMAIL_HOST_USER="sender@gmail.com"
EMAIL_HOST_PASSWORD="gmail-app-password"
ORDER_NOTIFICATION_EMAIL="recipient@gmail.com"
```

### Notes

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required
- `EMAIL_HOST_PASSWORD` must be a Gmail App Password, not the normal Gmail password
- `ORDER_NOTIFICATION_EMAIL` is the inbox that receives order notifications

## Local Development

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

This launches the Express app server and the Vite frontend together on:

`http://localhost:3002`

## Available Scripts

### `npm run dev`

Starts the local app server with `tsx server.ts`.

### `npm run start`

Starts the same server entrypoint. Useful for production-like runs without a separate process manager.

### `npm run build`

Builds the frontend bundle with Vite into `dist/`.

### `npm run preview`

Previews the built frontend statically with Vite.

### `npm run lint`

Runs TypeScript type-checking only:

```bash
tsc --noEmit
```

### `npm run build:android`

Builds the web app and syncs Capacitor Android assets.

### `npm run open:android`

Opens the Android project in Android Studio.

## API Endpoints

The local app server exposes:

### `GET /api/health`

Returns basic runtime status:

- app is running
- Supabase is configured
- email transport is configured

### `POST /api/orders/checkout`

Creates a checkout for the signed-in user and writes the related rows to Supabase.

Expected behavior:

- validates auth token
- validates customer details
- normalizes checkout items
- inserts orders
- inserts trees
- inserts ESG records
- inserts carbon ledger entries
- sends order email notification

## Product Images

The app serves product images from:

```text
public/images/products/
```

The catalog expects `image_url` values such as:

```text
/images/products/wallet-classic.jpg
```

If a database image path is missing or broken, the UI falls back to a local default product image.

## Pricing Behavior

Catalog seed prices are treated as compact retail units in the database and normalized for storefront display in INR. This keeps seeded values usable in the UI while preserving realistic pricing presentation across:

- shop
- product details
- cart
- checkout
- order summaries

## Production Notes

Before pushing or deploying:

- confirm `.env.local` is not committed
- verify all product images exist in `public/images/products`
- verify Supabase keys point to the correct project
- verify Gmail SMTP credentials are valid
- test one full checkout end to end

## Suggested GitHub Repo Setup

- Add a repository description like:
  `Mobile-first EkoKintsugi commerce app with Supabase, Express checkout, and Gmail notifications`
- Add topics such as:
  `react`, `typescript`, `vite`, `supabase`, `tailwindcss`, `capacitor`, `nodemailer`, `express`

## Verification Checklist

Before pushing, verify:

- `npm install`
- `npm run lint`
- `npm run build`
- `http://localhost:3002/api/health` returns configured status
- shop page loads products from Supabase
- product images render correctly
- add to cart works
- checkout succeeds
- order email arrives
- orders appear in the Orders screen

## Security

Do not commit:

- `.env.local`
- Gmail App Passwords
- Supabase secrets beyond the intended client anon key

If credentials were ever exposed publicly, rotate them immediately.



# EkoKintsugi App Codebase Memory

## What this repo is

- Single-project repo: `Ekokintsugi_app`
- Primary app: mobile-first React 19 + TypeScript + Vite frontend
- Runtime shape: one local Express server in `server.ts` that also mounts Vite middleware in development
- Native wrapper: Capacitor Android project under `android/`
- Data/auth backend: Supabase
- Email side effect: Gmail SMTP via Nodemailer

## Core mental model

The app is a premium-styled circular commerce experience for EkoKintsugi. The main user journey is:

1. Sign in with Supabase
2. Browse live catalog from `products`
3. Add items to a local cart keyed by user ID
4. Submit checkout to local Express API
5. API writes `orders`, `trees`, `esg_records`, and `carbon_ledger`
6. Orders and impact data then reappear across Home, Orders, Impact, Forest, and Wallet

This means most product/order/impact screens are downstream views of the same shared Supabase tables.

## Entry points

- Frontend bootstrap: `src/main.tsx`
- App shell and routing: `src/App.tsx`
- Local server: `server.ts`
- Capacitor config: `capacitor.config.ts`

## App shell and route model

`src/App.tsx` is the control center.

- If Supabase env vars are missing, app shows a setup screen instead of running
- If auth is loading, app shows a branded loader
- If user is signed out, only `Login` is rendered through `AuthShell`
- If user is signed in, `MemberShell` renders header, bottom nav, and all member routes

Routes currently mounted:

- `/` -> `Home`
- `/shop` -> `Shop`
- `/shop/:id` -> `ProductDetails`
- `/impact` -> `Impact`
- `/forest` -> `Forest`
- `/wallet` -> `Wallet`
- `/redeem` -> `Redeem`
- `/profile` -> `Profile`
- `/orders` -> `Orders`
- `/cart` -> `Cart`
- `/settings` -> `Settings`
- `/notifications` -> `Notifications`
- `/return` -> `Return`

## State and shared contexts

### Auth

File: `src/AuthContext.tsx`

- Uses Supabase auth session as the source of truth
- On boot, hydrates `supabase.auth.getSession()`
- On auth changes, syncs profile data into local context
- Calls `syncProfileForUser()` to ensure a row exists in `profiles`
- Exposes:
  - `user`
  - `session`
  - `profile`
  - `loading`
  - `displayName`
  - `signInEmail`
  - `signUpEmail`
  - `logout`

Notable behavior:

- There is a timeout wrapper around initial auth/profile hydration to avoid the app hanging forever on boot
- Signup writes profile metadata and then attempts to create a `profiles` row

### Cart

File: `src/CartContext.tsx`

- Cart is stored in `localStorage`
- Storage key is per-user: `ekokintsugi-app-cart:<userId>`
- Stored shape is lightweight: only `productId` + `quantity`
- On load, cart is rehydrated by fetching the live catalog and merging stored IDs with current product rows

Implications:

- Product snapshots are not persisted in storage
- If a product disappears from Supabase, it drops out of the cart on refresh
- Cart is client-side only, not stored in Supabase

## Data layer

Main file: `src/lib/data.ts`

Important functions:

- `syncProfileForUser(user, overrides?)`
- `fetchCatalog()`
- `fetchImpactStats(userId)`
- `fetchOrders(userId)`
- `fetchTrees(userId)`
- `createOrder(userId, product, quantity)` -> appears unused by the main checkout flow

### Product normalization

Catalog rows from Supabase are normalized into app `Product` objects.

Important transformations:

- `base_price` is converted with `normalizeRetailPrice()`
- `image_url` becomes a root-relative image path if needed
- missing images fall back to `/images/products/signature-sneaker.jpg`
- app currently hardcodes:
  - `currency: "INR"`
  - default materials
  - default highlights

### Pricing convention

`normalizeRetailPrice()` exists in both `src/lib/utils.ts` and `server.ts`.

Rule:

- if price is less than `1000`, multiply by `100`
- otherwise use the value as-is

This is an important codebase convention: seed prices may be stored as compact values and expanded for storefront display.

## Checkout architecture

### Client

File: `src/lib/checkout.ts`

- Sends `POST /api/orders/checkout`
- Requires `session.access_token`
- Sends:
  - customer details
  - items as `{ productId, quantity }[]`

### Server

File: `server.ts`

Key responsibilities:

- loads env with `dotenv`
- creates Supabase client
- creates optional Gmail transporter
- exposes `GET /api/health`
- exposes `POST /api/orders/checkout`
- runs Vite in middleware mode during development
- serves `dist/` in production

Checkout behavior:

1. Authenticate user from bearer token using `supabase.auth.getUser(accessToken)`
2. Normalize and merge duplicate line items
3. Validate customer email and shipping address
4. For each item:
   - fetch product
   - create `orders` row
   - create `trees` row
   - create `esg_records` row
   - create `carbon_ledger` row
5. Attempt Gmail notification email
6. Return summary totals and email delivery status

Important operational detail:

- checkout writes one order bundle per cart line item, not one aggregate order with child rows

## Screen responsibilities

### Data-backed screens

- `Home`: overview screen using catalog + orders + impact
- `Shop`: fetches catalog and provides search/filter UI
- `ProductDetails`: product storytelling + add-to-cart shortcuts
- `Cart`: quantity editing + checkout form + checkout submission
- `Impact`: ESG/ledger summary and recent impact records
- `Forest`: tree portfolio view
- `Wallet`: points/reward framing backed by impact + order history
- `Orders`: order history and derived status display
- `Profile`: signed-in user identity and logout

### Mostly static/presentation screens

- `Settings`
- `Notifications`
- `Redeem`
- `Return`

These are design surfaces now and good candidates for future backend wiring.

## Shared UI system

Files:

- `src/components/app-ui.tsx`
- `src/index.css`

Visual language:

- strong editorial/luxury styling
- Fraunces + Manrope + Space Grotesk
- glassmorphism + dark premium panels
- consistent wrappers like `PageTransition`, `GlassCard`, `DarkCard`, `PageHeader`, `Pill`
- motion-heavy interactions via `motion/react`

When editing UI, preserve this visual direction instead of falling back to generic utility styling.

## Configuration

### Environment variables

Expected local env includes:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `APP_URL`
- `PORT`
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`
- `ORDER_NOTIFICATION_EMAIL`
- `GEMINI_API_KEY` (only relevant to unused Gemini path today)

### Vite

File: `vite.config.ts`

- Uses React plugin and Tailwind Vite plugin
- Port is derived from `APP_URL`, falling back to `3002`
- Defines `process.env.GEMINI_API_KEY` for client-side Gemini service use
- HMR can be disabled via `DISABLE_HMR=true`

### Capacitor

File: `capacitor.config.ts`

- `appId`: `com.ekokintsugi.app`
- `appName`: `EkoKintsugi`
- `webDir`: `dist`

## Tables the app expects

Shared Supabase tables referenced in code:

- `profiles`
- `products`
- `orders`
- `trees`
- `esg_records`
- `carbon_ledger`

## Known quirks and inconsistencies

These matter for future edits:

- `Profile.tsx` and `Settings.tsx` still contain text saying auth is powered by Firebase, but actual auth is Supabase
- `src/pages/Portal.tsx` exists but is not routed from `App.tsx`
- `src/services/geminiService.ts` is only used by `Portal.tsx`
- `src/lib/data.ts:createOrder()` appears unused because the app uses the Express checkout path instead
- several UI strings are written as if this app was recently redesigned from another version
- some text contains mojibake characters like `â€¢` and `â€™`, so encoding cleanup may be needed

## Files to inspect first on future tasks

If working on:

- routing or auth shell -> `src/App.tsx`, `src/AuthContext.tsx`
- cart or checkout -> `src/CartContext.tsx`, `src/lib/checkout.ts`, `server.ts`
- Supabase reads/writes -> `src/lib/data.ts`, `src/lib/supabase.ts`
- visual styling -> `src/components/app-ui.tsx`, `src/index.css`
- Android packaging -> `capacitor.config.ts`, `android/app/build.gradle`, `android/app/src/main/AndroidManifest.xml`

## Practical working memory for future tasks

- This is not a separate frontend and backend repo; the Express server is part of the same app runtime
- Real business logic lives mostly in `server.ts` and `src/lib/data.ts`
- Cart persistence is local only, but catalog/order/impact data is shared through Supabase
- Many non-commerce screens are still premium mock/live-hybrid screens rather than fully wired product features
- If a bug touches pricing, check both client and server normalization
- If a bug touches auth messaging, remember the implementation is Supabase even where copy says otherwise

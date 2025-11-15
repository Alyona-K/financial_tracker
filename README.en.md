Available in: [Español](README.es.md)

# FinTrack Technical Documentation

---

## I. Introduction

**FinTrack** is a SPA (Single Page Application) for personal finance tracking.  
**Project goal:** Demonstrate production-ready frontend architecture, strict TypeScript typing, and reactive state management.

**Key Features:**

- User registration and authentication (json-server-auth)
- Create, edit, delete transactions
- Income and expense categories
- Filters, sorting, transaction history
- Analytics charts (Recharts)
- Date handling (react-datepicker)

**Audience:**

- Users tracking personal finances
- Developers learning Feature-Sliced Design (FSD)
- Employers evaluating frontend skills

---

## II. Feature Overview

### 1. Authentication

- Pages: `Login` / `Register`
- Components: `AuthForm` + Zod validation
- State: `auth.store` (token, login, logout, demo auto-login)
- API: `login`, `register`, `getCurrentUser`
- Notes: Redirect to `/overview`, persist token in `localStorage`, logout clears store

### 2. Transactions

- Functions: view, add, edit, delete
- UI: table, filters, `Add/Edit Transaction` modal
- State: `transactions.store`, instant filtering, reactive UI
- Notes: `isLoading` blocks UI during operations

### 3. Categories

- Types: `Income` / `Expenses`
- CRUD: add, edit, soft delete
- State: `category.store`
- Notes: transactions remain on category deletion, flagged as `isDeletedCategory`

### 4. Overview

- Widgets: income, expenses, balance
- Charts: income/expenses by category and time
- Recent transactions block
- Notes: UI updates reactively on store changes

### 5. Architectural Highlights

- `Zustand` stores per entity
- Persistent authentication
- Unified forms and modals
- Automatic UI sync
- Error handling in stores
- Demo mode without backend

---

## III. Project Architecture (FSD)

### 1. Principles

- Feature-Sliced Design
- Clear separation of layers: `app`, `entities`, `features`, `pages`, `shared`, `api`
- Minimized coupling, maximal modularity

### 2. Core Layers

| Layer            | Purpose                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `app/`           | Entry point, providers, router, `AppInit`                                                         |
| `entities/`      | Core entities: `User`, `Transaction`, `Category`, `Widgets` (store, API, types)                   |
| `features/`      | Functional blocks: filters, widgets, modals                                                       |
| `pages/`         | Top-level pages: `Home`, `Overview`, `Transactions`, `Categories`, `Profile`, `Login`, `Register` |
| `shared/`        | Reusable UI components, utilities, hooks, styles, helpers                                         |
| `api/`           | Axios, interceptors, basic HTTP functions                                                         |
| `routes.ts/json` | Route definitions and access rules                                                                |

### 3. Layer Interaction

- `pages → features → entities → api/stores`
- `shared` is accessible to all layers
- `app` handles global configuration

### 4. Technical Principles

- Module isolation
- Reusability (shared)
- Alias imports: `@`, `@app`, `@pages`, `@entities`, `@features`, `@shared`
- Lazy loading: `React.lazy + Suspense`
- `Zustand` stores per entity
- Private route protection

---

## IV. Backend (json-server + json-server-auth)

**Endpoints:**

- `/users*` — access only to own data
- `/categories*` — owner CRUD, soft-delete
- `/transactions*` — access only to own transactions

**Auth:** JWT via interceptor; 401 → `refreshToken`

**Data structure:**

- Users: `id, email, password, name`
- Categories: `id, name, type, isDeleted`
- Transactions: `id, amount, categoryId, date, description`

**Custom server logic (`server.js`):**

- CORS
- Soft-delete categories
- Filtering deleted categories
- Middleware integration

**Files:** `server.js`, `routes.json`, `db.normalized.json`

---

## V. Tech Stack

### 1. Frontend

- React 19 + Vite 7, TypeScript, SCSS, Framer Motion
- Libraries: React Router v7, Zustand, Zod, date-fns, Recharts, react-datepicker
- Testing: Jest + RTL
- Linting: ESLint + Prettier

### 2. Backend (mock)

- Node.js (ESM), json-server + json-server-auth
- Libraries: cors, bcryptjs, axios
- Run via `server.js`

### 3. Configuration

- Separate `tsconfig` for FE and Node
- Vite: aliases, `/api` proxy
- Jest configured for ESM + TypeScript

### 4. Scripts

- `dev`, `build`, `preview`, `lint`, `test`

### 5. Environment Variables

- `VITE_API_URL`, `VITE_BASENAME`, `VITE_APP_NAME`

---

## VI. Project Run

### 1. Dev Mode

```bash
npm run dev
```

**Frontend (FE):**  
Vite 5173, hot reload

**Backend (BE):**  
json-server 3001, instant data updates

**Terminal colors:**  
CLIENT — cyan  
SERVER — green

---

### 2. Vite Proxy

```ts
server: {
  proxy: {
    "/api": {
      target: "http://localhost:3001",
      changeOrigin: true,
      secure: false
    }
  }
}
```

---

### 3. Build / Production

npm run build
npm run preview

- TS compiles, bundles in /dist

- Proxy disabled, env vars injected during build

### 4. Vercel Rewrite

{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }

---

## VII. Testing

- Jest + RTL + ts-jest

- Mocks: API, store, images

- Verify CRUD, init, refreshToken, error handling

- Unit/snapshot: Button, Input, Sidebar, Topbar

- Hooks/utilities: useWidgetsData, formatCurrency, formatDate, parseDate

- Tests fully isolated from real API

---

## VIII. Linting & Code Style

- ESLint: errors, hooks, TS patterns

- Prettier: formatting

- TypeScript: strict, aliases, noEmit

- Vite: aliases match TS, type-safe imports

---

## IX. Aliases

| Alias     | Path          | Example                                                                                                        |
|-----------|---------------|--------------------------------------------------------------------------------------------------------------- |
| @         | src/          | import { formatDate } from "@/shared/lib/formatDate"                                                           |
| @app      | src/app/      | import { useAuthStore } from "@app/model/auth.store"                                                           |
| @pages    | src/pages/    | import TransactionsPage from "@pages/transactions"                                                             |
| @entities | src/entities/ | import { useTransactionsStore } from "@entities/transaction/model/transaction.store"                           |
| @features | src/features/ | import AddEditTransactionModal from "@features/transaction/AddEditTransactionModal/ui/AddEditTransactionModal" |
| @shared   | src/shared/   | import Button from "@shared/ui/Button"                                                                         |

---

## X. Deployment / Hosting

- vercel.json: fallback for SPA routes

- SPA routing: rewrite /index.html for proper frontend routing

- Vite: aliases, local /api proxy to bypass CORS

- Env vars: VITE_API_URL, VITE_BASENAME, VITE_APP_NAME

- Deploy: connect repo → build → CDN → rewrite + env injection

---

## XI. Data Schemas

### 1. User

type User = {
id: number
email: string
password: string
firstName: string
lastName: string
avatar?: string
location?: string
}

### 2. Category

type Category = {
id: string
name: string
type: "Income" | "Expenses"
userId: number
isDeleted?: boolean
}

### 3. Transaction

type Transaction = {
id: string
date: string // YYYY-MM-DD
description?: string
categoryId: string
type: "Income" | "Expenses"
amount: number
userId: number
}

---

## XII. Data Flow & Auth

UI ↔ Zustand Store ↔ API ↔ Axios ↔ JSON-server (+auth) ↔ db.normalized.json

**Layers:**

- Types (TS) — data contracts

- API — Axios + token + 401 handling

- auth.store — token, login, register, logout, initDemoUser, refreshToken

- user.store — user state

- category/transaction.store — local state

- Hooks — aggregation, categoryName, isDeletedCategory

- server.js — CRUD, soft delete, filtering

- db.normalized.json — persistent storage

**Example flows:**

- Create category: UI → store → API → server → store → UI

- Soft delete: UI → store → DELETE → isDeleted: true → store → UI → categoryName="Deleted"

- Auth: open app → token? → initDemoUser → headers → 401 → refreshToken

---

## XIII. Demo Accounts Guide

- Auto-login: demo@fintrack.com with preloaded data
- Force load: Home → profile dropdown (Topbar) → Log out → Log in as Demo
- Switch account: profile dropdown (Topbar) → Change account → demo2@email.com / demo123456
- Register new user: profile dropdown (Topbar) → Create new account → new personal data

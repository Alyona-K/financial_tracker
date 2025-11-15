Disponible en: [English](README.en.md)

# Documentación Técnica de FinTrack

---

## I. Introducción

**FinTrack** es una SPA (Aplicación de Página Única) para el seguimiento de finanzas personales.  
**Objetivo del proyecto:** Demostrar una arquitectura frontend lista para producción, tipado estricto con TypeScript y gestión de estado reactiva.

**Características principales:**

- Registro y autenticación de usuarios (json-server-auth)
- Crear, editar, eliminar transacciones
- Categorías de ingresos y gastos
- Filtros, ordenamiento, historial de transacciones
- Gráficos de analítica (Recharts)
- Manejo de fechas (react-datepicker)

**Audiencia:**

- Usuarios que quieren controlar sus finanzas personales
- Desarrolladores aprendiendo Feature-Sliced Design (FSD)
- Empleadores evaluando habilidades de frontend

---

## II. Resumen de Funcionalidades

### 1. Autenticación

- Páginas: `Login` / `Register`
- Componentes: `AuthForm` + validación con Zod
- Estado: `auth.store` (token, login, logout, auto-login de demo)
- API: `login`, `register`, `getCurrentUser`
- Notas: Redirección a `/overview`, persistencia de token en `localStorage`, logout limpia el store

### 2. Transacciones

- Funciones: ver, agregar, editar, eliminar
- UI: tabla, filtros, modal `Add/Edit Transaction`
- Estado: `transactions.store`, filtrado instantáneo, UI reactiva
- Notas: `isLoading` bloquea la UI durante operaciones

### 3. Categorías

- Tipos: `Income` / `Expenses`
- CRUD: agregar, editar, eliminación suave (soft delete)
- Estado: `category.store`
- Notas: las transacciones permanecen al eliminar categoría, marcadas como `isDeletedCategory`

### 4. Overview

- Widgets: ingresos, gastos, balance
- Gráficos: ingresos/gastos por categoría y tiempo
- Bloque de transacciones recientes
- Notas: UI se actualiza reactivamente al cambiar los datos en el store

### 5. Destacados de Arquitectura

- Stores de `Zustand` por entidad
- Autenticación persistente
- Formularios y modales unificados
- Sincronización automática de UI
- Manejo de errores en stores
- Modo demo sin backend

---

## III. Arquitectura del Proyecto (FSD)

### 1. Principios

- Feature-Sliced Design
- Separación clara de capas: `app`, `entities`, `features`, `pages`, `shared`, `api`
- Acoplamiento mínimo, máxima modularidad

### 2. Capas Principales

| Capa             | Propósito                                                                                               |
|------------------|---------------------------------------------------------------------------------------------------------|
| `app/`           | Punto de entrada, providers, router, `AppInit`                                                          |
| `entities/`      | Entidades principales: `User`, `Transaction`, `Category`, `Widgets` (store, API, tipos)                 |
| `features/`      | Bloques funcionales: filtros, widgets, modales                                                          |
| `pages/`         | Páginas de alto nivel: `Home`, `Overview`, `Transactions`, `Categories`, `Profile`, `Login`, `Register` |
| `shared/`        | Componentes UI reutilizables, utilidades, hooks, estilos, helpers                                       |
| `api/`           | Axios, interceptores, funciones HTTP básicas                                                            |
| `routes.ts/json` | Definición de rutas y reglas de acceso                                                                  |

### 3. Interacción entre Capas

- `pages → features → entities → api/stores`
- `shared` accesible a todas las capas
- `app` maneja la configuración global

### 4. Principios Técnicos

- Aislamiento de módulos
- Reutilización (shared)
- Alias en imports: `@`, `@app`, `@pages`, `@entities`, `@features`, `@shared`
- Carga diferida (lazy loading): `React.lazy + Suspense`
- Stores de `Zustand` por entidad
- Protección de rutas privadas

---

## IV. Backend (json-server + json-server-auth)

**Endpoints:**

- `/users*` — acceso solo a datos propios
- `/categories*` — CRUD del propietario, soft-delete
- `/transactions*` — acceso solo a transacciones propias

**Autenticación:** JWT via interceptor; 401 → `refreshToken`

**Estructura de datos:**

- Users: `id, email, password, name`
- Categories: `id, name, type, isDeleted`
- Transactions: `id, amount, categoryId, date, description`

**Lógica personalizada del servidor (`server.js`):**

- CORS
- Eliminación suave de categorías (soft-delete)
- Filtrado de categorías eliminadas
- Integración de middleware

**Archivos:** `server.js`, `routes.json`, `db.normalized.json`

---

## V. Stack Tecnológico

### 1. Frontend

- React 19 + Vite 7, TypeScript, SCSS, Framer Motion
- Librerías: React Router v7, Zustand, Zod, date-fns, Recharts, react-datepicker
- Testing: Jest + RTL
- Linting: ESLint + Prettier

### 2. Backend (mock)

- Node.js (ESM), json-server + json-server-auth
- Librerías: cors, bcryptjs, axios
- Ejecución vía `server.js`

### 3. Configuración

- tsconfig separado para FE y Node
- Vite: alias, proxy `/api`
- Jest configurado para ESM + TypeScript

### 4. Scripts

- `dev`, `build`, `preview`, `lint`, `test`

### 5. Variables de Entorno

- `VITE_API_URL`, `VITE_BASENAME`, `VITE_APP_NAME`

---

## VI. Ejecución del Proyecto

### 1. Modo Dev

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

### 2. Proxy de Vite

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

### 3. Build / Producción

npm run build
npm run preview

- TypeScript compila, se generan bundles en /dist

- Proxy deshabilitado, variables de entorno inyectadas durante el build

### 4. Vercel Rewrite

{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }

---

## VII. Testing

- Jest + RTL + ts-jest

- Mocks: API, store, imágenes

- Verificación CRUD, inicialización, refreshToken, manejo de errores

- Unit/snapshot: Button, Input, Sidebar, Topbar

- Hooks/utilidades: useWidgetsData, formatCurrency, formatDate, parseDate

- Tests totalmente aislados del API real

---

## VIII. Linting y Estilo de Código

- ESLint: errores, hooks, patrones TS

- Prettier: formato

- TypeScript: strict, aliases, noEmit

- Vite: aliases coinciden con TS, imports type-safe

---

## IX. Aliases

| Alias     | Path          | Ejemplo                                                                                                        |
| --------- | ------------- | -------------------------------------------------------------------------------------------------------------- |
| @         | src/          | import { formatDate } from "@/shared/lib/formatDate"                                                           |
| @app      | src/app/      | import { useAuthStore } from "@app/model/auth.store"                                                           |
| @pages    | src/pages/    | import TransactionsPage from "@pages/transactions"                                                             |
| @entities | src/entities/ | import { useTransactionsStore } from "@entities/transaction/model/transaction.store"                           |
| @features | src/features/ | import AddEditTransactionModal from "@features/transaction/AddEditTransactionModal/ui/AddEditTransactionModal" |
| @shared   | src/shared/   | import Button from "@shared/ui/Button"                                                                         |

---

## X. Deployment / Hosting

- vercel.json: fallback para rutas SPA

- SPA routing: reescribir /index.html para que React Router funcione

- Vite: aliases, proxy local /api para evitar CORS

- Variables de entorno: VITE_API_URL, VITE_BASENAME, VITE_APP_NAME

- Deploy: conectar repositorio → build → CDN → reescritura + inyección de env

---

## XI. Esquemas de Datos

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

## XII. Flujo de Datos y Autenticación

UI ↔ Zustand Store ↔ API ↔ Axios ↔ JSON-server (+auth) ↔ db.normalized.json

**Capas:**

- Types (TS) — contratos de datos

- API — Axios + token + manejo de 401

- auth.store — token, login, register, logout, initDemoUser, refreshToken

- user.store — estado de usuario

- category/transaction.store — estado local

- Hooks — agregación, categoryName, isDeletedCategory

- server.js — CRUD, soft delete, filtrado

- db.normalized.json — almacenamiento persistente

**Ejemplos de flujo:**

- Crear categoría: UI → store → API → servidor → store → UI

- Soft delete: UI → store → DELETE → isDeleted: true → store → UI → categoryName="Deleted"

- Autenticación: abrir app → token? → initDemoUser → headers → 401 → refreshToken

---

## XIII. Guía de Cuentas Demo

- Auto-login: demo@fintrack.com con datos precargados
- Forzar carga: Home → dropdown de perfil (Topbar) → Log out → Log in as Demo
- Cambiar cuenta: dropdown de perfil (Topbar) → Change account → demo2@email.com / demo123456
- Registrar nuevo usuario: dropdown de perfil (Topbar) → Create new account → nuevos datos personales

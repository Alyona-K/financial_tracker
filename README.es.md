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

- Almacenamiento Zustand por entidad, sincronizado con el backend
- Autenticación persistente con JWT
- Formularios y modales unificados
- Sincronización automática de la UI con los datos del servidor
- Manejo de errores en stores
- Lógica de eliminación suave (soft-delete) y filtrado manejada del lado del servidor
- Operaciones CRUD a través de la API REST (json-server + json-server-auth)

---

## III. Arquitectura del Proyecto (FSD)

### 1. Principios

- Feature-Sliced Design
- Separación clara de capas: `app`, `entities`, `features`, `pages`, `shared`, `api`
- Acoplamiento mínimo, máxima modularidad

### 2. Capas Principales

| Capa             | Propósito                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
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

## IV. Backend (Servidor JSON personalizado con JWT)

**Servidor:** `server.js` — Node.js + json-server  
**Base de datos:** `db.normalized.json`

**Endpoints y Autenticación:**

- `POST /register` — registrar un nuevo usuario
  - Campos requeridos: `email, password, firstName, lastName`
  - Retorna: `user`, `accessToken` (15 min), `refreshToken` (7 días)
  - La contraseña se almacena en hash con bcrypt

- `POST /login` — inicio de sesión del usuario
  - Campos requeridos: `email, password`
  - Retorna: `user`, `accessToken`, `refreshToken`

- `POST /refresh` — refrescar tokens
  - Campo requerido: `refreshToken`
  - Retorna un nuevo `accessToken` (15 min) y `refreshToken` (7 días)

- `GET /categories` — obtener categorías
  - Excluye categorías con `isDeleted = true`

- `DELETE /categories/:id` — eliminar categoría de forma suave (soft-delete)
  - Establece `isDeleted: true`, las transacciones permanecen

- Todos los demás endpoints (`/transactions`, `/users`) requieren un JWT válido en el encabezado `Authorization` (`Bearer <token>`)

**Autenticación y Middleware:**

- Autorización JWT a través del middleware `authGuard`
- Los tokens de acceso expiran en 15 minutos, los refresh tokens en 7 días
- El usuario demo (`demo@fintrack.com`) se crea automáticamente si no existe

**Estructura de datos (resumen):**

- Users: `id, email, password, firstName, lastName, avatar, location, refreshToken`
- Categories: `id, name, type: Income|Expenses, userId, isDeleted`
- Transactions: `id, date, description, categoryId, type: Income|Expenses, amount, userId`

**Archivos:**

- `server.js` — lógica personalizada, autenticación, soft-delete, refresh
- `db.normalized.json` — almacenamiento persistente de usuarios, categorías y transacciones

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

```bash
npm run build
npm run preview
```

- TypeScript compila, se generan bundles en /dist
- Proxy deshabilitado, variables de entorno inyectadas durante el build

### 4. Vercel Rewrite

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## VII. Pruebas (Testing)

- **Frameworks**: Jest + React Testing Library + ts-jest
- **Mocks**: API, store, imágenes
- **Cobertura de pruebas**:
  - Pruebas unitarias / snapshot: Button, Input, Sidebar, Topbar
  - Pruebas de hooks/utilidades: useWidgetsData, formatCurrency, formatDate, parseDate
  - Pruebas de integración: App, AppRoutes, AppInit, ProtectedRoute, páginas lazy, routing, interacciones con store
- **Funcionalidades verificadas**: operaciones CRUD, init, refreshToken, manejo de errores
- Las pruebas están completamente aisladas de la API real

---

## VIII. Linting y Estilo de Código

- **ESLint**:  
  - Verificación de errores, reglas de React Hooks, patrones de TypeScript  
  - Reglas para componentes TSX (`react-hooks/rules-of-hooks`, `exhaustive-deps`)  
  - Ignorar variables no usadas con `_` en tests y archivos de setup  
  - Plugins: `@typescript-eslint`, `react-refresh`  
- **Prettier**: instalado y usado para formateo de código  
- **TypeScript**:  
  - Tipado estricto (`strict: true`), alias para importaciones convenientes (`@`, `@app`, `@pages`, etc.)  
  - Verificación de tipos en IDE y build sin emitir JS (`noEmit: true`)  
  - Configuraciones TS separadas para la aplicación (`tsconfig.app.json`) y Vite (`tsconfig.node.json`)  
- **Vite**:  
  - Los alias coinciden con TypeScript para importaciones con tipos seguros  
  - Configuración del servidor de desarrollo con proxy para la API

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

```ts
type User = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  location?: string;
};
```

### 2. Category

```ts
type Category = {
  id: string;
  name: string;
  type: "Income" | "Expenses";
  userId: number;
  isDeleted?: boolean;
};
```

### 3. Transaction

```ts
type Transaction = {
  id: string;
  date: string;
  description?: string;
  categoryId: string;
  type: "Income" | "Expenses";
  amount: number;
  userId: number;
};
```

---

## XII. Flujo de Datos y Autenticación

UI ↔ Zustand Store ↔ API ↔ Axios ↔ JSON-server (+ JWT auth & refresh) ↔ db.normalized.json

**Capas:**
- **Types (TS)** — contratos de datos
- **API** — Axios + token + manejo de 401 + lógica de refresh token
- **auth.store** — token, login, register, logout, initDemoUser, refreshToken
- **user.store** — estado del usuario
- **category/transaction.store** — estado local
- **Hooks** — agregación, categoryName, isDeletedCategory
- **ProtectedRoute** — protege rutas basándose en el token
- **AppRoutes** — Suspense fallback → páginas lazy (Home, Overview, Transactions, Categories, Profile, etc.)
- **server.js** — CRUD, soft delete, filtrado y manejo de JWT
- **db.normalized.json** — almacenamiento persistente

**Ejemplos de flujos:**
- **Crear categoría**: UI → store → API → server → store → UI
- **Soft delete de una categoría**: UI → store → DELETE → `isDeleted: true` → store → UI → GET `/categories` excluye eliminadas → categoryName="Deleted"
- **Autenticación / Usuario demo**: abrir app → ¿token? → initDemoUser → headers → 401 → refreshToken → actualizar store → UI
- **Acceso a rutas protegidas**: navegar → ProtectedRoute valida token → redirige a login si no es válido
- **Páginas lazy**: el componente se carga con React.lazy → Suspense muestra el loader hasta que esté listo

flowchart LR
  subgraph Frontend
    UI[UI (React SPA)]
    Store[Zustand Stores]
    Hooks[Custom Hooks & Utils]
  end

  subgraph Networking
    Axios[Axios Client<br/>+ interceptors]
  end

  subgraph Backend
    Server[Custom JSON-Server<br/>+ JWT Auth]
    Auth[Auth Layer<br/>login/register/refresh]
  end

  subgraph Database
    DB[(db.normalized.json)]
  end

  UI --> Store
  Store --> Hooks
  Store --> Axios
  Axios --> Server
  Server --> Auth
  Auth --> DB
  Server --> DB

---

## XIII. CI/CD

- Integración Continua mediante GitHub Actions
  - Se ejecuta en push a `main` o pull request
  - Instala dependencias, ejecuta lint, tests y build del frontend
  - Cachea `node_modules` para builds más rápidos
- Despliegue Continuo en Vercel
  - Despliegue automático tras CI exitoso
  - Variables de entorno inyectadas de forma segura mediante GitHub Secrets
  - Reescritura SPA para un routing correcto

---

## XIV. Guía de Cuentas Demo

- Auto-login: demo@fintrack.com con datos precargados
- Forzar carga: Home → dropdown de perfil (Topbar) → Log out → Log in as Demo
- Cambiar cuenta: dropdown de perfil (Topbar) → Change account → demo2@email.com / demo123456
- Registrar nuevo usuario: dropdown de perfil (Topbar) → Create new account → nuevos datos personales

---

## XV. Video de Demostración

- Enlace de Google Drive con el recorrido completo de la aplicación
- Incluye el flujo de autenticación, gráficos, tablas, filtros, operaciones CRUD y el modo demo

- https://drive.google.com/drive/folders/1_jMBqULeBlkON4jJ3fiYP8wT0_fMkQsb?usp=sharing

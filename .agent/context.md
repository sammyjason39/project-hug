# Zenvix / OpsCore — AI Agent Context

> **Purpose:** Onboarding context for AI agents. Read this file first before exploring the codebase.
> **Last updated:** 2026-06-22
> **Repo:** `https://github.com/clementhansel8891/project-hug.git`

---

## 1. What This Project Is

**Project Hug** is a large, production-oriented **multi-tenant business operations platform** (ERP + POS). It consolidates enterprise departments and industry modules into one web application.

| Name | Where used |
|------|------------|
| **OpsCore** | `README.md` — modular business OS |
| **Zenvix Business Flow Suite (BFS)** | Docs, user manuals |
| **Zenvix Platform** | Backend package, AI context |

**One-liner:** All-in-one ERP for Finance, HR, Inventory, Sales, Marketing, Procurement, Payments, IT, plus industry modules (Retail, Cafe/F&B, Clinic, Farming).

**Scale (approx.):**
- ~100 Prisma models
- ~384 frontend page components (`src/pages/`)
- ~962 backend TypeScript files (`backend/src/`)
- ~271k lines of code

---

## 2. Architecture (Three Layers)

```
┌─────────────────────────────────────────────────────────────┐
│  CORE LAYER — Identity, licensing, config, audit, security  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PLATFORM LAYER — Device detection, dynamic routing, UI     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  MODULE LAYER — Industry + department business logic        │
└─────────────────────────────────────────────────────────────┘
```

### Core principles
1. **Core first** — identity, licensing, data safety are centralized.
2. **Modules, not apps** — industries plug in as isolated modules; no direct module-to-module calls.
3. **Configuration over code** — tenant behavior driven by config, not hardcoded UI.

### Multi-tenancy
- Headers: `x-tenant-id`, `x-location-id` on every API request.
- Hierarchy: **Company (L1) → Industry Module (L2) → Location (L3)**.
- `tenant_id` is **always the first argument** in service/repository methods.
- Row-level isolation via `tenant_id` on all tables.

---

## 3. Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18, TypeScript, Vite 6, Tailwind, shadcn/ui, React Query, React Router v6 |
| Backend | NestJS 11, TypeScript, Socket.io |
| Database | PostgreSQL 14+, Prisma 6.2.1 |
| Auth | JWT, bcrypt, RBAC |
| Testing | Vitest, Playwright (E2E audit workflows) |
| Deploy | Docker, Render (`render.yaml`), VPS scripts |

**Dev commands:**
```bash
npm install
npm run dev          # frontend (Vite) + backend (NestJS) concurrently
```
- Backend: port **3001**, all APIs prefixed `/api`
- Mode: `DEV_MOCK_MODE` / `PERSISTENCE_MODE=mock` supported

---

## 4. Directory Map

```
project-hug/
├── .agent/context.md          ← THIS FILE (agent onboarding)
├── .cursorrules               ← Mandatory coding constraints
├── src/                       ← React frontend
│   ├── core/                  ← Platform logic (identity, routing, services, repos)
│   ├── pages/core/            ← Finance, HR, Inventory, Sales, Marketing, etc.
│   ├── pages/retail/          ← Retail management + operational (POS)
│   ├── pages/fnb/             ← Cafe / F&B
│   ├── modules/               ← Industry module definitions
│   ├── layouts/               ← CoreLayout, ModuleLayout
│   └── components/            ← Shared UI (shadcn)
├── backend/
│   ├── src/core/              ← Finance, HR, Inventory, Sales, Marketing, etc.
│   ├── src/modules/           ← Retail, Clinic, F&B, Warehouse, Compliance
│   ├── src/shared/            ← Audit, comms, license, events, cache
│   ├── src/gateway/           ← Tenant middleware, health, guards
│   ├── src/persistence/       ← Repository implementations
│   └── src/agentic/           ← AI/ML (inventory forecasting)
├── prisma/                    ← Schema + migrations (100 models)
├── tests/playwright/          ← E2E audit tests
├── mappings/                  ← Module structure JSON (Finance, HR, Retail, etc.)
├── user-manuals/              ← End-user docs
├── PLATFORM_DOCS/             ← Architecture docs
└── docs/SPEC.md               ← Master specification (detailed)
```

### Frontend entry points
- `src/App.tsx` — router; routes built dynamically via `buildCoreRoutes()` + `buildModuleRoutes()`
- `src/core/runtime/coreRoutes.tsx` — core department routes
- `src/core/runtime/moduleRoutes.tsx` — industry module routes

### Backend entry points
- `backend/src/app.module.ts` — root NestJS module (all imports)
- `backend/src/main.ts` — bootstrap

---

## 5. Modules & Capabilities

### Core business modules (`backend/src/core/`, `src/pages/core/`)

| Module | Key capabilities |
|--------|------------------|
| **Finance** | GL, AR/AP, journal entries, fiscal periods, hash-chain ledger integrity |
| **HR** | Employees, attendance, leave, payroll, recruitment, compliance |
| **Inventory** | Multi-location stock, transfers, adjustments, barcodes, stock opname |
| **Sales** | Leads, pipeline, quotes, orders, incentives |
| **Marketing** | Campaigns, automation, social sync |
| **Procurement** | Requisitions, POs, suppliers, goods receipt |
| **Payment** | Multi-provider payments, refunds, offline payment matrix |
| **IT** | Device management, provisioning, system health |
| **Admin** | Tenant config, users/roles, module licensing |
| **Settings** | Company settings, roles |

### Shared services (`backend/src/shared/`)
- **Audit** — immutable hash-chain audit trail
- **Comms** — chat, internal mail, bulletin board, notifications
- **License** — per-tenant module licensing
- **Workflow** — approval workflows, task automation
- **Events** — domain event bus

### Industry modules (`backend/src/modules/`, `src/pages/`)

| Module | Path | Purpose |
|--------|------|---------|
| **Retail** | `modules/retail/`, `pages/retail/` | POS, shifts, cash reconciliation, barcode checkout, promotions, kiosk, opname |
| **F&B / Cafe** | `modules/fnb/`, `pages/fnb/` | Table ordering, KDS, counter billing |
| **Clinic** | `modules/clinic/`, `pages/industry/clinic/` | Patient reservations (stub) |
| **Farming** | `modules/farming/` | Sensor logs (stub) |
| **Warehouse** | `modules/warehouse/` | Warehouse operations |

**Retail hard rules:**
- Retail is the **only commerce authority** — all selling goes through Retail adapters.
- Isolation scope: `tenant_id + store_id + shift_id`.
- Device-aware routing: POS → checkout only; SCANNER → opname only; KIOSK → self-service; ADMIN_PC → management.
- Offline payments: Cash + Voucher only; Card/QRIS/Loyalty require online.

---

## 6. User Flow

1. Login → `/auth/login`
2. Onboarding (first user) → `/auth/onboarding`
3. Core Dashboard → `/core/dashboard`
4. Department workspaces → `/core/finance/*`, `/core/hr/*`, etc.
5. Retail ops → `/m/retail/operational/pos`, `/m/retail/management/*`

### Demo accounts (dev only)

| Email | Password | Scope |
|-------|----------|-------|
| `admin@opscore.com` | `admin123` | Core Admin |
| `manager@opscore.com` | `manager123` | Core Manager |
| `retail@opscore.com` | `retail123` | Retail Cashier |
| `retail.manager@opscore.com` | `retail123` | Retail Manager |
| `cafe@opscore.com` | `cafe123` | Cafe Staff |

---

## 7. Coding Constraints (from `.cursorrules`)

- **Multi-tenancy:** `tenant_id` first arg on all service/repository methods.
- **Location:** Pass `location_id` where applicable.
- **DTOs:** `class-validator` on all API inputs.
- **Repository pattern:** Interface first; Mock repos for dev, Prisma for prod.
- **Errors:** RFC 7807 Problem Details.
- **UI:** ConextLab brand — clean whitespace, Geist typography, ink/blue palette (see §9).
- **Wizards:** Multi-step for complex workflows.
- **Audit:** Every mutation must be logged.
- **No cross-module business logic mixing** — use `shared` for cross-cutting concerns.

---

## 8. Current Development Status

**Phase:** Production stabilization (as of mid-2026).

**Active focus:**
- Retail Gateway + External Channel Sync
- Finance, HR, IT core stability
- Removing mock data; wiring live API endpoints

**Recent work (git history):**
- HR module production-grade across 6 phases
- Retail: removed dead mocks, wired live supplier/audit data
- Security: real roles from DB, audit feed fixes
- UI color standardization + Docker build fixes

**Known spec:** `.kiro/specs/core-retail-stabilization/` — 11 bugs tracked, most fixed.

**Planned but not implemented:** Healthcare, Manufacturing, Security industry modules.

---

## 9. UI / Brand (ConextLab)

The platform UI follows the **ConextLab Brand System** (Geist + JetBrains Mono):

| Token | Value | Usage |
|-------|-------|-------|
| Ink | `#0A0A0A` | Primary text, dark surfaces, active nav |
| Blue | `#1652F0` | Accent, links, focus, primary actions |
| Mist | `#F8FAFC` | Section backgrounds |
| Hairline | `#E5E7EB` | Borders, dividers |
| Blue Soft | `#DCE5FE` | Badges, highlights |

**Design tokens:** `src/index.css` (CSS variables), `tailwind.config.ts` (fonts/radius).

**Key shared components:** `button.tsx`, `card.tsx`, `badge.tsx`, `GlassCard.tsx`, `CoreLayout.tsx`, `DepartmentWorkspaceLayout.tsx`, `PageHeader.tsx`, `PageShell.tsx`.

**Aesthetic:** Clean whitespace, hairline borders, pill buttons, no glassmorphism gradients. Features unchanged — UI only.

---

## 10. Deployment

- **Local DB:** `docker-compose up -d` (PostgreSQL)
- **Prisma:** `npx prisma generate && npx prisma migrate dev && npx prisma db seed`
- **Render:** `render.yaml` — backend web service + frontend static site
- **VPS:** `vps-auto-deploy.sh`, `vps-up.sh`
- **Env templates:** `.env.example`, `backend/.env.example`

---

## 11. Further Reading (by task)

| Task | Read first |
|------|------------|
| Full platform spec | `docs/SPEC.md` |
| Navigate codebase | `docs/CODEBASE_MAP.md` |
| Architecture | `PLATFORM_DOCS/CORE_ARCHITECTURE.md` |
| Multi-tenancy | `PLATFORM_DOCS/MULTI_TENANCY.md` |
| Retail module | `readme/RETAIL_MODULE.md` |
| Module JSON maps | `mappings/*.json` |
| User-facing docs | `user-manuals/` |
| Retail stabilization | `.kiro/specs/core-retail-stabilization/CONTEXT.md` |
| Quick agent essence | `PLATFORM_DOCS/AI_CONTEXT/system_context.md` |

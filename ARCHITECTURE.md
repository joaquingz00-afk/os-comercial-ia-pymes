# OS Comercial con IA para PYMEs — Arquitectura Completa

## 1. Visión del Producto

**Sistema operativo comercial modular** para PYMEs B2B que permite:

| Capacidad | Descripción |
|-----------|-------------|
| Ordenar leads | CRM liviano con pipeline visual Kanban |
| Seguimiento automático | Recordatorios + emails generados con IA |
| Cotizaciones base | Generador desde catálogo con export PDF |
| Forecast simple | Dashboard con proyección de ventas |
| Control de rentabilidad | Ingresos, gastos, margen por cliente/vendedor |
| Pricing inteligente | Calculadora de tarifas + sugerencias IA |

### Modelo de Negocio SaaS

El sistema se comercializa como **plataforma modular**. Cada módulo puede venderse por separado o en paquetes:

```
┌─────────────────────────────────────────────────────────┐
│                  OS COMERCIAL IA                        │
│                  (Plataforma Base)                      │
│  Auth · Multi-tenant · Roles · Configuración           │
├──────────┬──────────┬──────────┬──────────┬────────────┤
│ Módulo 1 │ Módulo 2 │ Módulo 3 │ Módulo 4 │ Módulo 5   │
│   CRM    │  Cotiz.  │ Finanzas │ Pricing  │ IA Engine  │
│          │          │          │          │            │
│  FREE    │  BASIC   │  PRO     │  PRO     │  PREMIUM   │
└──────────┴──────────┴──────────┴──────────┴────────────┘
```

**Planes sugeridos:**
- **Free**: CRM básico (hasta 50 leads)
- **Starter ($29/mes)**: CRM + Cotizaciones
- **Pro ($79/mes)**: + Control Financiero + Pricing
- **Premium ($149/mes)**: Todo + IA Engine completo

---

## 2. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | Fullstack, SSR, ecosistema React |
| **UI** | Tailwind CSS + shadcn/ui | Rápido, accesible, profesional |
| **Backend/API** | Next.js API Routes + Server Actions | Un solo proyecto, menos infra |
| **Base de datos** | PostgreSQL (via Supabase) | Relacional, RLS nativo, auth incluido |
| **ORM** | Prisma | Type-safe, migraciones automáticas |
| **Autenticación** | Supabase Auth | Multi-tenant, OAuth, magic links |
| **IA** | Anthropic Claude API | Superior en español y texto largo |
| **Charts** | Recharts | Ligero, declarativo, React nativo |
| **Email** | Resend | API moderna, fácil de integrar |
| **PDF** | @react-pdf/renderer | Funciona en serverless |
| **Validación** | Zod | Schemas compartidos front/back |
| **Drag & Drop** | @dnd-kit | Ligero, accesible, para Kanban |
| **Deploy** | Vercel | Zero-config, preview deploys |
| **Storage** | Supabase Storage | PDFs, archivos adjuntos |

### Principios de Stack
- **Monolito modular** → un proyecto, módulos desacoplados por carpeta
- **TypeScript end-to-end** → tipos compartidos DB ↔ API ↔ UI
- **Feature flags por tenant** → cada empresa activa solo los módulos de su plan
- **Sin microservicios** → innecesario para MVP, fácil de extraer después

---

## 3. Diseño Modular del Sistema

### 3.1 Plataforma Base (Core)

**Auth & Multi-tenancy** — siempre incluido
- Registro/login por empresa (tenant)
- Roles: `ADMIN` | `SELLER` | `VIEWER`
- Row Level Security: cada empresa ve solo sus datos
- Middleware de permisos por módulo activo
- Gestión de suscripción/plan

```
Lógica multi-tenant:
┌────────────────────────────────┐
│  Request llega                 │
│  → Middleware auth             │
│  → Extraer tenantId del token  │
│  → Verificar módulos activos   │
│  → Inyectar tenantId en query  │
│  → RLS en PostgreSQL           │
└────────────────────────────────┘
```

### 3.2 Módulo CRM (Gestión de Leads)

| Feature | Descripción |
|---------|-------------|
| CRUD Leads | Crear, editar, eliminar contactos/empresas |
| Pipeline Kanban | Drag & drop: Nuevo → Contactado → Propuesta → Negociación → Ganado/Perdido |
| Timeline | Historial de actividades (llamadas, emails, reuniones, notas) |
| Seguimiento | Recordatorios automáticos de próximo contacto |
| Etiquetas | Categorización libre por tags |
| Import CSV | Carga masiva de leads |
| Filtros | Por etapa, vendedor, fecha, valor, tags |

### 3.3 Módulo Cotizaciones

| Feature | Descripción |
|---------|-------------|
| Catálogo | CRUD de productos/servicios con precio base |
| Generador | Seleccionar items, cantidades, descuentos |
| Preview | Vista previa en pantalla con branding empresa |
| Export PDF | Generación de PDF profesional |
| Estados | Borrador → Enviada → Aceptada → Rechazada |
| Historial | Versiones de cotización por lead |

### 3.4 Módulo Control Financiero Comercial (Producto Independiente)

**Fase 1 — MVP:**

| Feature | Descripción |
|---------|-------------|
| Dashboard financiero | Ingresos vs gastos, utilidad mensual |
| Control mensual | Vista mes a mes con comparativo |
| Cuentas por cobrar | Facturas pendientes, días de mora |
| Métricas operativas | Ticket promedio, ciclo de venta |
| Control por cliente | Ingresos/gastos desglosados por cliente |
| Control por proyecto | Rentabilidad por proyecto/deal |

**Fase 2 — Evolución:**

| Feature | Descripción |
|---------|-------------|
| Rentabilidad por vendedor | Margen neto generado por cada vendedor |
| Rentabilidad por cliente | LTV, costo de adquisición, margen por cliente |
| Forecast financiero | Proyección de ingresos basada en pipeline + histórico |

### 3.5 Módulo Calculadora Inteligente de Precios (Producto Independiente)

**Fase 1 — MVP:**

| Feature | Descripción |
|---------|-------------|
| Costos personales | Registro de gastos fijos del profesional/equipo |
| Costos de negocio | Gastos operativos, herramientas, infra |
| Tarifa mínima | Cálculo automático del piso de precio |
| Tarifa recomendada | Precio sugerido con margen deseado |
| Simulador | "Si cobro X por Y horas, mi margen es Z%" |
| Auto-pricing | Cálculo automático para nuevas cotizaciones |

**Fase 2 — Evolución:**

| Feature | Descripción |
|---------|-------------|
| Pricing por segmento | Tarifas diferenciadas por tipo de cliente (startup, enterprise, gobierno) |
| Pricing por complejidad | Factores de complejidad que ajustan precio |
| Sugerencias IA | Claude analiza historial y sugiere precio óptimo |

### 3.6 Módulo IA Engine

| Feature | Descripción |
|---------|-------------|
| Emails de seguimiento | Generación de emails personalizados por contexto del lead |
| Lead scoring | Probabilidad de cierre basada en actividad e historial |
| Sugerencia de productos | Recomendar items para cotización según perfil |
| Resumen de reuniones | Extraer acción items de notas de reunión |
| Pricing IA | Sugerir precio óptimo basado en datos históricos |
| Próxima acción | Recomendar qué hacer con cada lead |

---

## 4. Modelo de Datos

```
Tenant (empresa/organización)
├── id, name, slug, plan (FREE|STARTER|PRO|PREMIUM)
├── activeModules[] (CRM, QUOTES, FINANCE, PRICING, AI)
├── branding (logo, colors)
├── createdAt, updatedAt
│
├── User (usuarios)
│   ├── id, email, name, avatarUrl
│   ├── role (ADMIN|SELLER|VIEWER)
│   ├── tenantId (FK)
│   └── monthlySalary (para cálculo rentabilidad)
│
├── Lead (leads/prospectos)
│   ├── id, company, contactName, email, phone
│   ├── stage (NEW|CONTACTED|PROPOSAL|NEGOTIATION|WON|LOST)
│   ├── value (monto estimado en $)
│   ├── probability (0-100%)
│   ├── source (WEB|REFERRAL|COLD|EVENT|OTHER)
│   ├── segment (STARTUP|SMB|ENTERPRISE|GOVERNMENT)
│   ├── tags[], notes
│   ├── nextFollowUp (date)
│   ├── wonAt, lostAt, lostReason
│   ├── assignedToId → User
│   └── tenantId (FK)
│
├── Activity (timeline)
│   ├── id, type (CALL|EMAIL|MEETING|NOTE|TASK)
│   ├── title, description, date
│   ├── leadId (FK), userId (FK)
│   └── metadata (JSON) — datos extra flexibles
│
├── Product (catálogo)
│   ├── id, name, description, sku
│   ├── basePrice, unit (HOUR|PROJECT|MONTH|UNIT)
│   ├── costPrice (costo real para margen)
│   ├── category, isActive
│   └── tenantId (FK)
│
├── Quote (cotización)
│   ├── id, number (auto-incremental por tenant)
│   ├── status (DRAFT|SENT|ACCEPTED|REJECTED|EXPIRED)
│   ├── validUntil, subtotal, taxRate, taxAmount, total
│   ├── notes, terms
│   ├── leadId (FK), createdById → User
│   └── tenantId (FK)
│
├── QuoteItem (líneas de cotización)
│   ├── id, description, quantity, unitPrice
│   ├── discount (%), lineTotal
│   ├── quoteId (FK), productId (FK)
│   └── complexityFactor (1.0 default, para pricing)
│
├── Transaction (ingresos/gastos) — Módulo Financiero
│   ├── id, type (INCOME|EXPENSE)
│   ├── category, description, amount, date
│   ├── status (PENDING|PAID|OVERDUE)
│   ├── dueDate (para cuentas por cobrar)
│   ├── leadId (FK, opcional), projectName
│   ├── userId (FK, vendedor asociado)
│   └── tenantId (FK)
│
├── PricingConfig (configuración pricing) — Módulo Pricing
│   ├── id, personalCosts (JSON), businessCosts (JSON)
│   ├── desiredMargin (%), workingHoursPerMonth
│   ├── minimumRate, recommendedRate
│   └── tenantId (FK)
│
├── PricingRule (reglas por segmento)
│   ├── id, segment (STARTUP|SMB|ENTERPRISE|GOVERNMENT)
│   ├── multiplier (ej: 1.5 para enterprise)
│   ├── complexityFactors (JSON)
│   └── tenantId (FK)
│
└── ModuleConfig (configuración por módulo)
    ├── id, module (CRM|QUOTES|FINANCE|PRICING|AI)
    ├── enabled (boolean)
    ├── settings (JSON) — config específica del módulo
    └── tenantId (FK)
```

---

## 5. Estructura de Carpetas

```
os-comercial-ia-pymes/
├── prisma/
│   ├── schema.prisma              # Todos los modelos
│   ├── seed.ts                    # Datos demo
│   └── migrations/
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # === Rutas públicas ===
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/           # === Rutas protegidas ===
│   │   │   ├── layout.tsx         # Sidebar + header + module guard
│   │   │   ├── page.tsx           # Dashboard principal (resumen)
│   │   │   │
│   │   │   ├── leads/             # ── Módulo CRM ──
│   │   │   │   ├── page.tsx               # Lista/tabla de leads
│   │   │   │   ├── [id]/page.tsx          # Detalle + timeline
│   │   │   │   └── pipeline/page.tsx      # Vista Kanban
│   │   │   │
│   │   │   ├── cotizaciones/      # ── Módulo Cotizaciones ──
│   │   │   │   ├── page.tsx               # Lista
│   │   │   │   ├── nueva/page.tsx         # Crear/editar
│   │   │   │   └── [id]/page.tsx          # Preview + PDF
│   │   │   │
│   │   │   ├── productos/         # ── Catálogo ──
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── finanzas/          # ── Módulo Financiero ──
│   │   │   │   ├── page.tsx               # Dashboard financiero
│   │   │   │   ├── transacciones/page.tsx # CRUD ingresos/gastos
│   │   │   │   ├── cobrar/page.tsx        # Cuentas por cobrar
│   │   │   │   └── rentabilidad/page.tsx  # Por vendedor/cliente
│   │   │   │
│   │   │   ├── pricing/           # ── Módulo Pricing ──
│   │   │   │   ├── page.tsx               # Dashboard pricing
│   │   │   │   ├── calculadora/page.tsx   # Calculadora de tarifas
│   │   │   │   ├── simulador/page.tsx     # Simulador de proyectos
│   │   │   │   └── reglas/page.tsx        # Reglas por segmento
│   │   │   │
│   │   │   ├── forecast/          # ── Forecast ──
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── configuracion/     # ── Settings ──
│   │   │       ├── page.tsx               # General
│   │   │       ├── equipo/page.tsx        # Gestión usuarios
│   │   │       ├── modulos/page.tsx       # Activar/desactivar módulos
│   │   │       └── plan/page.tsx          # Suscripción/billing
│   │   │
│   │   ├── api/                   # === API Routes ===
│   │   │   ├── leads/route.ts
│   │   │   ├── cotizaciones/route.ts
│   │   │   ├── productos/route.ts
│   │   │   ├── transacciones/route.ts
│   │   │   ├── pricing/route.ts
│   │   │   ├── ai/
│   │   │   │   ├── generate-email/route.ts
│   │   │   │   ├── lead-scoring/route.ts
│   │   │   │   ├── suggest-products/route.ts
│   │   │   │   └── suggest-price/route.ts
│   │   │   └── webhooks/
│   │   │       └── stripe/route.ts
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx             # Root layout
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui (button, card, dialog, etc.)
│   │   │
│   │   ├── leads/                 # Componentes CRM
│   │   │   ├── lead-card.tsx
│   │   │   ├── lead-form.tsx
│   │   │   ├── lead-pipeline.tsx
│   │   │   ├── lead-timeline.tsx
│   │   │   └── lead-filters.tsx
│   │   │
│   │   ├── cotizaciones/          # Componentes Cotizaciones
│   │   │   ├── cotizacion-form.tsx
│   │   │   ├── cotizacion-preview.tsx
│   │   │   ├── cotizacion-pdf.tsx
│   │   │   └── item-selector.tsx
│   │   │
│   │   ├── finanzas/              # Componentes Financieros
│   │   │   ├── transaction-form.tsx
│   │   │   ├── finance-dashboard.tsx
│   │   │   ├── cobrar-table.tsx
│   │   │   └── rentabilidad-charts.tsx
│   │   │
│   │   ├── pricing/               # Componentes Pricing
│   │   │   ├── cost-form.tsx
│   │   │   ├── rate-calculator.tsx
│   │   │   ├── project-simulator.tsx
│   │   │   └── segment-rules.tsx
│   │   │
│   │   ├── forecast/              # Componentes Forecast
│   │   │   ├── funnel-chart.tsx
│   │   │   ├── forecast-chart.tsx
│   │   │   └── kpi-card.tsx
│   │   │
│   │   └── shared/                # Componentes compartidos
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       ├── data-table.tsx
│   │       ├── empty-state.tsx
│   │       ├── module-guard.tsx   # Gate por módulo activo
│   │       └── stat-card.tsx
│   │
│   ├── lib/
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── auth.ts                # Auth helpers + middleware
│   │   ├── ai.ts                  # Claude API client
│   │   ├── email.ts               # Resend client
│   │   ├── pdf.ts                 # Generador de PDFs
│   │   ├── utils.ts               # Utilidades generales
│   │   ├── modules.ts             # Lógica de módulos activos
│   │   ├── pricing-engine.ts      # Motor de cálculo de precios
│   │   ├── finance-engine.ts      # Cálculos financieros
│   │   └── validations/           # Zod schemas
│   │       ├── lead.ts
│   │       ├── cotizacion.ts
│   │       ├── producto.ts
│   │       ├── transaction.ts
│   │       └── pricing.ts
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-leads.ts
│   │   ├── use-forecast.ts
│   │   ├── use-module.ts          # Hook para verificar módulo activo
│   │   └── use-pricing.ts
│   │
│   └── types/
│       └── index.ts               # Tipos compartidos
│
├── public/
│   └── logo.svg
│
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── ARCHITECTURE.md
└── README.md
```

---

## 6. Lógica SaaS Multi-Tenant

### 6.1 Aislamiento de Datos

```
Estrategia: Schema compartido + tenantId en cada tabla

┌──────────────────────────────────────────┐
│              PostgreSQL                  │
│                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Tenant A │ │Tenant B │ │Tenant C │   │
│  │tenantId │ │tenantId │ │tenantId │   │
│  │= "abc"  │ │= "def"  │ │= "ghi"  │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                          │
│  Mismas tablas, filtradas por tenantId   │
│  + Row Level Security de PostgreSQL      │
└──────────────────────────────────────────┘
```

### 6.2 Control de Módulos

```typescript
// Cada tenant tiene módulos habilitados según su plan
// Middleware verifica acceso antes de renderizar

Plan FREE    → [CRM]
Plan STARTER → [CRM, QUOTES]
Plan PRO     → [CRM, QUOTES, FINANCE, PRICING]
Plan PREMIUM → [CRM, QUOTES, FINANCE, PRICING, AI]

// module-guard.tsx verifica en cada página:
// 1. ¿El tenant tiene este módulo activo?
// 2. ¿El usuario tiene el rol necesario?
// 3. Si no → redirect a upgrade page
```

### 6.3 Flujo de Autenticación

```
1. Usuario se registra → crea Tenant + User (ADMIN)
2. Admin invita usuarios → se crean con tenantId del admin
3. Login → JWT con { userId, tenantId, role, plan }
4. Cada request → middleware extrae tenantId
5. Queries → WHERE tenantId = :tenantId (automático via Prisma middleware)
6. Módulos → verificación en middleware + UI condicional
```

---

## 7. Roadmap por Fases

### FASE 1 — Fundación + CRM MVP (Semana 1-2)
> Objetivo: App funcional con CRM básico

- [ ] Setup: Next.js + Prisma + Supabase + Tailwind + shadcn/ui
- [ ] Auth: registro, login, middleware, roles
- [ ] Multi-tenancy: modelo Tenant, Prisma middleware, RLS
- [ ] Layout: sidebar, header, navegación, responsive
- [ ] CRM: CRUD leads, tabla con filtros
- [ ] Pipeline: Kanban visual con drag & drop
- [ ] Timeline: actividades por lead

**Entregable:** Un usuario puede registrarse, crear leads y moverlos en un pipeline.

### FASE 2 — Cotizaciones + Catálogo (Semana 2-3)
> Objetivo: Generar cotizaciones profesionales

- [ ] Catálogo de productos/servicios
- [ ] Constructor de cotizaciones (items, cantidades, descuentos)
- [ ] Preview en pantalla con branding
- [ ] Export PDF profesional
- [ ] Estados de cotización + historial
- [ ] Vincular cotización a lead

**Entregable:** Un vendedor puede crear y enviar cotizaciones en PDF.

### FASE 3 — Control Financiero (Semana 3-4)
> Objetivo: Módulo de finanzas comercializable

- [ ] CRUD de transacciones (ingresos/gastos)
- [ ] Dashboard: ingresos vs gastos, utilidad, margen
- [ ] Control mensual con comparativo
- [ ] Cuentas por cobrar + alertas de mora
- [ ] Métricas por cliente y por proyecto
- [ ] Rentabilidad por vendedor

**Entregable:** Dashboard financiero funcional, comercializable como producto separado.

### FASE 4 — Calculadora de Precios (Semana 4-5)
> Objetivo: Módulo de pricing comercializable

- [ ] Formulario de costos (personales + negocio)
- [ ] Cálculo automático: tarifa mínima + recomendada
- [ ] Simulador de proyectos
- [ ] Reglas por segmento de cliente
- [ ] Factores de complejidad
- [ ] Integración con cotizaciones (auto-pricing)

**Entregable:** Calculadora de precios funcional, comercializable como producto separado.

### FASE 5 — IA + Automatización (Semana 5-6)
> Objetivo: Inteligencia artificial como diferenciador

- [ ] Integración Claude API
- [ ] Generación de emails de seguimiento
- [ ] Lead scoring automático
- [ ] Sugerencias de productos en cotizaciones
- [ ] Sugerencia de precio óptimo (IA)
- [ ] Resumen automático de notas de reunión

**Entregable:** Funcionalidades IA activas en todos los módulos.

### FASE 6 — Dashboard, Forecast & Demo (Semana 6-7)
> Objetivo: Dashboard completo + listo para demo comercial

- [ ] Dashboard ejecutivo con KPIs consolidados
- [ ] Embudo de ventas visual
- [ ] Forecast mensual (probabilidad × monto)
- [ ] Forecast financiero (proyección basada en pipeline)
- [ ] Seed con datos de demo realistas
- [ ] Landing page / onboarding
- [ ] Flujo de upgrade de plan

**Entregable:** Producto demo-ready para presentar a clientes potenciales.

---

## 8. Estrategia de Comercialización SaaS

### 8.1 Empaquetado de Módulos

```
Producto 1: "CRM Comercial"
  → Módulo CRM + Pipeline + Seguimiento
  → Plan Free / Starter

Producto 2: "Control Financiero Comercial"
  → Módulo Finanzas standalone
  → Puede venderse sin CRM
  → $29-49/mes

Producto 3: "Calculadora Inteligente de Precios"
  → Módulo Pricing standalone
  → Puede venderse sin CRM
  → $19-39/mes

Producto 4: "OS Comercial Completo"
  → Todos los módulos + IA
  → $79-149/mes

Producto 5: "IA Engine" (add-on)
  → Se agrega a cualquier plan
  → $30-50/mes adicional
```

### 8.2 Modelo de Crecimiento

```
Etapa 1: Regalar CRM básico (Free) → captar usuarios
Etapa 2: Monetizar con Cotizaciones (Starter) → primer ingreso
Etapa 3: Upsell con Finanzas + Pricing (Pro) → ticket promedio alto
Etapa 4: IA como diferenciador (Premium) → retención y lock-in
```

### 8.3 Métricas Clave a Trackear

- **Activación**: % de usuarios que crean su primer lead
- **Conversión**: Free → Paid
- **Upsell**: Starter → Pro → Premium
- **Retención**: Churn mensual por plan
- **Revenue**: MRR, ARPU, LTV

---

## 9. Decisiones Técnicas Clave

| Decisión | Elección | Alternativa | Razón |
|----------|----------|-------------|-------|
| Arquitectura | **Monolito modular** | Microservicios | MVP rápido, un deploy |
| API | **REST (API Routes)** | tRPC / GraphQL | Simple, suficiente para MVP |
| ORM | **Prisma** | Drizzle | Más maduro, mejor DX |
| Auth | **Supabase Auth** | NextAuth | Auth + DB + Storage en uno |
| DB hosting | **Supabase** | Neon, PlanetScale | Todo-en-uno, RLS nativo |
| IA | **Claude API** | OpenAI | Superior en español, contexto largo |
| PDF | **@react-pdf/renderer** | Puppeteer | Funciona en serverless |
| Charts | **Recharts** | Chart.js, Tremor | React nativo, declarativo |
| Multi-tenant | **Schema compartido + tenantId** | Schema por tenant | Simple, escalable hasta ~10k tenants |
| Feature flags | **DB (ModuleConfig)** | LaunchDarkly | Sin dependencia externa |
| Payments | **Stripe** (futuro) | Lemonsqueezy | Standard de la industria |

---

## 10. Variables de Entorno

```env
# Database
DATABASE_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (IA)
ANTHROPIC_API_KEY=

# Email
RESEND_API_KEY=
EMAIL_FROM=notificaciones@tudominio.com

# Stripe (futuro)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="OS Comercial IA"
```

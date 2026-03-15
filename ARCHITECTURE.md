# OS Comercial con IA para PYMEs — Plan de Arquitectura

## 1. Visión del Producto

Sistema SaaS que ayuda a PYMEs B2B a:
- **Ordenar leads** → CRM liviano con pipeline visual
- **Seguimiento automático** → Recordatorios + emails automáticos con IA
- **Cotizaciones base** → Generador de cotizaciones desde plantillas
- **Forecast simple** → Dashboard con proyección de ventas

---

## 2. Stack Tecnológico Recomendado

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SSR, SEO, rendimiento, ecosistema React |
| **UI** | Tailwind CSS + shadcn/ui | Componentes accesibles, rápido de construir |
| **Backend/API** | Next.js API Routes + Server Actions | Fullstack en un solo proyecto, menos infra |
| **Base de datos** | PostgreSQL (via Supabase) | Relacional, robusto, auth incluido |
| **ORM** | Prisma | Type-safe, migraciones, excelente DX |
| **Autenticación** | Supabase Auth (o NextAuth.js) | Multi-tenant ready, OAuth, magic links |
| **IA** | Anthropic Claude API | Generación de emails, cotizaciones, análisis |
| **Email** | Resend | API moderna, fácil integración |
| **Deploy** | Vercel | Zero-config para Next.js, preview deploys |
| **Storage** | Supabase Storage | PDFs de cotizaciones, archivos adjuntos |

### ¿Por qué este stack?
- **Un solo proyecto** (monolito modular) → más rápido de desarrollar
- **TypeScript end-to-end** → menos bugs, mejor autocompletado
- **Supabase** → PostgreSQL + Auth + Storage sin gestionar infra
- **Vercel** → Deploy automático, escalado sin configuración

---

## 3. Módulos del Sistema

### Módulo 1: Auth & Multi-tenancy
- Registro/login por empresa (tenant)
- Roles: Admin, Vendedor, Viewer
- Cada empresa ve solo sus datos (Row Level Security)

### Módulo 2: CRM / Gestión de Leads
- CRUD de leads/contactos
- Pipeline visual (Kanban): Nuevo → Contactado → Propuesta → Negociación → Cerrado
- Etiquetas y filtros
- Importación CSV

### Módulo 3: Seguimiento Automático
- Timeline de actividades por lead
- Recordatorios automáticos (próximo contacto)
- Emails de seguimiento generados con IA
- Plantillas de email personalizables

### Módulo 4: Cotizaciones
- Catálogo de productos/servicios
- Generador de cotizaciones (seleccionar items, cantidades, descuentos)
- Preview y export PDF
- IA sugiere productos complementarios basándose en historial

### Módulo 5: Forecast / Dashboard
- Valor total del pipeline por etapa
- Proyección mensual (probabilidad × monto)
- Tasa de conversión
- Gráficos: embudo, tendencia, top vendedores

### Módulo 6: Integraciones IA
- Generación de emails de seguimiento (Claude API)
- Resumen automático de notas de reunión
- Scoring de leads (probabilidad de cierre)
- Sugerencias de próxima acción

---

## 4. Estructura de Carpetas

```
os-comercial-ia-pymes/
├── prisma/
│   ├── schema.prisma          # Modelos de datos
│   └── seed.ts                # Datos de prueba
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Rutas públicas
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/       # Rutas protegidas
│   │   │   ├── layout.tsx     # Sidebar + header
│   │   │   ├── page.tsx       # Dashboard principal
│   │   │   ├── leads/
│   │   │   │   ├── page.tsx           # Lista de leads
│   │   │   │   ├── [id]/page.tsx      # Detalle de lead
│   │   │   │   └── pipeline/page.tsx  # Vista Kanban
│   │   │   ├── cotizaciones/
│   │   │   │   ├── page.tsx           # Lista
│   │   │   │   ├── nueva/page.tsx     # Crear cotización
│   │   │   │   └── [id]/page.tsx      # Detalle/preview
│   │   │   ├── productos/
│   │   │   │   └── page.tsx           # Catálogo
│   │   │   ├── forecast/
│   │   │   │   └── page.tsx           # Dashboard forecast
│   │   │   └── configuracion/
│   │   │       └── page.tsx           # Config empresa
│   │   │
│   │   ├── api/               # API Routes
│   │   │   ├── leads/
│   │   │   ├── cotizaciones/
│   │   │   ├── productos/
│   │   │   ├── ai/
│   │   │   │   ├── generate-email/
│   │   │   │   ├── lead-scoring/
│   │   │   │   └── suggest-products/
│   │   │   └── webhooks/
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx         # Root layout
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── leads/
│   │   │   ├── lead-card.tsx
│   │   │   ├── lead-form.tsx
│   │   │   ├── lead-pipeline.tsx
│   │   │   └── lead-timeline.tsx
│   │   ├── cotizaciones/
│   │   │   ├── cotizacion-form.tsx
│   │   │   ├── cotizacion-preview.tsx
│   │   │   └── item-selector.tsx
│   │   ├── forecast/
│   │   │   ├── funnel-chart.tsx
│   │   │   ├── forecast-chart.tsx
│   │   │   └── kpi-card.tsx
│   │   └── shared/
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       ├── data-table.tsx
│   │       └── empty-state.tsx
│   │
│   ├── lib/
│   │   ├── db.ts              # Prisma client instance
│   │   ├── auth.ts            # Auth helpers
│   │   ├── ai.ts              # Claude API client
│   │   ├── email.ts           # Resend client
│   │   ├── pdf.ts             # Generación de PDFs
│   │   ├── utils.ts           # Utilidades generales
│   │   └── validations/       # Zod schemas
│   │       ├── lead.ts
│   │       ├── cotizacion.ts
│   │       └── producto.ts
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-leads.ts
│   │   └── use-forecast.ts
│   │
│   └── types/                 # TypeScript types
│       └── index.ts
│
├── public/
│   └── logo.svg
│
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## 5. Modelo de Datos (Entidades Principales)

```
Tenant (empresa)
├── id, name, plan, createdAt
│
├── User (usuarios)
│   ├── id, email, name, role (ADMIN|SELLER|VIEWER)
│   └── tenantId (FK)
│
├── Lead (leads/prospectos)
│   ├── id, company, contactName, email, phone
│   ├── stage (NEW|CONTACTED|PROPOSAL|NEGOTIATION|WON|LOST)
│   ├── value (monto estimado)
│   ├── probability (0-100)
│   ├── source, tags, notes
│   ├── nextFollowUp (date)
│   ├── assignedTo → User
│   └── tenantId (FK)
│
├── Activity (timeline del lead)
│   ├── id, type (CALL|EMAIL|MEETING|NOTE)
│   ├── description, date
│   ├── leadId (FK)
│   └── userId (FK)
│
├── Product (catálogo)
│   ├── id, name, description, price, unit
│   └── tenantId (FK)
│
├── Quote (cotización)
│   ├── id, number, status (DRAFT|SENT|ACCEPTED|REJECTED)
│   ├── validUntil, subtotal, tax, total
│   ├── leadId (FK)
│   └── tenantId (FK)
│
└── QuoteItem (líneas de cotización)
    ├── id, quantity, unitPrice, discount, total
    ├── quoteId (FK)
    └── productId (FK)
```

---

## 6. Plan de Ejecución por Etapas

### Etapa 1 — Fundación (Semana 1)
- [x] Definir arquitectura ← **estamos aquí**
- [ ] Setup proyecto Next.js + Prisma + Supabase
- [ ] Configurar Tailwind + shadcn/ui
- [ ] Implementar Auth (registro, login, middleware)
- [ ] Layout base (sidebar, header, theme)

### Etapa 2 — MVP Core (Semana 2-3)
- [ ] CRUD de Leads completo
- [ ] Pipeline visual (Kanban drag & drop)
- [ ] Timeline de actividades
- [ ] CRUD de Productos
- [ ] Generador de Cotizaciones + preview
- [ ] Export PDF de cotizaciones

### Etapa 3 — IA + Automatización (Semana 3-4)
- [ ] Integración Claude API
- [ ] Generación de emails de seguimiento
- [ ] Lead scoring automático
- [ ] Sugerencia de productos en cotizaciones
- [ ] Recordatorios automáticos

### Etapa 4 — Dashboard & Demo (Semana 4-5)
- [ ] Dashboard con KPIs
- [ ] Gráfico de embudo de ventas
- [ ] Forecast mensual
- [ ] Datos de demo (seed)
- [ ] Landing page / onboarding
- [ ] Preparar demo comercial

---

## 7. Decisiones Clave

| Decisión | Elección | Alternativa |
|----------|----------|-------------|
| Monolito vs Microservicios | **Monolito modular** | Microservicios (innecesario para MVP) |
| REST vs GraphQL | **REST (API Routes)** | tRPC (viable si crece) |
| ORM | **Prisma** | Drizzle (más ligero pero menos maduro) |
| Auth | **Supabase Auth** | NextAuth (más flexible pero más setup) |
| DB hosting | **Supabase** | PlanetScale, Neon |
| IA | **Claude API** | OpenAI (Claude es mejor en texto largo y español) |
| PDF | **@react-pdf/renderer** | Puppeteer (pesado para serverless) |

---

## 8. Variables de Entorno Requeridas

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

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

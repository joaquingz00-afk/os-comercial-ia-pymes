# OS Comercial con IA para PYMEs — Arquitectura v3

## 1. Posicionamiento del Producto

### Qué NO somos
- No somos "otro CRM con IA"
- No somos un sistema genérico de contactos
- No somos una herramienta modular donde compras piezas sueltas

### Qué SÍ somos
**El sistema operativo comercial para equipos de ventas B2B en LATAM.**

Un solo producto que cubre el ciclo comercial completo:

```
PROSPECCIÓN → SEGUIMIENTO → PROPUESTA → CIERRE → RENTABILIDAD
     ↑              ↑            ↑          ↑          ↑
    IA            IA           IA         IA         IA
  (scoring)   (emails)    (pricing)  (forecast)  (análisis)
```

La IA no es un módulo aparte — está integrada en cada paso del proceso comercial.

### Diferenciadores clave
1. **B2B-first**: Cuentas con múltiples contactos, ciclos largos, deals complejos
2. **IA nativa**: No es un add-on, es parte del flujo desde el día 1
3. **LATAM-ready**: Español nativo, monedas locales, lógica fiscal regional
4. **Ciclo completo**: De la prospección a la rentabilidad en un solo sistema

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
| **IA** | Anthropic Claude API | Superior en español, contexto largo |
| **Charts** | Recharts | Ligero, declarativo, React nativo |
| **Email** | Resend | API moderna, envío transaccional |
| **PDF** | @react-pdf/renderer | Funciona en serverless |
| **Validación** | Zod | Schemas compartidos front/back |
| **Drag & Drop** | @dnd-kit | Ligero, accesible, para Kanban |
| **CRON/Jobs** | Vercel Cron + Inngest | Secuencias automáticas, recordatorios |
| **Deploy** | Vercel | Zero-config, preview deploys |
| **Storage** | Supabase Storage | PDFs, archivos adjuntos |

### Principios
- **Monolito modular** → un proyecto, un deploy, módulos por carpeta
- **TypeScript end-to-end** → tipos compartidos DB ↔ API ↔ UI
- **IA como infraestructura** → Claude API disponible en todo el stack
- **Sin microservicios** → innecesario para MVP, fácil de extraer después

---

## 3. Diseño de Módulos (Rediseñado)

### Cambio fundamental: de "módulos sueltos" a "sistema integrado"

```
┌─────────────────────────────────────────────────────────────┐
│                    OS COMERCIAL IA                          │
│              (Todo incluido, planes por escala)             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PLATAFORMA BASE (CORE)                 │   │
│  │  Auth · Multi-tenant · Roles · Configuración · IA   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────┐ ┌──────────────┐ ┌────────────────────┐    │
│  │  VENDER   │ │  COTIZAR     │ │  CONTROLAR         │    │
│  │           │ │              │ │                    │    │
│  │ Cuentas   │ │ Catálogo     │ │ Dashboard Fin.    │    │
│  │ Contactos │ │ Cotizaciones │ │ Rentabilidad      │    │
│  │ Pipeline  │ │ PDF Export   │ │ Forecast          │    │
│  │ Seguim.   │ │ Pricing Int. │ │ Cuentas x Cobrar  │    │
│  │ Secuencias│ │ Simulador    │ │ Por vendedor      │    │
│  └───────────┘ └──────────────┘ └────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              CAPA IA (TRANSVERSAL)                  │   │
│  │  Emails · Scoring · Pricing · Insights · Resúmenes │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.1 CORE — Plataforma Base

**Auth & Multi-tenancy** — siempre incluido
- Registro por empresa (tenant)
- Roles: `ADMIN` | `MANAGER` | `SELLER` | `VIEWER`
- Row Level Security por tenantId
- Onboarding guiado (wizard de setup)

```
Flujo multi-tenant:
Request → Auth middleware → tenantId del JWT
  → Verificar plan/límites → Inyectar en queries
  → RLS PostgreSQL filtra automáticamente
```

### 3.2 MÓDULO: VENDER (Motor Comercial B2B)

Este es el corazón del sistema. **No es un CRM — es un motor de ventas B2B.**

#### Cuentas (Account-Based)
| Feature | Descripción |
|---------|-------------|
| Cuentas (empresas) | Entidad principal. Una empresa = una cuenta |
| Múltiples contactos | Cada cuenta tiene N contactos con roles (decisor, influenciador, usuario, champion) |
| Perfil de cuenta | Industria, tamaño, segmento, revenue estimado |
| Health score | Indicador de salud de la relación (IA) |

#### Pipeline de Oportunidades
| Feature | Descripción |
|---------|-------------|
| Oportunidades (Deals) | Cada deal tiene monto, probabilidad, fecha estimada de cierre |
| Pipeline Kanban | Prospección → Calificación → Propuesta → Negociación → Cierre (Ganado/Perdido) |
| Múltiples deals por cuenta | Una cuenta puede tener varios deals en paralelo |
| Razón de pérdida | Tracking de por qué se pierden deals |
| Weighted pipeline | Valor ponderado = monto × probabilidad |

#### Seguimiento Inteligente (IA desde día 1)
| Feature | Descripción |
|---------|-------------|
| Timeline | Historial completo: llamadas, emails, reuniones, notas |
| Recordatorios inteligentes | IA sugiere cuándo y cómo hacer follow-up |
| Secuencias comerciales | Cadenas automáticas: email día 1 → reminder día 3 → llamada día 7 |
| Emails IA | Generación de emails personalizados según contexto del deal |
| Resumen de reuniones | Pegar notas → IA extrae action items y próximos pasos |
| Sugerencia de próxima acción | "Este deal lleva 5 días sin actividad. Sugiero: [acción]" |

### 3.3 MÓDULO: COTIZAR (Propuestas + Pricing Inteligente)

#### Cotizaciones
| Feature | Descripción |
|---------|-------------|
| Catálogo de productos/servicios | CRUD con precio base, costo, unidad |
| Constructor de cotizaciones | Items, cantidades, descuentos por línea |
| Preview con branding | Vista previa con logo y colores de la empresa |
| Export PDF profesional | Generación automática |
| Estados | Borrador → Enviada → Aceptada → Rechazada → Expirada |
| Vinculación a deal | Cada cotización asociada a un deal/cuenta |
| Versionado | v1, v2, v3 de la misma cotización |

#### Pricing Inteligente (integrado, no separado)
| Feature | Descripción |
|---------|-------------|
| Costos base | Costos del equipo + operativos + herramientas |
| Tarifa mínima/recomendada | Cálculo automático del piso y precio sugerido |
| Simulador de proyectos | "Si cobro X por Y horas, mi margen es Z%" |
| Pricing por segmento | Multiplicadores por tipo de cliente (startup ×0.8, enterprise ×1.5) |
| Pricing por complejidad | Factores que ajustan precio automáticamente |
| Sugerencias IA | "Para este tipo de cliente y proyecto, el precio óptimo es $X" |

### 3.4 MÓDULO: CONTROLAR (Finanzas + Forecast)

#### Control Financiero
| Feature | Descripción |
|---------|-------------|
| Dashboard financiero | Ingresos vs gastos, utilidad, margen mensual |
| Control mensual | Comparativo mes a mes, tendencia |
| Cuentas por cobrar | Facturas pendientes, días de mora, alertas |
| Por cliente | Revenue, costo, margen por cada cuenta |
| Por vendedor | Revenue generado, margen neto, comisiones |
| Por proyecto/deal | Rentabilidad real vs cotizada |

#### Forecast Serio
| Feature | Descripción |
|---------|-------------|
| Pipeline forecast | Proyección basada en etapa × probabilidad × monto |
| Forecast por vendedor | Cada vendedor tiene su proyección |
| Forecast mensual/trimestral | Vista temporal con comparativo histórico |
| Forecast financiero | Proyección de ingresos + gastos basada en pipeline + tendencia |
| Confianza del forecast | IA indica qué tan confiable es la proyección |
| Embudo visual | Conversión por etapa, velocidad del pipeline |

### 3.5 CAPA IA (Transversal — NO es módulo separado)

La IA está embebida en toda la plataforma:

```
┌─────────────────────────────────────────────────┐
│              DÓNDE ACTÚA LA IA                  │
├──────────────┬──────────────────────────────────┤
│ En VENDER    │ • Lead/account scoring           │
│              │ • Emails de seguimiento           │
│              │ • Secuencias automáticas           │
│              │ • Resumen de reuniones             │
│              │ • Sugerencia de próxima acción     │
│              │ • Health score de cuenta            │
├──────────────┼──────────────────────────────────┤
│ En COTIZAR   │ • Sugerencia de precio óptimo     │
│              │ • Productos complementarios        │
│              │ • Ajuste por segmento/complejidad  │
├──────────────┼──────────────────────────────────┤
│ En CONTROLAR │ • Confianza del forecast          │
│              │ • Alertas de riesgo               │
│              │ • Insights de rentabilidad        │
│              │ • Anomalías en cobros             │
└──────────────┴──────────────────────────────────┘
```

---

## 4. Modelo de Datos (B2B-First)

```
Tenant (organización que usa el sistema)
├── id, name, slug, plan (STARTER|GROWTH|SCALE)
├── branding (logo, colors, companyInfo)
├── settings (timezone, currency, fiscalConfig)
├── seats (número de usuarios contratados)
├── createdAt, updatedAt
│
├── User (usuarios del sistema)
│   ├── id, email, name, avatarUrl
│   ├── role (ADMIN|MANAGER|SELLER|VIEWER)
│   ├── monthlySalary (para rentabilidad por vendedor)
│   ├── salesTarget (meta mensual de ventas)
│   ├── tenantId (FK)
│   └── isActive
│
├── Account (cuentas / empresas prospecto-cliente) ← ANTES: Lead
│   ├── id, name (razón social)
│   ├── industry, segment (STARTUP|SMB|MIDMARKET|ENTERPRISE|GOVERNMENT)
│   ├── size (número de empleados estimado)
│   ├── annualRevenue (revenue estimado de la cuenta)
│   ├── website, phone, address, taxId (RFC/RUT/NIT)
│   ├── status (PROSPECT|ACTIVE_CLIENT|INACTIVE|CHURNED)
│   ├── healthScore (0-100, calculado por IA)
│   ├── tags[], notes
│   ├── assignedToId → User (account owner)
│   └── tenantId (FK)
│
├── Contact (contactos de una cuenta) ← NUEVO: múltiples por empresa
│   ├── id, firstName, lastName, email, phone, jobTitle
│   ├── role (DECISION_MAKER|INFLUENCER|CHAMPION|USER|BLOCKER)
│   ├── isPrimary (contacto principal)
│   ├── accountId (FK)
│   └── tenantId (FK)
│
├── Deal (oportunidades de venta) ← ANTES: Lead con stage
│   ├── id, title, description
│   ├── stage (PROSPECTING|QUALIFICATION|PROPOSAL|NEGOTIATION|CLOSED_WON|CLOSED_LOST)
│   ├── value (monto del deal en $)
│   ├── probability (0-100%, auto-ajustada por etapa)
│   ├── expectedCloseDate
│   ├── actualCloseDate
│   ├── lostReason (si aplica)
│   ├── source (INBOUND|OUTBOUND|REFERRAL|EVENT|PARTNER)
│   ├── aiScore (scoring calculado por IA)
│   ├── aiInsights (JSON — sugerencias de IA)
│   ├── accountId (FK) → una cuenta puede tener N deals
│   ├── contactId (FK) → contacto principal del deal
│   ├── assignedToId → User (vendedor)
│   └── tenantId (FK)
│
├── Activity (timeline de interacciones)
│   ├── id, type (CALL|EMAIL|MEETING|NOTE|TASK|SEQUENCE_STEP)
│   ├── title, description, date
│   ├── outcome (COMPLETED|NO_ANSWER|RESCHEDULED|CANCELLED)
│   ├── nextFollowUp (date)
│   ├── aiGenerated (boolean — ¿fue generada por IA?)
│   ├── dealId (FK, opcional), accountId (FK), contactId (FK, opcional)
│   ├── userId (FK)
│   └── metadata (JSON)
│
├── Sequence (secuencias comerciales automáticas) ← NUEVO
│   ├── id, name, description
│   ├── isActive, triggerStage (en qué etapa se activa)
│   ├── tenantId (FK)
│   └── createdById → User
│
├── SequenceStep (pasos de una secuencia) ← NUEVO
│   ├── id, order, type (EMAIL|WAIT|TASK|CONDITION)
│   ├── delayDays (esperar N días antes de ejecutar)
│   ├── emailTemplate (plantilla con variables)
│   ├── taskDescription
│   ├── sequenceId (FK)
│   └── aiGenerate (boolean — IA genera contenido dinámico)
│
├── SequenceEnrollment (deals inscritos en secuencia) ← NUEVO
│   ├── id, status (ACTIVE|PAUSED|COMPLETED|CANCELLED)
│   ├── currentStep, startedAt, completedAt
│   ├── dealId (FK), sequenceId (FK)
│   └── tenantId (FK)
│
├── Product (catálogo de productos/servicios)
│   ├── id, name, description, sku
│   ├── basePrice, costPrice, unit (HOUR|PROJECT|MONTH|UNIT)
│   ├── category, isActive
│   └── tenantId (FK)
│
├── Quote (cotización)
│   ├── id, number (auto-incremental por tenant), version
│   ├── status (DRAFT|SENT|ACCEPTED|REJECTED|EXPIRED)
│   ├── validUntil, subtotal, taxRate, taxAmount, discount, total
│   ├── notes, terms
│   ├── dealId (FK), accountId (FK), contactId (FK)
│   ├── createdById → User
│   └── tenantId (FK)
│
├── QuoteItem (líneas de cotización)
│   ├── id, description, quantity, unitPrice
│   ├── discount (%), lineTotal
│   ├── complexityFactor (1.0 default)
│   ├── quoteId (FK), productId (FK)
│   └── aiSuggested (boolean)
│
├── PricingConfig (configuración de pricing del tenant)
│   ├── id, personalCosts (JSON), businessCosts (JSON)
│   ├── desiredMargin (%), workingHoursPerMonth
│   ├── minimumRate, recommendedRate
│   └── tenantId (FK)
│
├── PricingRule (reglas por segmento)
│   ├── id, segment, multiplier, complexityFactors (JSON)
│   └── tenantId (FK)
│
├── Transaction (movimientos financieros)
│   ├── id, type (INCOME|EXPENSE)
│   ├── category, description, amount, date
│   ├── status (PENDING|PAID|OVERDUE|CANCELLED)
│   ├── dueDate, paidDate
│   ├── accountId (FK, opcional), dealId (FK, opcional)
│   ├── userId (FK — vendedor asociado)
│   └── tenantId (FK)
│
└── AiLog (registro de uso de IA para billing/debug) ← NUEVO
    ├── id, feature (EMAIL|SCORING|PRICING|INSIGHT|SUMMARY)
    ├── input (JSON), output (JSON)
    ├── tokensUsed, model
    ├── userId (FK)
    └── tenantId (FK)
```

### Cambios clave vs versión anterior:
- **Account** reemplaza Lead como entidad central (B2B)
- **Contact** separado — múltiples contactos por empresa con roles
- **Deal** separado de Account — una cuenta puede tener N oportunidades
- **Sequence** + Steps + Enrollment — automatización de seguimiento
- **AiLog** — tracking de uso de IA para control de costos
- Campos de IA integrados en Deal (aiScore, aiInsights)

---

## 5. Estructura de Carpetas (Actualizada)

```
os-comercial-ia-pymes/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                        # Datos demo realistas B2B
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── (auth)/                    # === RUTAS PÚBLICAS ===
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/               # === RUTAS PROTEGIDAS ===
│   │   │   ├── layout.tsx             # Sidebar + header
│   │   │   ├── page.tsx               # Dashboard ejecutivo
│   │   │   │
│   │   │   ├── cuentas/               # ── VENDER: Cuentas ──
│   │   │   │   ├── page.tsx                   # Lista de cuentas
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx               # Detalle cuenta
│   │   │   │       ├── contactos/page.tsx     # Contactos de la cuenta
│   │   │   │       └── deals/page.tsx         # Deals de la cuenta
│   │   │   │
│   │   │   ├── deals/                 # ── VENDER: Pipeline ──
│   │   │   │   ├── page.tsx                   # Pipeline Kanban
│   │   │   │   └── [id]/page.tsx              # Detalle deal + timeline
│   │   │   │
│   │   │   ├── seguimiento/           # ── VENDER: Seguimiento ──
│   │   │   │   ├── page.tsx                   # Tareas pendientes hoy
│   │   │   │   └── secuencias/page.tsx        # Gestión de secuencias
│   │   │   │
│   │   │   ├── cotizaciones/          # ── COTIZAR ──
│   │   │   │   ├── page.tsx                   # Lista
│   │   │   │   ├── nueva/page.tsx             # Crear/editar
│   │   │   │   └── [id]/page.tsx              # Preview + PDF
│   │   │   │
│   │   │   ├── productos/             # ── COTIZAR: Catálogo ──
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── pricing/               # ── COTIZAR: Pricing ──
│   │   │   │   ├── page.tsx                   # Dashboard + tarifas
│   │   │   │   └── simulador/page.tsx         # Simulador proyectos
│   │   │   │
│   │   │   ├── finanzas/              # ── CONTROLAR ──
│   │   │   │   ├── page.tsx                   # Dashboard financiero
│   │   │   │   ├── transacciones/page.tsx     # CRUD ingresos/gastos
│   │   │   │   ├── cobrar/page.tsx            # Cuentas por cobrar
│   │   │   │   └── rentabilidad/page.tsx      # Por vendedor/cliente
│   │   │   │
│   │   │   ├── forecast/              # ── CONTROLAR: Forecast ──
│   │   │   │   └── page.tsx                   # Forecast completo
│   │   │   │
│   │   │   └── configuracion/         # ── SETTINGS ──
│   │   │       ├── page.tsx                   # General
│   │   │       ├── equipo/page.tsx            # Usuarios + roles
│   │   │       └── plan/page.tsx              # Suscripción
│   │   │
│   │   ├── api/                       # === API ROUTES ===
│   │   │   ├── accounts/route.ts
│   │   │   ├── accounts/[id]/contacts/route.ts
│   │   │   ├── deals/route.ts
│   │   │   ├── activities/route.ts
│   │   │   ├── sequences/route.ts
│   │   │   ├── quotes/route.ts
│   │   │   ├── products/route.ts
│   │   │   ├── transactions/route.ts
│   │   │   ├── pricing/route.ts
│   │   │   ├── forecast/route.ts
│   │   │   ├── ai/
│   │   │   │   ├── generate-email/route.ts
│   │   │   │   ├── score-deal/route.ts
│   │   │   │   ├── suggest-price/route.ts
│   │   │   │   ├── summarize-meeting/route.ts
│   │   │   │   ├── suggest-action/route.ts
│   │   │   │   └── account-insights/route.ts
│   │   │   ├── cron/
│   │   │   │   ├── run-sequences/route.ts     # Ejecutar secuencias
│   │   │   │   └── send-reminders/route.ts    # Enviar recordatorios
│   │   │   └── webhooks/
│   │   │       └── stripe/route.ts
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                        # shadcn/ui base
│   │   │
│   │   ├── accounts/                  # Componentes de Cuentas
│   │   │   ├── account-card.tsx
│   │   │   ├── account-form.tsx
│   │   │   ├── contact-list.tsx
│   │   │   └── account-health.tsx     # Health score visual
│   │   │
│   │   ├── deals/                     # Componentes de Deals
│   │   │   ├── deal-card.tsx
│   │   │   ├── deal-form.tsx
│   │   │   ├── deal-pipeline.tsx      # Kanban
│   │   │   ├── deal-timeline.tsx
│   │   │   └── deal-ai-panel.tsx      # Panel IA: score, sugerencias
│   │   │
│   │   ├── seguimiento/              # Componentes de Seguimiento
│   │   │   ├── activity-form.tsx
│   │   │   ├── sequence-builder.tsx
│   │   │   ├── reminder-list.tsx
│   │   │   └── ai-email-composer.tsx  # Compositor de emails con IA
│   │   │
│   │   ├── cotizaciones/
│   │   │   ├── cotizacion-form.tsx
│   │   │   ├── cotizacion-preview.tsx
│   │   │   ├── cotizacion-pdf.tsx
│   │   │   └── item-selector.tsx
│   │   │
│   │   ├── pricing/
│   │   │   ├── cost-form.tsx
│   │   │   ├── rate-calculator.tsx
│   │   │   ├── project-simulator.tsx
│   │   │   └── ai-price-suggestion.tsx
│   │   │
│   │   ├── finanzas/
│   │   │   ├── transaction-form.tsx
│   │   │   ├── finance-dashboard.tsx
│   │   │   ├── cobrar-table.tsx
│   │   │   └── rentabilidad-charts.tsx
│   │   │
│   │   ├── forecast/
│   │   │   ├── pipeline-forecast.tsx
│   │   │   ├── revenue-forecast.tsx
│   │   │   ├── funnel-chart.tsx
│   │   │   └── kpi-card.tsx
│   │   │
│   │   ├── ai/                        # Componentes IA compartidos
│   │   │   ├── ai-assistant-panel.tsx  # Panel lateral IA
│   │   │   ├── ai-suggestion.tsx      # Card de sugerencia
│   │   │   └── ai-loading.tsx         # Estado de carga IA
│   │   │
│   │   └── shared/
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       ├── data-table.tsx
│   │       ├── empty-state.tsx
│   │       └── stat-card.tsx
│   │
│   ├── lib/
│   │   ├── db.ts                      # Prisma client singleton
│   │   ├── auth.ts                    # Auth helpers + middleware
│   │   ├── utils.ts                   # Utilidades generales
│   │   ├── ai/                        # ── Motor IA ──
│   │   │   ├── client.ts             # Claude API client
│   │   │   ├── prompts.ts            # Prompts por feature
│   │   │   ├── email-generator.ts    # Generación de emails
│   │   │   ├── deal-scorer.ts        # Scoring de deals
│   │   │   ├── meeting-summarizer.ts # Resumen de reuniones
│   │   │   ├── price-advisor.ts      # Sugerencias de precio
│   │   │   └── action-suggester.ts   # Próxima acción
│   │   ├── sequences/                 # ── Motor de Secuencias ──
│   │   │   ├── engine.ts             # Ejecutor de secuencias
│   │   │   └── templates.ts          # Plantillas predefinidas
│   │   ├── pricing-engine.ts          # Motor de cálculo de precios
│   │   ├── finance-engine.ts          # Cálculos financieros
│   │   ├── forecast-engine.ts         # Motor de forecast
│   │   ├── email.ts                   # Resend client
│   │   ├── pdf.ts                     # Generador de PDFs
│   │   └── validations/              # Zod schemas
│   │       ├── account.ts
│   │       ├── contact.ts
│   │       ├── deal.ts
│   │       ├── quote.ts
│   │       ├── product.ts
│   │       ├── transaction.ts
│   │       └── pricing.ts
│   │
│   ├── hooks/
│   │   ├── use-accounts.ts
│   │   ├── use-deals.ts
│   │   ├── use-forecast.ts
│   │   ├── use-ai.ts                  # Hook genérico para llamadas IA
│   │   └── use-pricing.ts
│   │
│   └── types/
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
├── ARCHITECTURE.md
└── README.md
```

---

## 6. Lógica Multi-Tenant

### Aislamiento de datos
```
Estrategia: Schema compartido + tenantId + RLS

Cada tabla tiene tenantId (FK).
Prisma middleware inyecta automáticamente:
  - WHERE tenantId = X en cada query
  - tenantId = X en cada INSERT

PostgreSQL RLS como segunda capa de seguridad.
```

### Límites por plan
```typescript
// Los planes limitan por ESCALA, no por features
const PLAN_LIMITS = {
  STARTER: {
    seats: 3,          // usuarios
    accounts: 100,     // cuentas
    deals: 200,        // deals activos
    aiCalls: 100,      // llamadas IA / mes
    sequences: 3,      // secuencias activas
    storage: '1GB',
  },
  GROWTH: {
    seats: 10,
    accounts: 500,
    deals: 1000,
    aiCalls: 500,
    sequences: 10,
    storage: '5GB',
  },
  SCALE: {
    seats: 'unlimited',
    accounts: 'unlimited',
    deals: 'unlimited',
    aiCalls: 2000,
    sequences: 'unlimited',
    storage: '20GB',
  }
}
```

### Flujo de autenticación
```
1. Registro → Wizard de onboarding → Crea Tenant + User (ADMIN)
2. Admin invita equipo → Users con mismo tenantId
3. Login → JWT { userId, tenantId, role, plan }
4. Middleware → tenantId en cada request + verificar límites
5. Prisma middleware → inyecta tenantId automáticamente
```

---

## 7. Pricing Strategy (Revisado para B2B LATAM)

### Problema con el modelo anterior
- **Free tier atrae clientes poco serios** → soporte sin revenue
- **Modularización fragmenta** → clientes compran solo 1 pedazo, ticket bajo
- **LATAM B2B necesita ticket razonable** → entre $50-200 USD es el sweet spot

### Nuevo modelo: Todo incluido, escala por uso

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRICING OS COMERCIAL IA                     │
├─────────────┬──────────────────┬──────────────────┬────────────┤
│             │    STARTER       │     GROWTH       │   SCALE    │
│             │   $49 USD/mes    │   $99 USD/mes    │ $199 USD/m │
├─────────────┼──────────────────┼──────────────────┼────────────┤
│ Usuarios    │ Hasta 3          │ Hasta 10         │ Ilimitados │
│ Cuentas     │ Hasta 100        │ Hasta 500        │ Ilimitadas │
│ Deals       │ Hasta 200        │ Hasta 1,000      │ Ilimitados │
├─────────────┼──────────────────┼──────────────────┼────────────┤
│ CRM B2B     │ ✅ Completo      │ ✅ Completo      │ ✅ Completo│
│ Pipeline    │ ✅ Completo      │ ✅ Completo      │ ✅ Completo│
│ Seguimiento │ ✅ Completo      │ ✅ Completo      │ ✅ Completo│
│ Secuencias  │ 3 activas        │ 10 activas       │ Ilimitadas │
│ Cotizaciones│ ✅ Completo      │ ✅ Completo      │ ✅ Completo│
│ Pricing Int.│ ✅ Completo      │ ✅ Completo      │ ✅ Completo│
│ Finanzas    │ ✅ Completo      │ ✅ Completo      │ ✅ Completo│
│ Forecast    │ Básico           │ ✅ Completo      │ ✅ Avanzado│
├─────────────┼──────────────────┼──────────────────┼────────────┤
│ IA Emails   │ 50/mes           │ 300/mes          │ 1,500/mes  │
│ IA Scoring  │ ✅               │ ✅               │ ✅         │
│ IA Insights │ ❌               │ ✅               │ ✅         │
│ IA Pricing  │ ❌               │ ✅               │ ✅         │
├─────────────┼──────────────────┼──────────────────┼────────────┤
│ Soporte     │ Email            │ Email + Chat     │ Prioritario│
│ Onboarding  │ Self-service     │ Guiado           │ Dedicado   │
└─────────────┴──────────────────┴──────────────────┴────────────┘

                        Trial: 14 días gratis (plan Growth)
                        Pago anual: 20% descuento
```

### Por qué este modelo funciona para LATAM B2B

| Decisión | Razón |
|----------|-------|
| **Sin plan Free** | Elimina tire-kickers. 14 días de trial es suficiente para probar |
| **Todo incluido** | No fragmenta. El cliente percibe valor completo desde día 1 |
| **Escala por uso** | Natural: pagas más cuando creces. No penaliza al pequeño |
| **$49 entrada** | Accesible para PYMEs LATAM. Comparable a HubSpot Starter |
| **$199 techo** | Competitivo vs soluciones enterprise ($500+). Alto margen |
| **IA limitada por plan** | Controla costos de API. El que más usa IA, más paga |
| **Trial en Growth** | El cliente prueba el producto "bueno", no el limitado |

### Productos standalone (para marketing)

Los módulos Financiero y Pricing pueden usarse como **landing pages de entrada**:

```
Landing "Control Financiero Comercial" → lead magnet
  → Trial del OS Comercial completo
  → Conversión a Starter/Growth

Landing "Calculadora de Precios" → herramienta gratuita limitada
  → Captura email
  → Trial del OS Comercial completo
```

No se venden por separado — son **puertas de entrada** al producto completo.

---

## 8. Roadmap (Reestructurado — IA desde día 1)

### FASE 1 — Fundación + Motor Comercial B2B (Semana 1-2)
> Objetivo: Sistema B2B funcional con IA integrada

**Infraestructura:**
- [ ] Setup Next.js 14 + TypeScript + Prisma + Supabase
- [ ] Tailwind + shadcn/ui + theme base
- [ ] Auth: registro, login, onboarding wizard
- [ ] Multi-tenancy: modelo, middleware, RLS
- [ ] Layout: sidebar (Vender/Cotizar/Controlar), header, responsive
- [ ] Integración base Claude API (lib/ai/client.ts)

**Motor Comercial (Vender):**
- [ ] CRUD Cuentas (Account) + perfil empresa
- [ ] CRUD Contactos por cuenta (con roles)
- [ ] CRUD Deals (oportunidades)
- [ ] Pipeline Kanban con drag & drop
- [ ] Timeline de actividades por deal
- [ ] **IA: Generación de email de seguimiento** ← IA desde día 1
- [ ] **IA: Sugerencia de próxima acción** ← IA desde día 1

**Entregable:** Un vendedor puede gestionar cuentas B2B, mover deals en pipeline, y recibir sugerencias de IA.

### FASE 2 — Seguimiento Inteligente + Cotizaciones (Semana 2-3)
> Objetivo: Automatización de seguimiento + propuestas profesionales

**Seguimiento:**
- [ ] Recordatorios inteligentes (próximo follow-up)
- [ ] Secuencias comerciales (crear, activar, pausar)
- [ ] Motor de ejecución de secuencias (cron)
- [ ] **IA: Emails dinámicos en secuencias**
- [ ] **IA: Resumen de notas de reunión → action items**

**Cotizaciones:**
- [ ] Catálogo de productos/servicios
- [ ] Constructor de cotizaciones con items + descuentos
- [ ] Preview con branding + export PDF
- [ ] Versionado de cotizaciones
- [ ] Vinculación deal → cotización

**Entregable:** Seguimiento automático funcionando + cotizaciones profesionales.

### FASE 3 — Pricing Inteligente + Control Financiero (Semana 3-4)
> Objetivo: Módulos de valor alto (lo que justifica el pricing)

**Pricing:**
- [ ] Configuración de costos (personal + negocio)
- [ ] Cálculo tarifa mínima + recomendada
- [ ] Simulador de proyectos
- [ ] Reglas por segmento + complejidad
- [ ] **IA: Sugerencia de precio óptimo**
- [ ] Integración pricing ↔ cotizaciones

**Finanzas:**
- [ ] CRUD transacciones (ingresos/gastos)
- [ ] Dashboard: ingresos vs gastos, utilidad, margen
- [ ] Cuentas por cobrar + alertas
- [ ] Métricas por cliente y por vendedor
- [ ] **IA: Alertas de anomalías en cobros**

**Entregable:** Sistema de pricing + control financiero integrados.

### FASE 4 — Forecast + Scoring + Dashboard Ejecutivo (Semana 4-5)
> Objetivo: Inteligencia comercial completa

**Forecast:**
- [ ] Pipeline forecast (etapa × probabilidad × monto)
- [ ] Forecast por vendedor
- [ ] Forecast mensual/trimestral con histórico
- [ ] Embudo visual con tasas de conversión

**IA avanzada:**
- [ ] **IA: Deal scoring automático**
- [ ] **IA: Health score de cuentas**
- [ ] **IA: Confianza del forecast**
- [ ] **IA: Insights de rentabilidad**
- [ ] Dashboard con panel IA (insights del negocio)

**Entregable:** Dashboard ejecutivo con forecast serio e insights IA.

### FASE 5 — Polish + Demo Comercial (Semana 5-6)
> Objetivo: Producto demo-ready, listo para primeros clientes

- [ ] Seed con datos de demo B2B realistas
- [ ] Onboarding wizard pulido
- [ ] Landing page con propuesta de valor
- [ ] Flujo de trial → upgrade
- [ ] Responsive mobile
- [ ] Performance optimization
- [ ] Error handling + edge cases

**Entregable:** Producto listo para demostrar a clientes potenciales.

---

## 9. Decisiones Técnicas

| Decisión | Elección | Razón |
|----------|----------|-------|
| Arquitectura | **Monolito modular** | MVP rápido, un deploy |
| API style | **REST + Server Actions** | Simple, suficiente |
| ORM | **Prisma** | Type-safe, migraciones, maduro |
| Auth | **Supabase Auth** | Todo-en-uno con DB |
| DB | **PostgreSQL (Supabase)** | RLS nativo, relacional |
| IA | **Claude API** | Superior en español, contexto largo |
| Jobs/Cron | **Vercel Cron + Inngest** | Secuencias, recordatorios |
| PDF | **@react-pdf/renderer** | Serverless-compatible |
| Charts | **Recharts** | React nativo, declarativo |
| Multi-tenant | **tenantId + RLS** | Simple, escala bien |
| Payments | **Stripe** | Standard, funciona en LATAM |

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

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="OS Comercial IA"

# Inngest (sequences/cron)
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

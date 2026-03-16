# OS Comercial con IA para PYMEs — Arquitectura v4 (Final)

## 1. Posicionamiento del Producto

### Nombre comercial
**OS Comercial IA** — Motor Comercial B2B con Inteligencia Artificial

### Qué NO somos
- No somos "otro CRM" — no gestionamos contactos, **ejecutamos ventas**
- No somos software de gestión genérico — somos **específicos para equipos comerciales B2B**
- No somos una herramienta de registro — somos un **motor de ejecución con IA**

### Qué SÍ somos
**El motor de ejecución comercial para equipos de ventas B2B en LATAM.**

La diferencia entre un CRM y un motor comercial:
```
CRM tradicional:        Registro → Datos → Reportes → "¿Y ahora qué?"
Motor Comercial IA:     Ejecución → Acción → Resultado → IA dice qué sigue
```

El sistema prioriza **acción sobre registro**:

```
PROSPECTAR → EJECUTAR SEGUIMIENTO → PROPONER → CERRAR → CONTROLAR
     ↑              ↑                   ↑          ↑          ↑
    IA            IA                  IA         IA         IA
 (scoring)  (emails, tareas,     (pricing)  (forecast)  (análisis)
            agenda, llamadas)
```

### Experiencia central del usuario
Al abrir el sistema, el vendedor NO ve una lista de contactos.
Ve su **Agenda Comercial del día**:

```
┌─────────────────────────────────────────────────┐
│  Buenos días, Carlos.         Lunes 17 de marzo │
│                                                  │
│  HOY TIENES:                                     │
│  ├── 3 follow-ups pendientes                     │
│  ├── 1 reunión (Acme Corp, 11:00)               │
│  ├── 2 cotizaciones por enviar                   │
│  └── 1 deal que necesita atención               │
│                                                  │
│  💡 IA sugiere: "Contactar a María de TechCo,    │
│     llevan 7 días sin actividad y el deal es     │
│     de alto valor"                               │
└─────────────────────────────────────────────────┘
```

### Diferenciadores clave
1. **Ejecución, no registro** — El sistema empuja al vendedor a actuar, no solo a anotar
2. **B2B nativo** — Cuentas con múltiples contactos, ciclos largos, deals complejos
3. **IA integrada** — No es un botón, es parte del flujo en cada pantalla
4. **LATAM-ready** — Español nativo, monedas locales, contexto regional
5. **Agenda-first** — El vendedor abre el sistema y sabe exactamente qué hacer hoy

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
│  ┌───────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │    VENDER     │ │   COTIZAR    │ │   CONTROLAR     │  │
│  │               │ │              │ │                 │  │
│  │ Agenda Comerc.│ │ Catálogo     │ │ Dashboard Fin.  │  │
│  │ Cuentas       │ │ Cotizaciones │ │ Rentabilidad    │  │
│  │ Contactos     │ │ PDF Export   │ │ Forecast        │  │
│  │ Pipeline/Deals│ │ Pricing Int. │ │ Cuentas x Cobrar│  │
│  │ Tareas        │ │ Simulador    │ │ Por vendedor    │  │
│  │ Llamadas      │ │              │ │                 │  │
│  │ Notas/Reunión │ │              │ │                 │  │
│  │ Secuencias    │ │              │ │                 │  │
│  └───────────────┘ └──────────────┘ └─────────────────┘  │
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

### 3.2 MÓDULO: VENDER (Motor de Ejecución Comercial B2B)

Este es el corazón del sistema. **No es un CRM — es un motor de ejecución de ventas.**

#### Agenda Comercial (pantalla principal del vendedor)
| Feature | Descripción |
|---------|-------------|
| Vista diaria | "Hoy tienes: 3 follow-ups, 1 reunión, 2 cotizaciones pendientes" |
| Tareas pendientes | Lista priorizada de acciones del día |
| Recordatorios | Alertas de follow-ups vencidos o próximos |
| Sugerencias IA | "Contactar a X, llevan Y días sin actividad" |
| Vista semanal | Calendario con reuniones, llamadas programadas, deadlines |

#### Cuentas (Account-Based)
| Feature | Descripción |
|---------|-------------|
| Cuentas (empresas) | Entidad principal. Una empresa = una cuenta |
| Múltiples contactos | Cada cuenta tiene N contactos con roles (decisor, influenciador, champion, blocker) |
| Perfil de cuenta | Industria, tamaño, segmento, revenue estimado |
| Health score | Indicador de salud de la relación (calculado por IA) |
| Timeline completo | Todo lo que pasó con esta cuenta: llamadas, emails, reuniones, notas, deals |

#### Pipeline de Oportunidades (Deals)
| Feature | Descripción |
|---------|-------------|
| Oportunidades (Deals) | Cada deal tiene monto, probabilidad, fecha estimada de cierre |
| Pipeline Kanban | Prospección → Calificación → Propuesta → Negociación → Cierre (Ganado/Perdido) |
| Múltiples deals por cuenta | Una cuenta puede tener varios deals en paralelo |
| Razón de pérdida | Tracking de por qué se pierden deals |
| Weighted pipeline | Valor ponderado = monto × probabilidad |
| Timeline por deal | Historial específico de actividades del deal |

#### Ejecución Comercial (tareas, llamadas, notas, reuniones)
| Feature | Descripción |
|---------|-------------|
| Tareas | Crear tareas vinculadas a deal/cuenta, con fecha límite y prioridad |
| Registro de llamadas | Registrar llamada: duración, resultado (contestó/no contestó/buzón), notas |
| Notas de reunión | Texto libre + IA extrae action items y próximos pasos |
| Registro de emails | Log de emails enviados (manuales o automáticos) |
| Timeline unificado | Vista cronológica de TODA la actividad (cuenta o deal) |
| Filtros de actividad | Filtrar por tipo: solo llamadas, solo emails, solo reuniones |

#### Seguimiento Inteligente (IA)
| Feature | Descripción |
|---------|-------------|
| Recordatorios inteligentes | IA sugiere cuándo y cómo hacer follow-up |
| Secuencias comerciales | Cadenas automáticas: email día 1 → reminder día 3 → llamada día 7 |
| Emails IA | Generación de emails personalizados según contexto del deal |
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
├── Activity (timeline unificado de interacciones)
│   ├── id, type (CALL|EMAIL|MEETING|NOTE|TASK|SEQUENCE_STEP)
│   ├── title, description
│   ├── date (cuándo ocurrió/ocurrirá)
│   ├── dueDate (fecha límite, para tareas)
│   ├── priority (LOW|MEDIUM|HIGH|URGENT, para tareas)
│   ├── status (PENDING|COMPLETED|CANCELLED|OVERDUE)
│   ├── outcome (CONNECTED|NO_ANSWER|VOICEMAIL|RESCHEDULED, para llamadas)
│   ├── duration (minutos, para llamadas/reuniones)
│   ├── nextFollowUp (date, sugerido por IA o manual)
│   ├── aiGenerated (boolean — ¿fue creada por IA?)
│   ├── aiSummary (texto — resumen IA de notas de reunión)
│   ├── dealId (FK, opcional), accountId (FK), contactId (FK, opcional)
│   ├── userId (FK — quién ejecutó/creó)
│   ├── assignedToId (FK — a quién se le asigna, para tareas)
│   └── metadata (JSON — datos extra flexibles)
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
│   │   │   ├── page.tsx               # AGENDA COMERCIAL (home del vendedor)
│   │   │   │
│   │   │   ├── cuentas/               # ── VENDER: Cuentas ──
│   │   │   │   ├── page.tsx                   # Lista de cuentas
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx               # Detalle + timeline completo
│   │   │   │       ├── contactos/page.tsx     # Contactos de la cuenta
│   │   │   │       └── deals/page.tsx         # Deals de la cuenta
│   │   │   │
│   │   │   ├── deals/                 # ── VENDER: Pipeline ──
│   │   │   │   ├── page.tsx                   # Pipeline Kanban
│   │   │   │   └── [id]/page.tsx              # Detalle deal + timeline
│   │   │   │
│   │   │   ├── actividades/           # ── VENDER: Ejecución ──
│   │   │   │   ├── page.tsx                   # Tareas + llamadas del día
│   │   │   │   ├── agenda/page.tsx            # Vista semanal/calendario
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
│   │   ├── actividades/              # Componentes de Ejecución Comercial
│   │   │   ├── agenda-diaria.tsx      # Vista "tu día" con todo pendiente
│   │   │   ├── agenda-semanal.tsx     # Vista calendario semanal
│   │   │   ├── task-form.tsx          # Crear/editar tarea
│   │   │   ├── call-log-form.tsx      # Registrar llamada
│   │   │   ├── meeting-notes.tsx      # Notas de reunión + resumen IA
│   │   │   ├── timeline.tsx           # Timeline unificado (reutilizable)
│   │   │   ├── activity-filters.tsx   # Filtrar por tipo de actividad
│   │   │   ├── sequence-builder.tsx   # Constructor de secuencias
│   │   │   ├── reminder-list.tsx      # Lista de recordatorios
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

## 7. Pricing Strategy (Hipótesis — validar con piloto)

> **NOTA**: Estos precios son hipótesis iniciales. Se validarán con los primeros
> 10-15 pilotos antes de fijar estructura definitiva. Lo importante es que la
> arquitectura técnica soporte cualquier modelo (por usuario, por features, mixto).

### Principios de pricing (estos SÍ están validados)
1. **Sin plan Free** → atrae tire-kickers en B2B, genera soporte sin revenue
2. **Todo incluido** → no fragmentar features, el cliente percibe valor completo
3. **Escalar por uso/equipo** → natural, no penaliza al pequeño
4. **Trial generoso** → 14 días con producto completo para que prueben en serio
5. **IA como parte del producto** → no como add-on, pero con límites por escala

### Hipótesis de pricing (a validar)

```
┌─────────────────────────────────────────────────────────────────┐
│              PRICING OS COMERCIAL IA (HIPÓTESIS v1)             │
├─────────────┬──────────────────┬──────────────────┬────────────┤
│             │    STARTER       │     GROWTH       │   SCALE    │
│             │  ~$49 USD/mes    │  ~$99 USD/mes    │ ~$199 USD/m│
│             │  (a validar)     │  (a validar)     │ (a validar)│
├─────────────┼──────────────────┼──────────────────┼────────────┤
│ Usuarios    │ Hasta 3          │ Hasta 10         │ Ilimitados │
│ Cuentas     │ Hasta 100        │ Hasta 500        │ Ilimitadas │
│ Deals       │ Hasta 200        │ Hasta 1,000      │ Ilimitados │
├─────────────┼──────────────────┼──────────────────┼────────────┤
│ Motor Com.  │ ✅ Completo      │ ✅ Completo      │ ✅ Completo│
│ Cotizac.    │ ✅ Completo      │ ✅ Completo      │ ✅ Completo│
│ Finanzas    │ ✅ Completo      │ ✅ Completo      │ ✅ Completo│
│ Pricing Int.│ ✅ Completo      │ ✅ Completo      │ ✅ Completo│
│ Forecast    │ Básico           │ ✅ Completo      │ ✅ Avanzado│
│ Secuencias  │ 3 activas        │ 10 activas       │ Ilimitadas │
│ IA          │ Básica (50/mes)  │ Completa (500/m) │ Full (2k/m)│
├─────────────┼──────────────────┼──────────────────┼────────────┤
│ Soporte     │ Email            │ Email + Chat     │ Prioritario│
└─────────────┴──────────────────┴──────────────────┴────────────┘

           Trial: 14 días gratis (plan Growth, sin tarjeta)
           Pago anual: ~20% descuento (a definir)
```

### Qué validar en el piloto

| Pregunta | Cómo validar |
|----------|-------------|
| ¿$49 es accesible para PYMEs LATAM? | Entrevistas en piloto, tasa de conversión trial→paid |
| ¿El salto $49→$99 es natural? | Tracking de cuándo piden más seats/cuentas |
| ¿IA limitada genera upsell o frustración? | Feedback cualitativo + uso real de IA |
| ¿Todo incluido es mejor que modular? | A/B test con early adopters |
| ¿Pricing anual funciona en LATAM? | Preguntar preferencia de pago |
| ¿Hay mercado para >$199? | Explorar enterprise con custom pricing |

### Implementación técnica del pricing
```typescript
// La DB soporta cualquier modelo — el plan se define en Tenant
// Los límites se configuran en PLAN_LIMITS (fácil de cambiar)
// El middleware verifica límites antes de cada operación
// Esto permite pivotar pricing sin cambiar código
```

### Estrategia de captación (lead magnets)

Los módulos Financiero y Pricing funcionan como **puertas de entrada**:

```
Landing "Control Financiero Comercial" → lead magnet → Trial completo
Landing "Calculadora de Precios"       → herramienta gratis limitada → Trial
```

No se venden por separado — son canales de adquisición para el producto completo.

---

## 8. Roadmap (Reestructurado — IA desde día 1)

### FASE 1 — Fundación + Motor de Ejecución Comercial (Semana 1-2)
> Objetivo: Motor comercial B2B funcional con agenda, actividades e IA integrada

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

**Ejecución Comercial (clave para adopción):**
- [ ] Agenda Comercial como pantalla principal ("tu día")
- [ ] Sistema de tareas (crear, asignar, completar, con prioridad y fecha)
- [ ] Registro de llamadas (duración, resultado, notas)
- [ ] Notas de reunión (texto libre)
- [ ] Timeline unificado por cuenta y por deal
- [ ] Recordatorios de follow-up (pendientes del día)
- [ ] Filtros de actividad (por tipo, por fecha)

**IA (desde día 1):**
- [ ] **IA: Generación de email de seguimiento**
- [ ] **IA: Sugerencia de próxima acción** ("contactar a X, llevan Y días sin actividad")
- [ ] **IA: Resumen de notas de reunión** → action items automáticos

**Entregable:** Un vendedor abre el sistema, ve su agenda del día, gestiona cuentas B2B, registra llamadas/notas, mueve deals en pipeline, y recibe sugerencias de IA.

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

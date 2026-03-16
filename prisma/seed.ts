import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Demo Corp",
      slug: "demo-corp",
      plan: "GROWTH",
    },
  });

  // Create demo user
  const user = await prisma.user.create({
    data: {
      email: "demo@demo.com",
      name: "Carlos García",
      role: "ADMIN",
      salesTarget: 100000,
      tenantId: tenant.id,
    },
  });

  const seller = await prisma.user.create({
    data: {
      email: "vendedor@demo.com",
      name: "Ana Martínez",
      role: "SELLER",
      salesTarget: 75000,
      tenantId: tenant.id,
    },
  });

  // Create accounts
  const acme = await prisma.account.create({
    data: {
      name: "Acme Technologies",
      industry: "Tecnología",
      segment: "MIDMARKET",
      website: "https://acme.com",
      phone: "+52 55 1234 5678",
      status: "PROSPECT",
      assignedToId: user.id,
      tenantId: tenant.id,
    },
  });

  const globalCorp = await prisma.account.create({
    data: {
      name: "Global Corp S.A.",
      industry: "Manufactura",
      segment: "ENTERPRISE",
      status: "ACTIVE_CLIENT",
      assignedToId: user.id,
      tenantId: tenant.id,
    },
  });

  const startupX = await prisma.account.create({
    data: {
      name: "StartupX",
      industry: "Fintech",
      segment: "STARTUP",
      status: "PROSPECT",
      assignedToId: seller.id,
      tenantId: tenant.id,
    },
  });

  const techSolutions = await prisma.account.create({
    data: {
      name: "Tech Solutions MX",
      industry: "Consultoría",
      segment: "SMB",
      status: "PROSPECT",
      assignedToId: seller.id,
      tenantId: tenant.id,
    },
  });

  // Create contacts
  await prisma.contact.createMany({
    data: [
      {
        firstName: "María",
        lastName: "López",
        email: "maria@acme.com",
        jobTitle: "CTO",
        role: "DECISION_MAKER",
        isPrimary: true,
        accountId: acme.id,
        tenantId: tenant.id,
      },
      {
        firstName: "Roberto",
        lastName: "Sánchez",
        email: "roberto@acme.com",
        jobTitle: "VP Engineering",
        role: "INFLUENCER",
        accountId: acme.id,
        tenantId: tenant.id,
      },
      {
        firstName: "Pedro",
        lastName: "Hernández",
        email: "pedro@globalcorp.com",
        jobTitle: "Director Comercial",
        role: "CHAMPION",
        isPrimary: true,
        accountId: globalCorp.id,
        tenantId: tenant.id,
      },
      {
        firstName: "Laura",
        lastName: "Ramírez",
        email: "laura@startupx.io",
        jobTitle: "CEO",
        role: "DECISION_MAKER",
        isPrimary: true,
        accountId: startupX.id,
        tenantId: tenant.id,
      },
      {
        firstName: "Diego",
        lastName: "Torres",
        email: "diego@techsolutions.mx",
        jobTitle: "Gerente de Operaciones",
        role: "INFLUENCER",
        isPrimary: true,
        accountId: techSolutions.id,
        tenantId: tenant.id,
      },
    ],
  });

  // Create deals
  const deal1 = await prisma.deal.create({
    data: {
      title: "Implementación CRM Enterprise",
      stage: "PROPOSAL",
      value: 85000,
      probability: 50,
      source: "INBOUND",
      expectedCloseDate: new Date("2026-04-30"),
      accountId: acme.id,
      assignedToId: user.id,
      tenantId: tenant.id,
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      title: "Licencia anual SaaS",
      stage: "NEGOTIATION",
      value: 120000,
      probability: 75,
      source: "REFERRAL",
      expectedCloseDate: new Date("2026-04-15"),
      accountId: globalCorp.id,
      assignedToId: user.id,
      tenantId: tenant.id,
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      title: "MVP Plataforma de pagos",
      stage: "QUALIFICATION",
      value: 35000,
      probability: 25,
      source: "OUTBOUND",
      accountId: startupX.id,
      assignedToId: seller.id,
      tenantId: tenant.id,
    },
  });

  const deal4 = await prisma.deal.create({
    data: {
      title: "Consultoría de automatización",
      stage: "PROSPECTING",
      value: 22000,
      probability: 10,
      source: "EVENT",
      accountId: techSolutions.id,
      assignedToId: seller.id,
      tenantId: tenant.id,
    },
  });

  // Create activities
  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000);
  const daysFromNow = (days: number) =>
    new Date(now.getTime() + days * 86400000);

  await prisma.activity.createMany({
    data: [
      {
        type: "MEETING",
        title: "Demo del producto con equipo técnico",
        description:
          "Presentamos la plataforma al equipo de María. Les interesó mucho la parte de automatizaciones. Pidieron una propuesta formal.",
        date: daysAgo(3),
        status: "COMPLETED",
        duration: 45,
        dealId: deal1.id,
        accountId: acme.id,
        userId: user.id,
        tenantId: tenant.id,
      },
      {
        type: "EMAIL",
        title: "Envío de propuesta comercial",
        description: "Enviada propuesta con 3 opciones de licenciamiento.",
        date: daysAgo(2),
        status: "COMPLETED",
        dealId: deal1.id,
        accountId: acme.id,
        userId: user.id,
        tenantId: tenant.id,
      },
      {
        type: "TASK",
        title: "Llamar a María para follow-up de propuesta",
        priority: "HIGH",
        dueDate: daysFromNow(0), // today
        status: "PENDING",
        dealId: deal1.id,
        accountId: acme.id,
        userId: user.id,
        assignedToId: user.id,
        tenantId: tenant.id,
      },
      {
        type: "CALL",
        title: "Negociación de términos con Pedro",
        description:
          "Pedro quiere descuento por volumen. Pide 15% en licencia anual.",
        date: daysAgo(1),
        status: "COMPLETED",
        outcome: "CONNECTED",
        duration: 30,
        dealId: deal2.id,
        accountId: globalCorp.id,
        userId: user.id,
        tenantId: tenant.id,
      },
      {
        type: "TASK",
        title: "Preparar contra-oferta para Global Corp",
        priority: "URGENT",
        dueDate: daysFromNow(1),
        status: "PENDING",
        dealId: deal2.id,
        accountId: globalCorp.id,
        userId: user.id,
        assignedToId: user.id,
        tenantId: tenant.id,
      },
      {
        type: "CALL",
        title: "Llamada de calificación con Laura",
        description: "Startup interesada en MVP. Presupuesto limitado pero con funding serie A.",
        date: daysAgo(5),
        status: "COMPLETED",
        outcome: "CONNECTED",
        duration: 20,
        dealId: deal3.id,
        accountId: startupX.id,
        userId: seller.id,
        tenantId: tenant.id,
      },
      {
        type: "TASK",
        title: "Enviar caso de éxito a StartupX",
        priority: "MEDIUM",
        dueDate: daysFromNow(2),
        status: "PENDING",
        dealId: deal3.id,
        accountId: startupX.id,
        userId: seller.id,
        assignedToId: seller.id,
        tenantId: tenant.id,
      },
      {
        type: "NOTE",
        title: "Contacto inicial en evento TechSummit",
        description:
          "Conocimos a Diego en el stand. Interesado en automatizar procesos de compras. Pedir reunión la próxima semana.",
        date: daysAgo(7),
        status: "COMPLETED",
        dealId: deal4.id,
        accountId: techSolutions.id,
        userId: seller.id,
        tenantId: tenant.id,
      },
      {
        type: "MEETING",
        title: "Reunión de revisión con Global Corp",
        date: daysFromNow(0), // today
        status: "PENDING",
        dealId: deal2.id,
        accountId: globalCorp.id,
        userId: user.id,
        tenantId: tenant.id,
      },
    ],
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: "Licencia SaaS Anual",
        description: "Licencia anual de la plataforma",
        basePrice: 12000,
        costPrice: 2000,
        unit: "MONTH",
        category: "Licencias",
        tenantId: tenant.id,
      },
      {
        name: "Consultoría de Implementación",
        description: "Horas de consultoría para implementación",
        basePrice: 150,
        costPrice: 50,
        unit: "HOUR",
        category: "Servicios",
        tenantId: tenant.id,
      },
      {
        name: "Capacitación Equipo",
        description: "Capacitación para equipo de usuarios",
        basePrice: 5000,
        costPrice: 1500,
        unit: "PROJECT",
        category: "Servicios",
        tenantId: tenant.id,
      },
    ],
  });

  console.log("Seed complete!");
  console.log("Login with: demo@demo.com (any password)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

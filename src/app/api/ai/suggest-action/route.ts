import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { suggestNextAction } from "@/lib/ai/action-suggester";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { dealId } = await request.json();
  if (!dealId) {
    return NextResponse.json({ error: "dealId requerido" }, { status: 400 });
  }

  const deal = await prisma.deal.findFirst({
    where: { id: dealId, tenantId: session.tenantId },
    include: {
      account: true,
      contact: true,
      activities: {
        orderBy: { date: "desc" },
        take: 5,
        select: { title: true, type: true, date: true },
      },
    },
  });

  if (!deal) {
    return NextResponse.json({ error: "Deal no encontrado" }, { status: 404 });
  }

  const lastActivity = deal.activities[0];
  const daysSinceLastContact = lastActivity
    ? Math.round(
        (Date.now() - new Date(lastActivity.date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 999;

  const suggestion = await suggestNextAction({
    accountName: deal.account.name,
    contactName: deal.contact
      ? `${deal.contact.firstName} ${deal.contact.lastName}`
      : "No definido",
    dealTitle: deal.title,
    dealStage: deal.stage,
    dealValue: deal.value,
    daysSinceLastContact,
    recentActivities: deal.activities.map(
      (a) => `${a.type}: ${a.title} (${new Date(a.date).toLocaleDateString("es-MX")})`
    ),
    tenantId: session.tenantId,
    userId: session.id,
  });

  return NextResponse.json(suggestion);
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateFollowUpEmail } from "@/lib/ai/email-generator";

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
        take: 1,
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
    : 0;

  const email = await generateFollowUpEmail({
    accountName: deal.account.name,
    contactName: deal.contact
      ? `${deal.contact.firstName} ${deal.contact.lastName}`
      : "estimado/a",
    dealTitle: deal.title,
    dealStage: deal.stage,
    dealValue: deal.value,
    lastActivity: lastActivity?.title,
    daysSinceLastContact,
    tenantId: session.tenantId,
    userId: session.id,
  });

  return NextResponse.json({ email });
}

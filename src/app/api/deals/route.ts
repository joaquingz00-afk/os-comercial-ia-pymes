import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createDealSchema, updateDealStageSchema } from "@/lib/validations/deal";
import { STAGE_PROBABILITIES } from "@/types";
import type { DealStage } from "@/types";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const stage = searchParams.get("stage");
  const assignedToId = searchParams.get("assignedToId");

  const deals = await prisma.deal.findMany({
    where: {
      tenantId: session.tenantId,
      ...(stage && { stage: stage as any }),
      ...(assignedToId && { assignedToId }),
    },
    include: {
      account: { select: { id: true, name: true, segment: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
      assignedTo: { select: { id: true, name: true } },
      _count: { select: { activities: true, quotes: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(deals);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = createDealSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Verify account belongs to tenant
  const account = await prisma.account.findFirst({
    where: { id: parsed.data.accountId, tenantId: session.tenantId },
  });

  if (!account) {
    return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });
  }

  const stage = parsed.data.stage as DealStage;
  const deal = await prisma.deal.create({
    data: {
      ...parsed.data,
      expectedCloseDate: parsed.data.expectedCloseDate
        ? new Date(parsed.data.expectedCloseDate)
        : undefined,
      probability: STAGE_PROBABILITIES[stage] ?? parsed.data.probability,
      tenantId: session.tenantId,
      assignedToId: parsed.data.assignedToId || session.id,
    },
  });

  return NextResponse.json(deal, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const dealId = searchParams.get("id");

  if (!dealId) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = updateDealStageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const stage = parsed.data.stage as DealStage;
  const updateData: Record<string, unknown> = {
    stage: parsed.data.stage,
    probability: STAGE_PROBABILITIES[stage],
  };

  if (parsed.data.stage === "CLOSED_WON") {
    updateData.actualCloseDate = new Date();
  }
  if (parsed.data.stage === "CLOSED_LOST") {
    updateData.actualCloseDate = new Date();
    updateData.lostReason = parsed.data.lostReason;
  }

  await prisma.deal.updateMany({
    where: { id: dealId, tenantId: session.tenantId },
    data: updateData,
  });

  return NextResponse.json({ ok: true });
}

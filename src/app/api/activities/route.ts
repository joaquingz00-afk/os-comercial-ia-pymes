import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createActivitySchema, updateActivitySchema } from "@/lib/validations/activity";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const dealId = searchParams.get("dealId");
  const accountId = searchParams.get("accountId");
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const activities = await prisma.activity.findMany({
    where: {
      tenantId: session.tenantId,
      ...(dealId && { dealId }),
      ...(accountId && { accountId }),
      ...(type && { type: type as any }),
      ...(status && { status: status as any }),
    },
    include: {
      account: { select: { id: true, name: true } },
      deal: { select: { id: true, title: true, stage: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
      user: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } },
    },
    orderBy: { date: "desc" },
    take: 50,
  });

  return NextResponse.json(activities);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = createActivitySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const activity = await prisma.activity.create({
    data: {
      ...parsed.data,
      date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      nextFollowUp: parsed.data.nextFollowUp
        ? new Date(parsed.data.nextFollowUp)
        : undefined,
      userId: session.id,
      assignedToId: parsed.data.assignedToId || session.id,
      tenantId: session.tenantId,
    },
    include: {
      account: { select: { name: true } },
      deal: { select: { title: true } },
      user: { select: { name: true } },
    },
  });

  return NextResponse.json(activity, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const activityId = searchParams.get("id");

  if (!activityId) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = updateActivitySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.activity.updateMany({
    where: { id: activityId, tenantId: session.tenantId },
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      nextFollowUp: parsed.data.nextFollowUp
        ? new Date(parsed.data.nextFollowUp)
        : undefined,
    },
  });

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateAccountSchema } from "@/lib/validations/account";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const account = await prisma.account.findFirst({
    where: { id: params.id, tenantId: session.tenantId },
    include: {
      contacts: { orderBy: { isPrimary: "desc" } },
      deals: {
        include: { assignedTo: { select: { name: true } } },
        orderBy: { updatedAt: "desc" },
      },
      activities: {
        include: { user: { select: { name: true } }, contact: true },
        orderBy: { date: "desc" },
        take: 20,
      },
      assignedTo: { select: { id: true, name: true } },
      _count: { select: { contacts: true, deals: true, activities: true } },
    },
  });

  if (!account) {
    return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });
  }

  return NextResponse.json(account);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = updateAccountSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const account = await prisma.account.updateMany({
    where: { id: params.id, tenantId: session.tenantId },
    data: parsed.data,
  });

  if (account.count === 0) {
    return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await prisma.account.deleteMany({
    where: { id: params.id, tenantId: session.tenantId },
  });

  return NextResponse.json({ ok: true });
}

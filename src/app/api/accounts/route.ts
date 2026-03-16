import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createAccountSchema } from "@/lib/validations/account";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const accounts = await prisma.account.findMany({
    where: {
      tenantId: session.tenantId,
      ...(status && { status: status as any }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { industry: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      _count: { select: { contacts: true, deals: true } },
      assignedTo: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(accounts);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = createAccountSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const account = await prisma.account.create({
    data: {
      ...parsed.data,
      tenantId: session.tenantId,
      assignedToId: parsed.data.assignedToId || session.id,
    },
  });

  return NextResponse.json(account, { status: 201 });
}

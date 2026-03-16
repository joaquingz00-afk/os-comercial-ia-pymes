import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createContactSchema } from "@/lib/validations/contact";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = createContactSchema.safeParse(body);

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

  // If marking as primary, unmark others
  if (parsed.data.isPrimary) {
    await prisma.contact.updateMany({
      where: { accountId: parsed.data.accountId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  const contact = await prisma.contact.create({
    data: {
      ...parsed.data,
      tenantId: session.tenantId,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}

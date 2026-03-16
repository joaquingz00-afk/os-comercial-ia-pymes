import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { summarizeMeeting } from "@/lib/ai/meeting-summarizer";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { notes, accountName, dealTitle } = await request.json();

  if (!notes || !accountName) {
    return NextResponse.json(
      { error: "notes y accountName son requeridos" },
      { status: 400 }
    );
  }

  const summary = await summarizeMeeting({
    accountName,
    dealTitle,
    notes,
    tenantId: session.tenantId,
    userId: session.id,
  });

  return NextResponse.json(summary);
}

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DealPipeline } from "@/components/deals/deal-pipeline";

export default async function DealsPage() {
  const session = await getSession();
  if (!session) return null;

  const deals = await prisma.deal.findMany({
    where: { tenantId: session.tenantId },
    include: {
      account: { select: { id: true, name: true } },
      contact: { select: { firstName: true, lastName: true } },
      assignedTo: { select: { id: true, name: true } },
      _count: { select: { activities: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const accounts = await prisma.account.findMany({
    where: { tenantId: session.tenantId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <p className="text-muted-foreground">
          Gestiona tus oportunidades de venta
        </p>
      </div>

      <DealPipeline deals={deals} accounts={accounts} />
    </div>
  );
}

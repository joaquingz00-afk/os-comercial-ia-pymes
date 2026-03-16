import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/shared/empty-state";
import { AccountsList } from "@/components/accounts/accounts-list";
import { CreateAccountDialog } from "@/components/accounts/create-account-dialog";

export default async function CuentasPage() {
  const session = await getSession();
  if (!session) return null;

  const accounts = await prisma.account.findMany({
    where: { tenantId: session.tenantId },
    include: {
      _count: { select: { contacts: true, deals: true } },
      assignedTo: { select: { id: true, name: true } },
      deals: {
        where: { stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } },
        select: { value: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cuentas</h1>
          <p className="text-muted-foreground">
            {accounts.length} {accounts.length === 1 ? "cuenta" : "cuentas"}{" "}
            registradas
          </p>
        </div>
        <CreateAccountDialog />
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="Sin cuentas aún"
          description="Crea tu primera cuenta para empezar a gestionar tus oportunidades comerciales."
          action={<CreateAccountDialog />}
        />
      ) : (
        <AccountsList accounts={accounts} />
      )}
    </div>
  );
}

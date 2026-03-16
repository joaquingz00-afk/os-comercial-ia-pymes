"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface AccountWithRelations {
  id: string;
  name: string;
  industry: string | null;
  segment: string | null;
  status: string;
  healthScore: number | null;
  _count: { contacts: number; deals: number };
  assignedTo: { id: string; name: string } | null;
  deals: { value: number }[];
}

const statusLabels: Record<string, string> = {
  PROSPECT: "Prospecto",
  ACTIVE_CLIENT: "Cliente activo",
  INACTIVE: "Inactivo",
  CHURNED: "Perdido",
};

const statusColors: Record<string, string> = {
  PROSPECT: "bg-primary/10 text-primary",
  ACTIVE_CLIENT: "bg-success/10 text-success",
  INACTIVE: "bg-muted text-muted-foreground",
  CHURNED: "bg-destructive/10 text-destructive",
};

export function AccountsList({
  accounts,
}: {
  accounts: AccountWithRelations[];
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
              Empresa
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
              Estado
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
              Contactos
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
              Deals
            </th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
              Pipeline
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
              Responsable
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {accounts.map((account) => {
            const pipelineValue = account.deals.reduce(
              (sum, d) => sum + d.value,
              0
            );
            return (
              <tr
                key={account.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/cuentas/${account.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {account.name}
                  </Link>
                  {account.industry && (
                    <p className="text-xs text-muted-foreground">
                      {account.industry}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      statusColors[account.status] || ""
                    }`}
                  >
                    {statusLabels[account.status] || account.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {account._count.contacts}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {account._count.deals}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium">
                  {pipelineValue > 0
                    ? formatCurrency(pipelineValue)
                    : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {account.assignedTo?.name || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

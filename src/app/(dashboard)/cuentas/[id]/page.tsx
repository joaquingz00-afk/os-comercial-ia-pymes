import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { STAGE_LABELS, ACTIVITY_TYPE_LABELS } from "@/types";
import type { DealStage, ActivityType } from "@/types";
import Link from "next/link";

export default async function AccountDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) return null;

  const account = await prisma.account.findFirst({
    where: { id: params.id, tenantId: session.tenantId },
    include: {
      contacts: { orderBy: { isPrimary: "desc" } },
      deals: {
        include: { assignedTo: { select: { name: true } } },
        orderBy: { updatedAt: "desc" },
      },
      activities: {
        include: {
          user: { select: { name: true } },
          contact: { select: { firstName: true, lastName: true } },
          deal: { select: { title: true } },
        },
        orderBy: { date: "desc" },
        take: 20,
      },
      assignedTo: { select: { name: true } },
    },
  });

  if (!account) notFound();

  const totalPipeline = account.deals
    .filter((d) => !["CLOSED_WON", "CLOSED_LOST"].includes(d.stage))
    .reduce((sum, d) => sum + d.value, 0);

  const wonDeals = account.deals.filter((d) => d.stage === "CLOSED_WON");
  const totalWon = wonDeals.reduce((sum, d) => sum + d.value, 0);

  const roleLabels: Record<string, string> = {
    DECISION_MAKER: "Decisor",
    INFLUENCER: "Influenciador",
    CHAMPION: "Champion",
    USER: "Usuario",
    BLOCKER: "Blocker",
  };

  const stageColors: Record<string, string> = {
    PROSPECTING: "bg-gray-100 text-gray-700",
    QUALIFICATION: "bg-blue-100 text-blue-700",
    PROPOSAL: "bg-purple-100 text-purple-700",
    NEGOTIATION: "bg-yellow-100 text-yellow-700",
    CLOSED_WON: "bg-green-100 text-green-700",
    CLOSED_LOST: "bg-red-100 text-red-700",
  };

  const typeIcons: Record<string, string> = {
    CALL: "📞",
    EMAIL: "✉️",
    MEETING: "🤝",
    NOTE: "📝",
    TASK: "✅",
    SEQUENCE_STEP: "🔄",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/cuentas"
              className="text-muted-foreground hover:text-foreground"
            >
              Cuentas
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-2xl font-bold">{account.name}</h1>
          </div>
          <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
            {account.industry && <span>{account.industry}</span>}
            {account.segment && <span>· {account.segment}</span>}
            {account.assignedTo && (
              <span>· Responsable: {account.assignedTo.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Pipeline activo"
          value={formatCurrency(totalPipeline)}
        />
        <StatCard title="Revenue ganado" value={formatCurrency(totalWon)} />
        <StatCard title="Contactos" value={account.contacts.length} />
        <StatCard title="Deals" value={account.deals.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts */}
        <div className="bg-card border border-border rounded-xl">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Contactos</h2>
          </div>
          <div className="divide-y divide-border">
            {account.contacts.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Sin contactos registrados
              </p>
            ) : (
              account.contacts.map((contact) => (
                <div key={contact.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {contact.firstName} {contact.lastName}
                        {contact.isPrimary && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Principal
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contact.jobTitle}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {roleLabels[contact.role] || contact.role}
                    </span>
                  </div>
                  {contact.email && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {contact.email}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Deals */}
        <div className="bg-card border border-border rounded-xl">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Deals</h2>
          </div>
          <div className="divide-y divide-border">
            {account.deals.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Sin deals registrados
              </p>
            ) : (
              account.deals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="block p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{deal.title}</p>
                    <span className="font-medium text-sm">
                      {formatCurrency(deal.value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        stageColors[deal.stage] || ""
                      }`}
                    >
                      {STAGE_LABELS[deal.stage as DealStage]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {deal.probability}%
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card border border-border rounded-xl">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Timeline</h2>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {account.activities.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Sin actividad registrada
              </p>
            ) : (
              account.activities.map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-base mt-0.5">
                      {typeIcons[activity.type] || "📋"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.user.name} · {formatDate(activity.date)}
                        {activity.deal && ` · ${activity.deal.title}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

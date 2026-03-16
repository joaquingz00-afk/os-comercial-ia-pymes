import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate, formatRelativeDate } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { DealAiPanel } from "@/components/deals/deal-ai-panel";
import { ActivityForm } from "@/components/actividades/activity-form";
import { STAGE_LABELS, ACTIVITY_TYPE_LABELS } from "@/types";
import type { DealStage, ActivityType } from "@/types";
import Link from "next/link";

export default async function DealDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) return null;

  const deal = await prisma.deal.findFirst({
    where: { id: params.id, tenantId: session.tenantId },
    include: {
      account: true,
      contact: true,
      assignedTo: { select: { name: true } },
      activities: {
        include: {
          user: { select: { name: true } },
          contact: { select: { firstName: true, lastName: true } },
        },
        orderBy: { date: "desc" },
        take: 30,
      },
      quotes: {
        select: { id: true, number: true, status: true, total: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!deal) notFound();

  const daysSinceLastActivity =
    deal.activities.length > 0
      ? Math.round(
          (Date.now() - new Date(deal.activities[0].date).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  const typeIcons: Record<string, string> = {
    CALL: "📞",
    EMAIL: "✉️",
    MEETING: "🤝",
    NOTE: "📝",
    TASK: "✅",
    SEQUENCE_STEP: "🔄",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-gray-100 text-gray-700",
    OVERDUE: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/deals"
              className="text-muted-foreground hover:text-foreground"
            >
              Pipeline
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href={`/cuentas/${deal.account.id}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {deal.account.name}
            </Link>
          </div>
          <h1 className="text-2xl font-bold mt-1">{deal.title}</h1>
          <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {STAGE_LABELS[deal.stage as DealStage]}
            </span>
            {deal.assignedTo && <span>Vendedor: {deal.assignedTo.name}</span>}
            {deal.contact && (
              <span>
                Contacto: {deal.contact.firstName} {deal.contact.lastName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Valor" value={formatCurrency(deal.value)} />
        <StatCard title="Probabilidad" value={`${deal.probability}%`} />
        <StatCard
          title="Valor ponderado"
          value={formatCurrency((deal.value * deal.probability) / 100)}
        />
        <StatCard
          title="Último contacto"
          value={
            daysSinceLastActivity !== null
              ? `Hace ${daysSinceLastActivity} días`
              : "Sin actividad"
          }
          trend={
            daysSinceLastActivity !== null && daysSinceLastActivity > 5
              ? "down"
              : "up"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Activity Form */}
          <ActivityForm
            dealId={deal.id}
            accountId={deal.account.id}
            accountName={deal.account.name}
            dealTitle={deal.title}
          />

          {/* Activity List */}
          <div className="bg-card border border-border rounded-xl">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Timeline</h2>
            </div>
            <div className="divide-y divide-border">
              {deal.activities.length === 0 ? (
                <p className="p-8 text-center text-sm text-muted-foreground">
                  Sin actividad registrada. Registra tu primera interacción.
                </p>
              ) : (
                deal.activities.map((activity) => (
                  <div key={activity.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">
                        {typeIcons[activity.type] || "📋"}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {activity.title}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              statusColors[activity.status] || ""
                            }`}
                          >
                            {activity.status}
                          </span>
                          {activity.aiGenerated && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              IA
                            </span>
                          )}
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                            {activity.description}
                          </p>
                        )}
                        {activity.aiSummary && (
                          <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <p className="text-xs font-medium text-purple-700 mb-1">
                              Resumen IA:
                            </p>
                            <p className="text-sm text-purple-900">
                              {activity.aiSummary}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{activity.user.name}</span>
                          <span>{formatDate(activity.date)}</span>
                          {activity.duration && (
                            <span>{activity.duration} min</span>
                          )}
                          {activity.outcome && <span>{activity.outcome}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AI Panel */}
        <div className="space-y-4">
          <DealAiPanel dealId={deal.id} />

          {/* Quotes */}
          {deal.quotes.length > 0 && (
            <div className="bg-card border border-border rounded-xl">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm">Cotizaciones</h3>
              </div>
              <div className="divide-y divide-border">
                {deal.quotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/cotizaciones/${quote.id}`}
                    className="block p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Cotización #{quote.number}
                      </span>
                      <span className="text-sm">
                        {formatCurrency(quote.total)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {quote.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

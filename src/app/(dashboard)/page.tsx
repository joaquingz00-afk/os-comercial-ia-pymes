import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { STAGE_LABELS } from "@/types";
import type { DealStage } from "@/types";
import Link from "next/link";

export default async function AgendaPage() {
  const session = await getSession();
  if (!session) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Parallel data fetching
  const [
    pendingTasks,
    todayActivities,
    overdueFollowUps,
    activeDeals,
    pipelineValue,
    recentActivities,
  ] = await Promise.all([
    // Tasks pending for today or overdue
    prisma.activity.findMany({
      where: {
        tenantId: session.tenantId,
        type: { in: ["TASK", "CALL"] },
        status: "PENDING",
        OR: [
          { dueDate: { lte: tomorrow } },
          { dueDate: null, date: { lte: tomorrow } },
        ],
      },
      include: { account: true, deal: true, contact: true },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      take: 10,
    }),

    // Today's meetings and scheduled activities
    prisma.activity.findMany({
      where: {
        tenantId: session.tenantId,
        type: "MEETING",
        date: { gte: today, lt: tomorrow },
      },
      include: { account: true, deal: true },
      orderBy: { date: "asc" },
    }),

    // Overdue follow-ups
    prisma.activity.count({
      where: {
        tenantId: session.tenantId,
        status: "PENDING",
        dueDate: { lt: today },
      },
    }),

    // Active deals count
    prisma.deal.count({
      where: {
        tenantId: session.tenantId,
        stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] },
      },
    }),

    // Total pipeline value
    prisma.deal.aggregate({
      where: {
        tenantId: session.tenantId,
        stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] },
      },
      _sum: { value: true },
    }),

    // Recent activity across all deals
    prisma.activity.findMany({
      where: { tenantId: session.tenantId },
      include: { account: true, deal: true, user: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const priorityColors: Record<string, string> = {
    URGENT: "bg-destructive/10 text-destructive",
    HIGH: "bg-warning/10 text-warning",
    MEDIUM: "bg-primary/10 text-primary",
    LOW: "bg-muted text-muted-foreground",
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
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          Hola, {session.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          {new Intl.DateTimeFormat("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }).format(new Date())}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Tareas pendientes hoy"
          value={pendingTasks.length}
          subtitle={
            overdueFollowUps > 0 ? `${overdueFollowUps} vencidas` : "Al día"
          }
          trend={overdueFollowUps > 0 ? "down" : "up"}
        />
        <StatCard
          title="Reuniones hoy"
          value={todayActivities.length}
          subtitle={
            todayActivities.length > 0
              ? `Próxima: ${new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit" }).format(new Date(todayActivities[0].date))}`
              : "Sin reuniones"
          }
        />
        <StatCard
          title="Deals activos"
          value={activeDeals}
        />
        <StatCard
          title="Pipeline total"
          value={formatCurrency(pipelineValue._sum.value || 0)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-card border border-border rounded-xl">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Pendientes de hoy</h2>
            <Link
              href="/actividades"
              className="text-sm text-primary hover:underline"
            >
              Ver todo
            </Link>
          </div>
          <div className="divide-y divide-border">
            {pendingTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No hay tareas pendientes. Buen trabajo.
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-lg mt-0.5">
                    {typeIcons[task.type] || "📋"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.account?.name}
                      {task.deal && ` — ${task.deal.title}`}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      priorityColors[task.priority] || ""
                    }`}
                  >
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeDate(task.dueDate)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Actividad reciente</h2>
          </div>
          <div className="divide-y divide-border">
            {recentActivities.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Aún no hay actividad registrada.
                <br />
                <Link href="/cuentas" className="text-primary hover:underline">
                  Crea tu primera cuenta
                </Link>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 flex items-start gap-3"
                >
                  <span className="text-lg mt-0.5">
                    {typeIcons[activity.type] || "📋"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>
                      {" — "}
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.account?.name}
                      {activity.deal &&
                        ` — ${activity.deal.title} (${STAGE_LABELS[activity.deal.stage as DealStage]})`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeDate(activity.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

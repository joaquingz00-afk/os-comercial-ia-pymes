import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { ACTIVITY_TYPE_LABELS } from "@/types";
import type { ActivityType } from "@/types";
import Link from "next/link";

export default async function ActividadesPage() {
  const session = await getSession();
  if (!session) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pendingTasks, overdueTasks, recentCompleted] = await Promise.all([
    prisma.activity.findMany({
      where: {
        tenantId: session.tenantId,
        status: "PENDING",
        OR: [
          { assignedToId: session.id },
          { userId: session.id },
        ],
      },
      include: {
        account: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
        user: { select: { name: true } },
        assignedTo: { select: { name: true } },
      },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
    }),

    prisma.activity.count({
      where: {
        tenantId: session.tenantId,
        status: "PENDING",
        dueDate: { lt: today },
      },
    }),

    prisma.activity.findMany({
      where: {
        tenantId: session.tenantId,
        status: "COMPLETED",
      },
      include: {
        account: { select: { name: true } },
        deal: { select: { title: true } },
        user: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
  ]);

  const typeIcons: Record<string, string> = {
    CALL: "📞",
    EMAIL: "✉️",
    MEETING: "🤝",
    NOTE: "📝",
    TASK: "✅",
    SEQUENCE_STEP: "🔄",
  };

  const priorityColors: Record<string, string> = {
    URGENT: "bg-destructive/10 text-destructive border-l-destructive",
    HIGH: "bg-warning/10 text-warning border-l-warning",
    MEDIUM: "bg-primary/10 text-primary border-l-primary",
    LOW: "bg-muted text-muted-foreground border-l-border",
  };

  async function completeTask(formData: FormData) {
    "use server";
    const activityId = formData.get("activityId") as string;
    const { getSession: gs } = await import("@/lib/auth");
    const { prisma: db } = await import("@/lib/db");
    const s = await gs();
    if (!s) return;

    await db.activity.updateMany({
      where: { id: activityId, tenantId: s.tenantId },
      data: { status: "COMPLETED" },
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/actividades");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Actividades</h1>
        <p className="text-muted-foreground">
          {pendingTasks.length} pendientes
          {overdueTasks > 0 && (
            <span className="text-destructive">
              {" "}
              · {overdueTasks} vencidas
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Pendientes</h2>
            </div>
            <div className="divide-y divide-border">
              {pendingTasks.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No hay actividades pendientes. Excelente trabajo.
                </div>
              ) : (
                pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 flex items-start gap-3 border-l-4 ${
                      priorityColors[task.priority] || ""
                    }`}
                  >
                    <form action={completeTask}>
                      <input
                        type="hidden"
                        name="activityId"
                        value={task.id}
                      />
                      <button
                        type="submit"
                        className="mt-0.5 w-5 h-5 border-2 border-border rounded hover:border-primary hover:bg-primary/10 transition-colors flex-shrink-0"
                        title="Completar"
                      />
                    </form>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span>{typeIcons[task.type] || "📋"}</span>
                        <p className="font-medium text-sm">{task.title}</p>
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                        {task.account && (
                          <Link
                            href={`/cuentas/${task.account.id}`}
                            className="hover:text-primary"
                          >
                            {task.account.name}
                          </Link>
                        )}
                        {task.deal && (
                          <Link
                            href={`/deals/${task.deal.id}`}
                            className="hover:text-primary"
                          >
                            {task.deal.title}
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {task.dueDate && (
                        <span
                          className={`text-xs ${
                            new Date(task.dueDate) < today
                              ? "text-destructive font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatRelativeDate(task.dueDate)}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ACTIVITY_TYPE_LABELS[task.type as ActivityType]}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recently Completed */}
        <div className="bg-card border border-border rounded-xl">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-sm">Completadas reciente</h2>
          </div>
          <div className="divide-y divide-border">
            {recentCompleted.map((task) => (
              <div key={task.id} className="p-3 opacity-60">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {typeIcons[task.type] || "📋"}
                  </span>
                  <p className="text-sm line-through">{task.title}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 ml-6">
                  {task.account?.name} · {formatDate(task.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

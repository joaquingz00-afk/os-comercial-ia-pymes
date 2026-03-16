"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { STAGE_LABELS } from "@/types";
import type { DealStage } from "@/types";
import Link from "next/link";

interface Deal {
  id: string;
  title: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: Date | string | null;
  account: { id: string; name: string };
  contact: { firstName: string; lastName: string } | null;
  assignedTo: { id: string; name: string } | null;
  _count: { activities: number };
}

interface Account {
  id: string;
  name: string;
}

const PIPELINE_STAGES: DealStage[] = [
  "PROSPECTING",
  "QUALIFICATION",
  "PROPOSAL",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
];

const stageColors: Record<string, string> = {
  PROSPECTING: "border-t-gray-400",
  QUALIFICATION: "border-t-blue-400",
  PROPOSAL: "border-t-purple-400",
  NEGOTIATION: "border-t-yellow-400",
  CLOSED_WON: "border-t-green-400",
  CLOSED_LOST: "border-t-red-400",
};

export function DealPipeline({
  deals,
  accounts,
}: {
  deals: Deal[];
  accounts: Account[];
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const dealsByStage = PIPELINE_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = deals.filter((d) => d.stage === stage);
      return acc;
    },
    {} as Record<string, Deal[]>
  );

  async function handleStageChange(dealId: string, newStage: string) {
    await fetch(`/api/deals?id=${dealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });
    router.refresh();
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      accountId: formData.get("accountId") as string,
      value: Number(formData.get("value")) || 0,
      source: formData.get("source") as string || "INBOUND",
    };

    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setShowCreate(false);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Nuevo deal
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const stageDeals = dealsByStage[stage] || [];
          const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage}
              className={`flex-shrink-0 w-72 bg-muted/50 rounded-xl border-t-4 ${stageColors[stage]}`}
            >
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    {STAGE_LABELS[stage]}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatCurrency(totalValue)}
                </p>
              </div>

              <div className="p-2 space-y-2 min-h-[200px]">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow transition-shadow"
                  >
                    <Link
                      href={`/deals/${deal.id}`}
                      className="font-medium text-sm hover:text-primary transition-colors"
                    >
                      {deal.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {deal.account.name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">
                        {formatCurrency(deal.value)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {deal.probability}%
                      </span>
                    </div>

                    {/* Quick stage change buttons */}
                    {stage !== "CLOSED_WON" && stage !== "CLOSED_LOST" && (
                      <div className="flex gap-1 mt-2">
                        {PIPELINE_STAGES.filter(
                          (s) =>
                            s !== stage &&
                            s !== "CLOSED_LOST"
                        )
                          .slice(0, 2)
                          .map((targetStage) => (
                            <button
                              key={targetStage}
                              onClick={() =>
                                handleStageChange(deal.id, targetStage)
                              }
                              className="text-xs px-2 py-0.5 rounded bg-muted hover:bg-border transition-colors truncate"
                              title={`Mover a ${STAGE_LABELS[targetStage]}`}
                            >
                              → {STAGE_LABELS[targetStage]}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Deal Dialog */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCreate(false)}
          />
          <div className="relative bg-card rounded-xl shadow-lg border border-border w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Nuevo deal</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título del deal *
                </label>
                <input
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Implementación CRM para Acme"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cuenta *
                </label>
                <select
                  name="accountId"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Seleccionar cuenta</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Valor ($)
                  </label>
                  <input
                    name="value"
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Origen
                  </label>
                  <select
                    name="source"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="INBOUND">Inbound</option>
                    <option value="OUTBOUND">Outbound</option>
                    <option value="REFERRAL">Referido</option>
                    <option value="EVENT">Evento</option>
                    <option value="PARTNER">Partner</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Creando..." : "Crear deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

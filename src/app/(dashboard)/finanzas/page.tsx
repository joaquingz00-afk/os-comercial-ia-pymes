import { EmptyState } from "@/components/shared/empty-state";

export default function FinanzasPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Control Financiero</h1>
      <EmptyState
        icon="📈"
        title="Dashboard financiero"
        description="Controla ingresos, gastos, rentabilidad por cliente y por vendedor. Disponible en Fase 3."
      />
    </div>
  );
}

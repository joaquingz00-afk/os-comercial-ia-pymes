import { EmptyState } from "@/components/shared/empty-state";

export default function ForecastPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Forecast</h1>
      <EmptyState
        icon="🎯"
        title="Proyección de ventas"
        description="Forecast basado en pipeline, por vendedor y por período. Disponible en Fase 4."
      />
    </div>
  );
}

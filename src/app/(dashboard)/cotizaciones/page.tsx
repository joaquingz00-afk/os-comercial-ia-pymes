import { EmptyState } from "@/components/shared/empty-state";

export default function CotizacionesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cotizaciones</h1>
      <EmptyState
        icon="📄"
        title="Módulo de cotizaciones"
        description="Genera cotizaciones profesionales vinculadas a tus deals. Disponible en Fase 2."
      />
    </div>
  );
}

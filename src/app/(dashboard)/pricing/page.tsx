import { EmptyState } from "@/components/shared/empty-state";

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pricing Inteligente</h1>
      <EmptyState
        icon="💰"
        title="Calculadora de precios"
        description="Calcula tarifas, simula proyectos y recibe sugerencias de precio con IA. Disponible en Fase 3."
      />
    </div>
  );
}

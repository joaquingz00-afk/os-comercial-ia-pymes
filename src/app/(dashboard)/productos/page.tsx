import { EmptyState } from "@/components/shared/empty-state";

export default function ProductosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Productos</h1>
      <EmptyState
        icon="📦"
        title="Catálogo de productos"
        description="Administra tu catálogo de productos y servicios. Disponible en Fase 2."
      />
    </div>
  );
}

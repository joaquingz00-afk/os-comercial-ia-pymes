import { getSession } from "@/lib/auth";

export default async function ConfiguracionPage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configuración</h1>

      <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
        <h2 className="font-semibold mb-4">Tu cuenta</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Nombre</label>
            <p className="font-medium">{session.name}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="font-medium">{session.email}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Rol</label>
            <p className="font-medium">{session.role}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Plan</label>
            <p className="font-medium">{session.tenantPlan}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

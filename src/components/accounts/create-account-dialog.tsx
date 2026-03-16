"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateAccountDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      industry: formData.get("industry") as string || undefined,
      segment: formData.get("segment") as string || undefined,
      website: formData.get("website") as string || undefined,
      phone: formData.get("phone") as string || undefined,
    };

    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        + Nueva cuenta
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />
      <div className="relative bg-card rounded-xl shadow-lg border border-border w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Nueva cuenta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre de empresa *
            </label>
            <input
              name="name"
              required
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Acme Corp S.A."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Industria
              </label>
              <input
                name="industry"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Tecnología"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Segmento
              </label>
              <select
                name="segment"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Seleccionar</option>
                <option value="STARTUP">Startup</option>
                <option value="SMB">PyME</option>
                <option value="MIDMARKET">Mediana</option>
                <option value="ENTERPRISE">Enterprise</option>
                <option value="GOVERNMENT">Gobierno</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Sitio web
              </label>
              <input
                name="website"
                type="url"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://acme.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Teléfono
              </label>
              <input
                name="phone"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+52 55 1234 5678"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear cuenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

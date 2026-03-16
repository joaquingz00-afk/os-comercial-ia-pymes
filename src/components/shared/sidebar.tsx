"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  {
    group: "EJECUTAR",
    items: [
      { name: "Agenda", href: "/", icon: "📋" },
      { name: "Cuentas", href: "/cuentas", icon: "🏢" },
      { name: "Pipeline", href: "/deals", icon: "📊" },
      { name: "Actividades", href: "/actividades", icon: "✅" },
    ],
  },
  {
    group: "COTIZAR",
    items: [
      { name: "Cotizaciones", href: "/cotizaciones", icon: "📄" },
      { name: "Productos", href: "/productos", icon: "📦" },
      { name: "Pricing", href: "/pricing", icon: "💰" },
    ],
  },
  {
    group: "CONTROLAR",
    items: [
      { name: "Finanzas", href: "/finanzas", icon: "📈" },
      { name: "Forecast", href: "/forecast", icon: "🎯" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-lg font-bold">
          OS Comercial <span className="text-primary">IA</span>
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigation.map((group) => (
          <div key={group.group}>
            <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 px-3">
              {group.group}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span className="text-base">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/configuracion"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <span className="text-base">⚙️</span>
          Configuración
        </Link>
      </div>
    </aside>
  );
}

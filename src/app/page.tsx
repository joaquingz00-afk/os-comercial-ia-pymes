import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-2xl px-4">
        <h1 className="text-4xl font-bold tracking-tight">
          OS Comercial <span className="text-primary">IA</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Motor de ejecución comercial con IA para equipos de ventas B2B
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

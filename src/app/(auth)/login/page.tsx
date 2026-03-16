import { redirect } from "next/navigation";
import { getSession, createSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  async function login(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return;

    // Simple auth: find user by email (in production, use proper auth)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) return;

    await createSession(user.id);
    redirect("/");
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">
          OS Comercial <span className="text-primary">IA</span>
        </h1>
        <p className="text-muted-foreground mt-2">Inicia sesión en tu cuenta</p>
      </div>

      <form action={login} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="tu@empresa.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}

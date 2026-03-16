import { redirect } from "next/navigation";
import { getSession, createSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/");

  async function register(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !company || !email || !password) return;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return;

    // Create tenant + admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const slug = company
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const tenant = await tx.tenant.create({
        data: {
          name: company,
          slug: `${slug}-${Date.now().toString(36)}`,
          plan: "STARTER",
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          name,
          role: "ADMIN",
          tenantId: tenant.id,
        },
      });

      return user;
    });

    await createSession(result.id);
    redirect("/");
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">
          OS Comercial <span className="text-primary">IA</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Crea tu cuenta y empieza tu trial de 14 días
        </p>
      </div>

      <form action={register} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Tu nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Carlos García"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1">
            Nombre de tu empresa
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Mi Empresa S.A."
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email corporativo
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
            minLength={8}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Crear cuenta gratis
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}

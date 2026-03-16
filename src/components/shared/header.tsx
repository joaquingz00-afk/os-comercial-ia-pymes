import { getSession } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import { LogoutButton } from "./logout-button";

export async function Header() {
  const session = await getSession();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        {session && (
          <>
            <span className="text-sm text-muted-foreground">
              {session.name}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
              {getInitials(session.name)}
            </div>
            <LogoutButton />
          </>
        )}
      </div>
    </header>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import { TrophyIcon } from "../components/icons";
import { RedirectIfNeedsRole } from "./RedirectIfNeedsRole";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const user = session.user as {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    needsRoleSelection?: boolean;
  };

  return (
    <div className="min-h-screen bg-primary text-foreground">
      <RedirectIfNeedsRole needsRoleSelection={user.needsRoleSelection === true} />
      <header className="sticky top-0 z-50 border-b border-secondary/50 bg-primary px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground no-underline">
            <TrophyIcon className="h-8 w-8 text-accent" aria-hidden />
            <span className="text-xl font-bold" style={{ fontFamily: "var(--font-quantico)" }}>
              S-Rank
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-foreground-muted hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/profile" className="text-sm text-foreground-muted hover:text-foreground">
              Perfil
            </Link>
            <Link href="/explore" className="text-sm text-foreground-muted hover:text-foreground">
              Explorar
            </Link>
            <Link href="/settings" className="text-sm text-foreground-muted hover:text-foreground">
              Ajustes
            </Link>
            <span className="text-sm text-foreground-muted">{user.name ?? user.email}</span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}

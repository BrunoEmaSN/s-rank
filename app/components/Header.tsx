import Link from "next/link";
import { TrophyIcon } from "./icons";

type SessionData = { user?: { name?: string; email?: string }; session?: unknown } | null;

export function Header({ session }: { session: SessionData }) {
  return (
    <header className="sticky top-0 z-50 border-b border-secondary/50 bg-primary px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground no-underline">
          <TrophyIcon className="h-8 w-8 text-accent" aria-hidden />
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-quantico)" }}>
            S-Rank
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/explore" className="text-sm text-foreground-muted hover:text-foreground">
            Explorar
          </Link>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded-lg border border-accent bg-transparent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-foreground-muted hover:text-foreground">
                Iniciar sesión
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg border border-accent bg-transparent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

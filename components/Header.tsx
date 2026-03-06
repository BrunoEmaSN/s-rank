"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrophyIcon } from "./icons";
import { AccountDropdown } from "./AccountDropdown";
import Image from "next/image";

type SessionData = {
  user?: { name?: string; email?: string; role?: string };
} | null;

function navLinkClass(pathname: string, href: string, exact?: boolean) {
  const base = "text-sm text-foreground-muted hover:text-foreground";
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  const active = isActive ? "font-medium text-foreground" : "";
  return `${base} ${active}`.trim();
}

export function Header({ session }: { session: SessionData }) {
  const pathname = usePathname();
  const user = session?.user;

  if (pathname === "/sign-in" || pathname === "/sign-up") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-secondary/50 bg-primary px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground no-underline">
          <Image src="/logo.svg" alt="S-Rank" className="translate-y-1" width={40} height={40} />
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-quantico)" }}>RANK</span>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className={navLinkClass(pathname, "/dashboard")}>
                Dashboard
              </Link>
              <Link href="/explore" className={navLinkClass(pathname, "/explore", true)}>
                Explorar
              </Link>
              <AccountDropdown user={user} />
            </>
          ) : (
            <>
              <Link href="/explore" className={navLinkClass(pathname, "/explore", true)}>
                Explorar
              </Link>
              {pathname !== "/sign-in" && (
                <Link href="/sign-in" className={navLinkClass(pathname, "/sign-in", true)}>
                  Iniciar sesión
                </Link>
              )}
              {pathname !== "/sign-up" && (
                <Link
                  href="/sign-up"
                  className="rounded-lg border border-accent bg-transparent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
                >
                  Registrarse
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

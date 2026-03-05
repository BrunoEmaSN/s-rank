"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { HiOutlineUser, HiOutlineCog } from "react-icons/hi";
import { SignOutButton } from "./SignOutButton";

type User = { name?: string; email?: string; role?: string };

function getInitials(user: User): string {
  if (user.name?.trim()) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return user.name.slice(0, 2).toUpperCase();
  }
  if (user.email) return user.email.slice(0, 2).toUpperCase();
  return "?";
}

function navLinkClass(pathname: string, href: string, exact?: boolean) {
  const base = "text-sm text-foreground-muted hover:text-foreground hover:bg-secondary/80";
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  const active = isActive ? "font-medium text-foreground bg-secondary/50" : "";
  return `${base} ${active}`.trim();
}

export function AccountDropdown({
  user,
}: {
  user: User;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const role = user?.role as "streamer" | "sub" | undefined;
  const initials = getInitials(user);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary bg-secondary/50 text-sm font-medium text-foreground transition hover:border-accent/50 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/50"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Abrir menú de cuenta"
      >
        {initials}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-secondary bg-primary py-1 shadow-lg"
          role="menu"
        >
          <div className="border-b border-secondary/50 px-3 py-2">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name ?? user.email ?? "Cuenta"}
            </p>
            {user.email && user.name && (
              <p className="truncate text-xs text-foreground-muted">{user.email}</p>
            )}
            {role && (
              <span
                className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  role === "streamer"
                    ? "bg-accent/20 text-accent"
                    : "bg-foreground-muted/20 text-foreground-muted"
                }`}
              >
                {role === "streamer" ? "Streamer" : "Suscriptor"}
              </span>
            )}
          </div>
          <Link
            href="/profile"
            className={`flex items-center gap-2 px-3 py-2 ${navLinkClass(pathname, "/profile", true)}`}
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <HiOutlineUser className="h-4 w-4 shrink-0" aria-hidden />
            Perfil
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-2 px-3 py-2 ${navLinkClass(pathname, "/settings", true)}`}
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <HiOutlineCog className="h-4 w-4 shrink-0" aria-hidden />
            Ajustes
          </Link>
          <div className="border-t border-secondary/50 pt-1">
            <SignOutButton
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground-muted hover:bg-secondary/80 hover:text-foreground"
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

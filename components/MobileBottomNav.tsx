"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineViewGrid,
  HiOutlineUserGroup,
  HiOutlineSearch,
  HiOutlineUserAdd,
  HiOutlineUsers,
} from "react-icons/hi";
import { TrophyIcon } from "./icons";

type User = { name?: string; email?: string; role?: string; image?: string };

function navLinkClass(pathname: string, href: string, exact?: boolean) {
  const base =
    "flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 min-w-0 flex-1 text-xs text-foreground-muted transition hover:bg-secondary/80 hover:text-foreground";
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");
  const active = isActive ? "bg-secondary/60 font-medium text-foreground" : "";
  return `${base} ${active}`.trim();
}

const subLinks = [
  { href: "/dashboard", icon: HiOutlineViewGrid },
  { href: "/community", icon: HiOutlineUserGroup },
  { href: "/explore", icon: HiOutlineSearch },
  { href: "/following", icon: HiOutlineUserAdd },
  { href: "/my-trophies", icon: TrophyIcon },
] as const;

const streamerLinks = [
  { href: "/dashboard", icon: HiOutlineViewGrid },
  { href: "/community", icon: HiOutlineUserGroup },
  { href: "/followers", icon: HiOutlineUsers },
  { href: "/following", icon: HiOutlineUserAdd },
  { href: "/trophies", icon: TrophyIcon },
] as const;

export function MobileBottomNav({ user }: { user: User }) {
  const pathname = usePathname();
  const role = (user?.role as "streamer" | "sub") ?? "sub";
  const links = role === "streamer" ? streamerLinks : subLinks;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-slate-900 supports-backdrop-filter:bg-slate-950 safe-area-inset-bottom"
      aria-label="Navegación principal"
    >
      <div className="flex w-full items-center justify-around gap-0.5 px-2 py-2">
        {links.map(({ href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={navLinkClass(
              pathname,
              href,
              href === "/dashboard" || href === "/explore"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
          </Link>
        ))}
      </div>
    </nav>
  );
}

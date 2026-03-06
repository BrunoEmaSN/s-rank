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
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground-muted transition hover:bg-secondary/80 hover:text-foreground";
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");
  const active = isActive ? "bg-secondary/60 font-medium text-foreground" : "";
  return `${base} ${active}`.trim();
}

const subLinks = [
  { href: "/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { href: "/community", label: "Community", icon: HiOutlineUserGroup },
  { href: "/explore", label: "Explore", icon: HiOutlineSearch },
  { href: "/following", label: "Following", icon: HiOutlineUserAdd },
  { href: "/my-trophies", label: "My Trophies", icon: TrophyIcon },
] as const;

const streamerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { href: "/community", label: "Community", icon: HiOutlineUserGroup },
  { href: "/followers", label: "Followers", icon: HiOutlineUsers },
  { href: "/following", label: "Following", icon: HiOutlineUserAdd },
  { href: "/trophies", label: "Trophies", icon: TrophyIcon },
] as const;

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const role = (user?.role as "streamer" | "sub") ?? "sub";
  const links = role === "streamer" ? streamerLinks : subLinks;

  return (
    <aside
      className="w-56 shrink-0 border-r border-secondary/50 bg-primary py-6"
      aria-label="Navegación principal"
    >
      <nav className="flex flex-col gap-0.5 px-3">
        {links.map(({ href, label, icon: Icon }) => (
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
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectIfNeedsRole({ needsRoleSelection }: { needsRoleSelection: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!needsRoleSelection) return;
    if (pathname === "/onboarding/role") return;
    router.replace("/onboarding/role");
  }, [needsRoleSelection, pathname, router]);

  return null;
}

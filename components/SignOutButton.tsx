"use client";

import { useRouter } from "next/navigation";
import { HiOutlineLogout } from "react-icons/hi";
import { authClient } from "@/lib/auth-client";

type Props = {
  className?: string;
  onClick?: () => void;
};

export function SignOutButton({ className, onClick }: Props) {
  const router = useRouter();

  async function handleSignOut() {
    onClick?.();
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={className ?? "text-sm text-foreground-muted hover:text-foreground"}
    >
      <span className="flex items-center gap-2">
        <HiOutlineLogout className="h-4 w-4 shrink-0" aria-hidden />
        Cerrar sesión
      </span>
    </button>
  );
}

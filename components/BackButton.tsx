"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface BackButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

export function BackButton({
  variant = "ghost",
  size = "lg",
  className,
  children,
}: BackButtonProps) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}

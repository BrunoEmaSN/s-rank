"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function JoinButton({ communityId }: { communityId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/communities/${communityId}/join`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleJoin} disabled={loading}>
      {loading ? "Uniendo…" : "Unirse a la comunidad"}
    </Button>
  );
}

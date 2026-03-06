"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, LabelText, Alert } from "@/components/ui";

type UnlockedTrophy = {
  userTrophyId: string;
  trophyId: string;
  title: string;
  icon: string;
};

export function ShareTrophyForm({
  communityId,
}: {
  communityId: string;
}) {
  const router = useRouter();
  const [trophies, setTrophies] = useState<UnlockedTrophy[]>([]);
  const [userTrophyId, setUserTrophyId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTrophies, setLoadingTrophies] = useState(true);

  useEffect(() => {
    fetch(`/api/communities/${communityId}/my-unlocked-trophies`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.length) setTrophies(data.data);
      })
      .finally(() => setLoadingTrophies(false));
  }, [communityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!userTrophyId) {
      setError("Elige un trofeo para compartir.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/communities/${communityId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userTrophyId,
          message: message.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al publicar");
        setLoading(false);
        return;
      }
      setUserTrophyId("");
      setMessage("");
      router.refresh();
    } catch {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  if (loadingTrophies || trophies.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-secondary/80 bg-secondary/30 p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        Compartir logro
      </h3>
      <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
        {error && <Alert variant="error">{error}</Alert>}
        <Label>
          <LabelText>Trofeo desbloqueado</LabelText>
          <select
            value={userTrophyId}
            onChange={(e) => setUserTrophyId(e.target.value)}
            className="w-full rounded-lg border border-secondary bg-secondary/30 px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Selecciona un trofeo</option>
            {trophies.map((t) => (
              <option key={t.userTrophyId} value={t.userTrophyId}>
                {t.title}
              </option>
            ))}
          </select>
        </Label>
        <Label>
          <LabelText>Mensaje (opcional)</LabelText>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Añade un mensaje..."
            className="min-h-[60px] w-full rounded-lg border border-secondary bg-secondary/30 px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </Label>
        <Button type="submit" disabled={loading}>
          {loading ? "Publicando…" : "Compartir en el feed"}
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, LabelText, Alert } from "@/components/ui";
import { TrophyImageUpload } from "@/components/TrophyImageUpload";

type TrophyOption = { id: string; title: string; description: string; icon: string };

export function RequestTrophyForm({
  communityId,
}: {
  communityId: string;
}) {
  const router = useRouter();
  const [trophies, setTrophies] = useState<TrophyOption[]>([]);
  const [trophyId, setTrophyId] = useState("");
  const [message, setMessage] = useState("");
  const [proofImageUrl, setProofImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTrophies, setLoadingTrophies] = useState(true);

  useEffect(() => {
    fetch(`/api/communities/${communityId}/trophies`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.length) setTrophies(data.data);
      })
      .finally(() => setLoadingTrophies(false));
  }, [communityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedMessage = message.trim();
    if (!trophyId || !trimmedMessage) {
      setError("Elige un trofeo y escribe el mensaje.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/communities/${communityId}/trophy-requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trophyId,
            message: trimmedMessage,
            proofImageUrl: proofImageUrl || undefined,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al enviar la solicitud");
        setLoading(false);
        return;
      }
      setTrophyId("");
      setMessage("");
      setProofImageUrl(null);
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
        Solicitar trofeo
      </h3>
      <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
        {error && <Alert variant="error">{error}</Alert>}
        <Label>
          <LabelText>Trofeo</LabelText>
          <select
            value={trophyId}
            onChange={(e) => setTrophyId(e.target.value)}
            className="w-full rounded-lg border border-secondary bg-secondary/30 px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            required
          >
            <option value="">Selecciona un trofeo</option>
            {trophies.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </Label>
        <Label>
          <LabelText>Mensaje</LabelText>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Explica por qué deberías recibir este trofeo..."
            className="min-h-[80px] w-full rounded-lg border border-secondary bg-secondary/30 px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            required
          />
        </Label>
        <Label>
          <LabelText>Prueba visual (opcional)</LabelText>
          <TrophyImageUpload
            value={proofImageUrl}
            onChange={(url) => setProofImageUrl(url)}
            onRemove={() => setProofImageUrl(null)}
          />
        </Label>
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando…" : "Enviar solicitud"}
        </Button>
      </form>
    </div>
  );
}

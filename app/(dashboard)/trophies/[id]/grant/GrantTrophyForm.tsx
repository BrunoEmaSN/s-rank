"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, LabelText, Input, Alert } from "@/components/ui";
import { grantTrophy } from "../../actions";

export function GrantTrophyForm({ trophyId }: { trophyId: string }) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const id = userId.trim();
    if (!id) {
      setError("Indica el ID del usuario al que quieres otorgar el trofeo.");
      return;
    }
    setLoading(true);
    const result = await grantTrophy(trophyId, id);
    setLoading(false);
    if (result.ok) {
      router.push("/trophies");
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      {error && <Alert variant="error">{error}</Alert>}
      <Label>
        <LabelText>ID del usuario</LabelText>
        <Input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="ID del usuario (ej. clxxx...)"
          required
        />
        <span className="mt-1 text-xs text-foreground-muted">
          El usuario debe existir en la plataforma. Puedes obtener su ID desde tu panel o integraciones.
        </span>
      </Label>
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Otorgando…" : "Otorgar trofeo"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/trophies")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

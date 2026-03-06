"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, LabelText, Input, Alert } from "@/components/ui";

export function CreateCommunityForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          description: description.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al crear la comunidad");
        setLoading(false);
        return;
      }
      if (data.data?.id) {
        router.push(`/community/${data.data.id}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      {error && <Alert variant="error">{error}</Alert>}
      <Label>
        <LabelText>Nombre</LabelText>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Mi comunidad"
          required
        />
      </Label>
      <Label>
        <LabelText>Descripción (opcional)</LabelText>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe tu comunidad"
        />
      </Label>
      <Button type="submit" disabled={loading}>
        {loading ? "Creando…" : "Crear comunidad"}
      </Button>
    </form>
  );
}

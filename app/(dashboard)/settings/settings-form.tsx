"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input, Label, LabelText, Button, Alert } from "@/app/components/ui";

type Role = "streamer" | "sub";

export function SettingsForm({
  defaultName,
  defaultEmail,
  role,
}: {
  defaultName: string;
  defaultEmail: string;
  role: Role;
}) {
  const [name, setName] = useState(defaultName);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const { error } = await authClient.updateUser({ name });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message ?? "Error al actualizar" });
      return;
    }
    setMessage({ type: "success", text: "Nombre actualizado" });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpdateName} className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 md:max-w-xl">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Perfil</h2>
        {message && (
          <Alert variant={message.type} className="mb-4">
            {message.text}
          </Alert>
        )}
        <Label className="mb-4 block">
          <LabelText className="mb-1 block">Nombre</LabelText>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-primary"
          />
        </Label>
        <p className="mb-4 text-sm text-foreground-muted">Email: {defaultEmail}</p>
        <Button type="submit" disabled={loading} size="md">
          {loading ? "Guardando…" : "Guardar nombre"}
        </Button>
      </form>

      <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 md:max-w-xl">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Rol</h2>
        <p className="text-sm text-foreground-muted">
          Estás registrado como <span className="font-medium text-foreground">{role === "streamer" ? "Streamer" : "Suscriptor / Viewer"}</span>.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

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
          <div
            className={`mb-4 rounded-lg px-4 py-2 text-sm ${
              message.type === "success"
                ? "border border-green-500/50 bg-green-500/10 text-green-400"
                : "border border-red-500/50 bg-red-500/10 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-foreground">Nombre</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-secondary bg-primary px-4 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </label>
        <p className="mb-4 text-sm text-foreground-muted">Email: {defaultEmail}</p>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Guardando…" : "Guardar nombre"}
        </button>
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

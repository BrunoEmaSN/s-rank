"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Label, LabelText, Select, Alert } from "@/components/ui";

type Role = "streamer" | "sub";

export function OnboardingRoleForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("sub");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await authClient.updateUser({
      role,
      needsRoleSelection: false,
    } as Parameters<typeof authClient.updateUser>[0]);
    setLoading(false);
    if (err) {
      setError(err.message ?? "Error al guardar el rol");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert variant="error">{error}</Alert>}
      <Label>
        <LabelText>¿Qué eres?</LabelText>
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="sub">Suscriptor / Viewer</option>
          <option value="streamer">Streamer</option>
        </Select>
      </Label>
      <Button type="submit" disabled={loading} size="lg" className="mt-2">
        {loading ? "Guardando…" : "Continuar"}
      </Button>
    </form>
  );
}

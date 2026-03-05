"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Role = "streamer" | "sub";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("sub");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setLoading(true);
    const { data, error: err } = await authClient.signUp.email({
      name,
      email,
      password,
      role,
    } as Parameters<typeof authClient.signUp.email>[0]);
    setLoading(false);
    if (err) {
      setError(err.message ?? "Error al registrarse");
      return;
    }
    if (data) router.push("/dashboard");
  }

  return (
    <div className="w-full">
      <h1
        className="mb-2 text-center text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Crear cuenta
      </h1>
      <p className="mb-6 text-center text-foreground-muted">
        Únete a S-Rank y empieza a recompensar a tu comunidad
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Nombre</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-lg border border-secondary bg-secondary/50 px-4 py-2 text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Tu nombre"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-secondary bg-secondary/50 px-4 py-2 text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="tu@email.com"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="rounded-lg border border-secondary bg-secondary/50 px-4 py-2 text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Mínimo 8 caracteres"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Confirmar contraseña</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-lg border border-secondary bg-secondary/50 px-4 py-2 text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Repite la contraseña"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">¿Qué eres?</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded-lg border border-secondary bg-secondary/50 px-4 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="sub">Suscriptor / Viewer</option>
            <option value="streamer">Streamer</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-accent px-4 py-3 font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-foreground-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/sign-in" className="text-accent hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: err } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Error al iniciar sesión");
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
        Iniciar sesión
      </h1>
      <p className="mb-6 text-center text-foreground-muted">
        Accede a tu cuenta de S-Rank
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}
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
            className="rounded-lg border border-secondary bg-secondary/50 px-4 py-2 text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="••••••••"
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-secondary bg-secondary/50 text-accent focus:ring-accent"
          />
          <span className="text-sm text-foreground-muted">Recordarme</span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-accent px-4 py-3 font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-foreground-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/sign-up" className="text-accent hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

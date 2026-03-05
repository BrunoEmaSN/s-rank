"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Input,
  Label,
  LabelText,
  Button,
  Checkbox,
  Alert,
  Separator,
} from "@/app/components/ui";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<"google" | "twitch" | "kick" | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

  async function handleSocialSignIn(provider: "google" | "twitch") {
    setError(null);
    setSsoLoading(provider);
    const { data, error: err } = await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
    setSsoLoading(null);
    if (err) {
      setError(err.message ?? `Error al iniciar sesión con ${provider}`);
      return;
    }
    if (data?.url) window.location.href = data.url;
  }

  async function handleKickSignIn() {
    setError(null);
    setSsoLoading("kick");
    const { data, error: err } = await authClient.signIn.oauth2({
      providerId: "kick",
      callbackURL: "/dashboard",
    });
    setSsoLoading(null);
    if (err) {
      setError(err.message ?? "Error al iniciar sesión con Kick");
      return;
    }
    if (data?.url) window.location.href = data.url;
  }

  const ssoDisabled = loading || ssoLoading !== null;

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
        {error && <Alert variant="error">{error}</Alert>}
        <Label>
          <LabelText>Email</LabelText>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </Label>
        <Label>
          <LabelText>Contraseña</LabelText>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </Label>
        <Checkbox
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          label="Recordarme"
        />
        <Button type="submit" disabled={loading} size="lg" className="mt-2">
          {loading ? "Entrando…" : "Entrar"}
        </Button>

        <Separator>o continúa con</Separator>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={ssoDisabled}
            onClick={() => handleSocialSignIn("google")}
          >
            {ssoLoading === "google" ? (
              "Conectando…"
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={ssoDisabled}
            onClick={() => handleSocialSignIn("twitch")}
          >
            {ssoLoading === "twitch" ? (
              "Conectando…"
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                </svg>
                Twitch
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={ssoDisabled}
            onClick={handleKickSignIn}
          >
            {ssoLoading === "kick" ? (
              "Conectando…"
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4h2v4h-2zm0-6V7h2v4h-2z" />
                </svg>
                Kick
              </>
            )}
          </Button>
        </div>
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

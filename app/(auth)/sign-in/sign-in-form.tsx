"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@/hooks/use-auth-form";
import {
  Input,
  Label,
  LabelText,
  Button,
  Checkbox,
  Alert,
  Separator,
} from "@/components/ui";
import { SiGoogle, SiKick, SiTwitch } from "react-icons/si";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const {
    error,
    loading,
    ssoLoading,
    handleSubmit,
    handleSocialSignIn,
  } = useSignIn();

  const ssoDisabled = loading || ssoLoading !== null;

  const loadingSpinner = (
    <span
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden
    />
  );

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
      <form
        onSubmit={(e) =>
          handleSubmit({ e, email, password, rememberMe })
        }
        className="flex flex-col gap-4"
      >
        {error && <Alert variant="error">{error}</Alert>}
        <div className="flex gap-4 justify-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={ssoDisabled}
            onClick={() => handleSocialSignIn("google")}
          >
            {ssoLoading === "google" ? (
              loadingSpinner
            ) : (
              <SiGoogle className="h-5 w-5" />
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
              loadingSpinner
            ) : (
              <SiTwitch className="h-5 w-5" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={ssoDisabled}
            onClick={() => handleSocialSignIn("kick")}
          >
            {ssoLoading === "kick" ? (
              loadingSpinner
            ) : (
              <SiKick className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Separator>o continúa con</Separator>
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

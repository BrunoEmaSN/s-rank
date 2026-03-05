"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignUp } from "@/hooks/use-auth-form";
import {
  Input,
  Label,
  LabelText,
  Button,
  Select,
  Alert,
  Separator,
} from "@/components/ui";
import { SiGoogle, SiKick, SiTwitch } from "react-icons/si";

type Role = "streamer" | "sub";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("sub");
  const {
    error,
    loading,
    ssoLoading,
    handleSubmit,
    handleSocialSignIn,
  } = useSignUp();

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
        Crear cuenta
      </h1>
      <p className="mb-6 text-center text-foreground-muted">
        Únete a S-Rank y empieza a recompensar a tu comunidad
      </p>
      <form
        onSubmit={(e) =>
          handleSubmit({ e, name, email, password, confirmPassword, role })
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
            onClick={() => handleSocialSignIn("google", role)}
          >
            {ssoLoading === "google" ? loadingSpinner : <SiGoogle className="h-5 w-5" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={ssoDisabled}
            onClick={() => handleSocialSignIn("twitch", role)}
          >
            {ssoLoading === "twitch" ? loadingSpinner : <SiTwitch className="h-5 w-5" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={ssoDisabled}
            onClick={() => handleSocialSignIn("kick", role)}
          >
            {ssoLoading === "kick" ? loadingSpinner : <SiKick className="h-5 w-5" />}
          </Button>
        </div>
        <Separator>o regístrate con</Separator>
        <Label>
          <LabelText>Nombre</LabelText>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Tu nombre"
          />
        </Label>
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
            minLength={8}
            placeholder="Mínimo 8 caracteres"
          />
        </Label>
        <Label>
          <LabelText>Confirmar contraseña</LabelText>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repite la contraseña"
          />
        </Label>
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
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </Button>  
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

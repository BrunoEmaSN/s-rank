"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type SocialProvider = "google" | "twitch" | "kick";

export function useSignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<SocialProvider | null>(null);

  async function handleSubmit(params: {
    e: React.FormEvent<HTMLFormElement>;
    email: string;
    password: string;
    rememberMe: boolean;
  }) {
    const { e, email, password, rememberMe } = params;
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

  async function handleSocialSignIn(provider: SocialProvider) {
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

  return {
    error,
    setError,
    loading,
    ssoLoading,
    handleSubmit,
    handleSocialSignIn,
  };
}

type Role = "streamer" | "sub";

export function useSignUp() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<SocialProvider | null>(null);

  async function handleSubmit(params: {
    e: React.FormEvent;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: Role;
  }) {
    const { e, name, email, password, confirmPassword, role } = params;
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

  async function handleSocialSignIn(provider: SocialProvider, role: Role) {
    setError(null);
    setSsoLoading(provider);
    const { data, error: err } = await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
      additionalData: { role },
    });
    setSsoLoading(null);
    if (err) {
      setError(err.message ?? `Error al registrarse con ${provider}`);
      return;
    }
    if (data?.url) window.location.href = data.url;
  }

  return {
    error,
    setError,
    loading,
    ssoLoading,
    handleSubmit,
    handleSocialSignIn,
  };
}

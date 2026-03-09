"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Input, Label, LabelText, Button, Alert } from "@/components/ui";
import { inputBase } from "@/components/ui";
import { TrophyImageUpload } from "@/components/TrophyImageUpload";
import { SiTwitch, SiKick } from "react-icons/si";

type Role = "streamer" | "sub";

type LinkedAccount = { providerId: string; accountId: string; id: string };

const AUTH_BASE = "/api/auth";

export function SettingsForm({
  defaultName,
  defaultEmail,
  role,
  defaultBio,
  defaultBannerUrl,
}: {
  defaultName: string;
  defaultEmail: string;
  role: Role;
  defaultBio?: string;
  defaultBannerUrl?: string;
}) {
  const [name, setName] = useState(defaultName);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [bio, setBio] = useState(defaultBio ?? "");
  const [bannerUrl, setBannerUrl] = useState(defaultBannerUrl ?? "");
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [linkUnlinkLoading, setLinkUnlinkLoading] = useState<"twitch" | "kick" | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${AUTH_BASE}/list-accounts`, { credentials: "include" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as LinkedAccount[];
        if (!cancelled) setLinkedAccounts(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setLinkedAccounts([]);
      } finally {
        if (!cancelled) setAccountsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isLinked = (providerId: string) =>
    linkedAccounts.some((a) => a.providerId?.toLowerCase() === providerId.toLowerCase());

  async function handleLink(provider: "twitch" | "kick") {
    setLinkUnlinkLoading(provider);
    try {
      const res = await fetch(`${AUTH_BASE}/link-social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          provider,
          callbackURL: "/settings",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: { message?: string } };
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setProfileMessage({ type: "error", text: data?.error?.message ?? "Error al vincular" });
    } catch {
      setProfileMessage({ type: "error", text: "Error de conexión" });
    } finally {
      setLinkUnlinkLoading(null);
    }
  }

  async function handleUnlink(providerId: "twitch" | "kick") {
    setLinkUnlinkLoading(providerId);
    setProfileMessage(null);
    try {
      const res = await fetch(`${AUTH_BASE}/unlink-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ providerId }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: boolean; error?: { message?: string } };
      if (res.ok && data?.status !== false) {
        setLinkedAccounts((prev) => prev.filter((a) => a.providerId?.toLowerCase() !== providerId.toLowerCase()));
      } else {
        setProfileMessage({ type: "error", text: data?.error?.message ?? "Error al desvincular" });
      }
    } catch {
      setProfileMessage({ type: "error", text: "Error de conexión" });
    } finally {
      setLinkUnlinkLoading(null);
    }
  }

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

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMessage(null);
    setProfileLoading(true);
    try {
      const res = await fetch("/api/users/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: bio.trim() || null,
          bannerUrl: bannerUrl.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setProfileMessage({ type: "error", text: data.error ?? "Error al actualizar el perfil" });
        return;
      }
      setProfileMessage({ type: "success", text: "Perfil actualizado" });
    } catch {
      setProfileMessage({ type: "error", text: "Error de conexión" });
    } finally {
      setProfileLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpdateName} className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Cuenta</h2>
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

      <form onSubmit={handleUpdateProfile} className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Perfil público</h2>
        {profileMessage && (
          <Alert variant={profileMessage.type} className="mb-4">
            {profileMessage.text}
          </Alert>
        )}
        <Label className="mb-4 block">
          <LabelText className="mb-1 block">Bio</LabelText>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Cuéntanos algo sobre ti"
            className={`${inputBase} w-full resize-y bg-primary`}
          />
          <p className="mt-1 text-xs text-foreground-muted">{bio.length}/500</p>
        </Label>
        <Label className="mb-4 block">
          <LabelText className="mb-1 block">Banner</LabelText>
          <TrophyImageUpload
            value={bannerUrl || null}
            onChange={(url) => setBannerUrl(url)}
            onRemove={() => setBannerUrl("")}
            className="mt-1"
          />
        </Label>
        <div className="mb-4">
          <LabelText className="mb-2 block">Plataformas vinculadas</LabelText>
          <p className="mb-3 text-sm text-foreground-muted">
            Vincula tu cuenta de Twitch o Kick con SSO para mostrarlas en tu perfil.
          </p>
          {accountsLoading ? (
            <p className="text-sm text-foreground-muted">Cargando…</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4 rounded-lg border border-secondary/80 bg-secondary/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#9146ff]/20 text-[#9146ff]">
                    <SiTwitch className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-foreground">Twitch</span>
                </div>
                {isLinked("twitch") ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={linkUnlinkLoading !== null}
                    onClick={() => handleUnlink("twitch")}
                  >
                    {linkUnlinkLoading === "twitch" ? "…" : "Desvincular"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={linkUnlinkLoading !== null}
                    onClick={() => handleLink("twitch")}
                  >
                    {linkUnlinkLoading === "twitch" ? "…" : "Vincular"}
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-secondary/80 bg-secondary/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#53fc18]/20 text-[#53fc18]">
                    <SiKick className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-foreground">Kick</span>
                </div>
                {isLinked("kick") ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={linkUnlinkLoading !== null}
                    onClick={() => handleUnlink("kick")}
                  >
                    {linkUnlinkLoading === "kick" ? "…" : "Desvincular"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={linkUnlinkLoading !== null}
                    onClick={() => handleLink("kick")}
                  >
                    {linkUnlinkLoading === "kick" ? "…" : "Vincular"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <Button type="submit" disabled={profileLoading} size="md">
          {profileLoading ? "Guardando…" : "Guardar perfil"}
        </Button>
      </form>

      <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Rol</h2>
        <p className="text-sm text-foreground-muted">
          Estás registrado como <span className="font-medium text-foreground">{role === "streamer" ? "Streamer" : "Suscriptor / Viewer"}</span>.
        </p>
      </div>
    </div>
  );
}

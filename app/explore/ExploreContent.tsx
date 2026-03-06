"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { TrophyIcon } from "@/components/icons";
import { Footer } from "@/components/Footer";
import { useChannelsStore } from "@/store/useChannelsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Channel } from "@/types/channel";

export function ExploreContent() {
  const {
    channels,
    pagination,
    filters,
    loading,
    error,
    fetchChannels,
    setFilters,
    setPage,
  } = useChannelsStore();

  const [followingIds, setFollowingIds] = useState<Set<string> | null>(null);
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  const loadChannels = useCallback(
    (opts?: { page?: number; platform?: string; search?: string }) => {
      fetchChannels(opts);
    },
    [fetchChannels]
  );

  useEffect(() => {
    loadChannels();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/users/me/following/ids")
      .then((res) => {
        if (cancelled) return;
        if (res.ok) return res.json().then((data: { streamerIds: string[] }) => data.streamerIds);
        return [];
      })
      .then((ids) => {
        if (cancelled) return;
        setFollowingIds(ids ? new Set(ids) : new Set());
      })
      .catch(() => {
        if (!cancelled) setFollowingIds(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadChannels({ page: 1, platform: filters.platform || undefined, search: filters.search || undefined });
  };

  const handlePlatformChange = (value: string) => {
    setFilters({ platform: value });
    setPage(1);
    loadChannels({ page: 1, platform: value || undefined, search: filters.search || undefined });
  };

  const goToPage = (page: number) => {
    setPage(page);
    loadChannels({
      page,
      platform: filters.platform || undefined,
      search: filters.search || undefined,
    });
  };

  const handleFollow = async (channel: Channel) => {
    setFollowLoading(channel.id);
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamerId: channel.userId }),
      });
      if (res.status === 401) {
        window.location.href = "/sign-in?callbackUrl=" + encodeURIComponent("/explore");
        return;
      }
      if (!res.ok) throw new Error("Error al seguir");
      setFollowingIds((prev) =>
        prev === null ? new Set([channel.userId]) : new Set([...prev, channel.userId])
      );
    } finally {
      setFollowLoading(null);
    }
  };

  const handleUnfollow = async (channel: Channel) => {
    setFollowLoading(channel.id);
    try {
      const res = await fetch(
        "/api/follows?streamerId=" + encodeURIComponent(channel.userId),
        { method: "DELETE" }
      );
      if (res.status === 401) {
        window.location.href = "/sign-in?callbackUrl=" + encodeURIComponent("/explore");
        return;
      }
      if (!res.ok) throw new Error("Error al dejar de seguir");
      setFollowingIds((prev) => {
        if (prev === null) return prev;
        const next = new Set(prev);
        next.delete(channel.userId);
        return next;
      });
    } finally {
      setFollowLoading(null);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 md:px-8">
      <h1
        className="mb-2 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Explorar canales
      </h1>
      <p className="mb-8 text-foreground-muted">
        Descubre streamers con sistema de trofeos. Conecta y desbloquea logros.
      </p>

      <form onSubmit={handleSearchSubmit} className="mb-8 flex flex-wrap items-end gap-4">
        <div className="min-w-[200px] flex-1">
          <Label htmlFor="search" className="mb-1 block text-sm text-foreground-muted">
            Buscar por nombre
          </Label>
          <Input
            id="search"
            type="search"
            placeholder="Nombre del canal..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-[160px]">
          <Label htmlFor="platform" className="mb-1 block text-sm text-foreground-muted">
            Plataforma
          </Label>
          <Select
            id="platform"
            value={filters.platform}
            onChange={(e) => handlePlatformChange(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="Twitch">Twitch</option>
            <option value="Kick">Kick</option>
          </Select>
        </div>
        <Button type="submit" variant="outline">
          Buscar
        </Button>
      </form>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <span className="text-foreground-muted">Cargando canales...</span>
        </div>
      )}

      {!loading && channels.length === 0 && !error && (
        <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-12 text-center text-foreground-muted">
          No hay canales que coincidan con los filtros. Prueba otra búsqueda o plataforma.
        </div>
      )}

      {!loading && channels.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => {
              const isFollowing = followingIds !== null && followingIds.has(channel.userId);
              const isLoading = followLoading === channel.id;
              return (
                <div
                  key={channel.id}
                  className="flex flex-col rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/30"
                >
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <TrophyIcon className="h-6 w-6 text-accent" aria-hidden />
                  </div>
                  <h2 className="font-semibold text-foreground">{channel.name}</h2>
                  <p className="text-sm text-foreground-muted">{channel.platform}</p>
                  <p className="mt-1 text-xs text-accent">{channel.trophies} trofeos</p>
                  {channel.communityId && (
                    <Link
                      href={`/community/${channel.communityId}`}
                      className="mt-2 inline-block text-sm text-accent hover:underline"
                    >
                      Ver comunidad
                    </Link>
                  )}
                  <div className="mt-4 flex-1">
                    {isFollowing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => handleUnfollow(channel)}
                        className="w-full"
                      >
                        {isLoading ? "..." : "Dejar de seguir"}
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => handleFollow(channel)}
                        className="w-full"
                      >
                        {isLoading ? "..." : "Seguir"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
              aria-label="Paginación"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Anterior
              </Button>
              <span className="px-3 text-sm text-foreground-muted">
                Página {pagination.page} de {pagination.totalPages} ({pagination.total} canales)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Siguiente
              </Button>
            </nav>
          )}
        </>
      )}

      <Footer />
    </main>
  );
}

"use client";

import { useEffect, useCallback } from "react";
import { TrophyIcon } from "@/components/icons";
import { Footer } from "@/components/Footer";
import { useChannelsStore } from "@/store/useChannelsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

  const loadChannels = useCallback(
    (opts?: { page?: number; platform?: string; search?: string }) => {
      fetchChannels(opts);
    },
    [fetchChannels]
  );

  useEffect(() => {
    loadChannels();
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
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
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/30"
              >
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <TrophyIcon className="h-6 w-6 text-accent" aria-hidden />
                </div>
                <h2 className="font-semibold text-foreground">{channel.name}</h2>
                <p className="text-sm text-foreground-muted">{channel.platform}</p>
                <p className="mt-1 text-xs text-accent">{channel.trophies} trofeos</p>
              </div>
            ))}
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

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TrophyIcon } from "@/components/icons";
import { IoArrowForward } from "react-icons/io5";
import { useCompletistStore } from "@/store/useCompletistStore";

export function CompletistExhibitor() {
  const {
    canales,
    totalCanalesCompletados,
    totalTrofeosEnCompletados,
    loaded,
    loading,
    fetchCompletist,
  } = useCompletistStore();

  useEffect(() => {
    fetchCompletist();
  }, [fetchCompletist]);

  const showPlaceholder = !loaded && loading;

  return (
    <section className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
      <h2
        className="mb-4 text-lg font-semibold text-foreground-muted"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Completista
      </h2>
      <p className="mb-6 text-sm text-foreground-muted">
        Canales en los que has desbloqueado todos los trofeos.
      </p>

      {showPlaceholder ? (
        <div className="rounded-xl border border-secondary/80 bg-primary/50 py-12 text-center">
          <div className="mx-auto mb-3 h-12 w-12 animate-pulse rounded-full bg-secondary" />
          <p className="text-sm text-foreground-muted">Cargando...</p>
        </div>
      ) : canales.length === 0 ? (
        <div className="rounded-xl border border-secondary/80 bg-primary/50 py-12 text-center">
          <TrophyIcon
            className="mx-auto mb-3 h-12 w-12 text-foreground-muted"
            aria-hidden
          />
          <p className="mb-1 font-medium text-foreground">
            Aún no has completado ningún canal
          </p>
          <p className="text-sm text-foreground-muted">
            Desbloquea todos los trofeos de un canal para que aparezca aquí.
          </p>
          <Link
            href="/my-trophies"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Ver mis trofeos <IoArrowForward className="size-5" />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {canales.map((canal) => (
              <Link
                key={canal.streamerId}
                href="/my-trophies"
                className="group block overflow-hidden rounded-xl border border-secondary/80 bg-primary transition hover:border-accent/50"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-secondary/50">
                  {canal.avatarUrl ? (
                    <img
                      src={canal.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-3xl font-semibold text-foreground-muted">
                      {canal.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-accent px-3 py-2">
                    <span className="text-sm font-medium text-accent-foreground">
                      {canal.totalTrophies} / {canal.totalTrophies} trofeos
                    </span>
                    <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#fbbf24] text-accent">
                      <TrophyIcon className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-foreground">
                    {canal.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-8 border-t border-secondary/80 pt-6">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {totalCanalesCompletados}
              </p>
              <p className="text-sm text-foreground-muted">
                Canales completados
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {totalTrofeosEnCompletados}
              </p>
              <p className="text-sm text-foreground-muted">
                Trofeos en canales completados
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

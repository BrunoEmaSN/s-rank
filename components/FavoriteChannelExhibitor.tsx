"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CrownedHeartIcon, TrophyIcon } from "@/components/icons";
import type { CanalFavorito } from "@/lib/favorite-channel";
import { IoArrowForward } from "react-icons/io5";
import { useFavoriteChannelStore } from "@/store/useFavoriteChannelStore";

export function FavoriteChannelExhibitor() {
  const { canal, loaded, loading, fetchFavoriteChannel } =
    useFavoriteChannelStore();

  useEffect(() => {
    fetchFavoriteChannel();
  }, [fetchFavoriteChannel]);

  const showPlaceholder = !loaded && loading;
  const displayCanal = showPlaceholder ? undefined : canal;

  const progressPercent =
    displayCanal != null && displayCanal.trophiesTotal > 0
      ? Math.round(
          (displayCanal.trophiesUnlocked / displayCanal.trophiesTotal) * 100
        )
      : 0;

  return (
    <section className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
      <h2
        className="mb-4 text-lg font-semibold text-foreground-muted"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Canal favorito
      </h2>

      {showPlaceholder ? (
        <div className="rounded-xl border border-secondary/80 bg-primary/50 py-12 text-center">
          <div className="mx-auto mb-3 h-12 w-12 animate-pulse rounded-full bg-secondary" />
          <p className="mb-1 text-sm text-foreground-muted">Cargando...</p>
        </div>
      ) : !displayCanal ? (
        <div className="rounded-xl border border-secondary/80 bg-primary/50 py-12 text-center">
          <CrownedHeartIcon
            className="mx-auto mb-3 h-12 w-12 text-foreground-muted"
            aria-hidden
          />
          <p className="mb-1 font-medium text-foreground">
            Aún no tienes canal favorito
          </p>
          <p className="text-sm text-foreground-muted">
            Sigue canales y desbloquea trofeos; el que más avance tendrá
            aparecerá aquí.
          </p>
          <Link
            href="/explore"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Explorar canales <IoArrowForward className="size-5" />
          </Link>
        </div>
      ) : (
        <Link
          href="/my-trophies"
          className="group flex flex-col overflow-hidden rounded-xl border border-secondary/80 bg-primary transition hover:border-accent/50 sm:flex-row"
        >
          <div className="relative h-40 w-full shrink-0 overflow-hidden bg-secondary/50 sm:h-36 sm:w-48">
            {displayCanal.avatarUrl ? (
              <img
                src={displayCanal.avatarUrl}
                alt=""
                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary text-4xl font-semibold text-foreground-muted sm:text-3xl">
                {displayCanal.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
            <div>
              <p className="text-lg font-semibold text-foreground">
                {displayCanal.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-6">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {displayCanal.watchHours}
                  </p>
                  <p className="text-sm text-foreground-muted">Horas vistas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {displayCanal.trophiesUnlocked}
                  </p>
                  <p className="text-sm text-foreground-muted">Trofeos</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium text-foreground-muted">
                Avance en los trofeos
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-sm font-medium tabular-nums text-foreground">
                  {displayCanal.trophiesUnlocked} de {displayCanal.trophiesTotal}
                </span>
                {displayCanal.trophiesTotal > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <TrophyIcon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-foreground-muted">
              <TrophyIcon className="h-4 w-4 text-accent" aria-hidden />
              <span>Ver trofeos de este canal</span>
            </div>
          </div>
        </Link>
      )}
    </section>
  );
}

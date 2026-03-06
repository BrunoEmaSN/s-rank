import Link from "next/link";
import { CrownedHeartIcon, TrophyIcon } from "@/components/icons";
import type { CanalFavorito } from "@/lib/favorite-channel";
import { IoArrowForward } from "react-icons/io5";

type FavoriteChannelExhibitorProps = {
  canal: CanalFavorito | null;
};

export function FavoriteChannelExhibitor({ canal }: FavoriteChannelExhibitorProps) {
  const progressPercent =
    canal != null && canal.trophiesTotal > 0
      ? Math.round((canal.trophiesUnlocked / canal.trophiesTotal) * 100)
      : 0;

  return (
    <section className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
      <h2
        className="mb-4 text-lg font-semibold text-foreground-muted"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Canal favorito
      </h2>

      {!canal ? (
        <div className="rounded-xl border border-secondary/80 bg-primary/50 py-12 text-center">
          <CrownedHeartIcon
            className="mx-auto mb-3 h-12 w-12 text-foreground-muted"
            aria-hidden
          />
          <p className="mb-1 font-medium text-foreground">
            Aún no tienes canal favorito
          </p>
          <p className="text-sm text-foreground-muted">
            Sigue canales y desbloquea trofeos; el que más avance tendrá aparecerá aquí.
          </p>
          <Link
            href="/explore"
            className="mt-4 text-sm font-medium text-accent hover:underline flex justify-center items-center gap-1"
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
          {canal.avatarUrl ? (
            <img
              src={canal.avatarUrl}
              alt=""
              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary text-4xl font-semibold text-foreground-muted sm:text-3xl">
              {canal.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div>
            <p className="text-lg font-semibold text-foreground">{canal.name}</p>
            <div className="mt-3 flex flex-wrap gap-6">
              <div>
                <p className="text-2xl font-bold text-foreground">{canal.watchHours}</p>
                <p className="text-sm text-foreground-muted">Horas vistas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{canal.trophiesUnlocked}</p>
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
              <span className="text-sm font-medium text-foreground tabular-nums">
                {canal.trophiesUnlocked} de {canal.trophiesTotal}
              </span>
              {canal.trophiesTotal > 0 && (
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

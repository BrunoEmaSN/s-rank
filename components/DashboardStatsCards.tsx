"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TrophyIcon, ChartIcon, PeopleIcon } from "@/components/icons";
import { IoArrowForward } from "react-icons/io5";
import { useDashboardStatsStore } from "@/store/useDashboardStatsStore";

type DashboardStatsCardsProps = {
  role: "streamer" | "sub";
};

export function DashboardStatsCards({ role }: DashboardStatsCardsProps) {
  const {
    followingCount,
    followersCount,
    unlockedTrophiesCount,
    loaded,
    loading,
    fetchStats,
  } = useDashboardStatsStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const showPlaceholder = !loaded && loading;
  const following = showPlaceholder ? "—" : followingCount;
  const followers = showPlaceholder ? "—" : followersCount;
  const unlocked = showPlaceholder ? "—" : unlockedTrophiesCount;

  if (role === "streamer") {
    return (
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/trophies"
          className="block min-w-0 rounded-xl border border-secondary/80 bg-secondary/50 p-4 transition hover:border-accent/50 hover:bg-secondary/70 sm:p-6"
        >
          <TrophyIcon className="mb-2 h-8 w-8 text-accent sm:mb-3 sm:h-10 sm:w-10" aria-hidden />
          <h2 className="mb-1 text-sm font-semibold text-foreground sm:text-base">Trofeos creados</h2>
          <p className="text-xs text-foreground-muted sm:text-sm">
            Crea y gestiona trofeos para tu comunidad.
          </p>
          <p className="mt-2 flex flex-wrap items-center justify-end gap-1 text-lg font-bold text-accent sm:text-2xl">
            Ver trofeos <IoArrowForward className="size-5 shrink-0" />
          </p>
        </Link>
        <div className="min-w-0 rounded-xl border border-secondary/80 bg-secondary/50 p-4 sm:p-6">
          <ChartIcon className="mb-2 h-8 w-8 text-accent sm:mb-3 sm:h-10 sm:w-10" aria-hidden />
          <h2 className="mb-1 text-sm font-semibold text-foreground sm:text-base">Estadísticas</h2>
          <p className="text-xs text-foreground-muted sm:text-sm">
            Desbloqueos y engagement de tus suscriptores.
          </p>
          <p className="mt-2 text-lg font-bold text-accent sm:text-2xl">—</p>
        </div>
        <Link
          href="/followers"
          className="block min-w-0 rounded-xl border border-secondary/80 bg-secondary/50 p-4 transition hover:border-accent/50 hover:bg-secondary/70 sm:p-6"
        >
          <PeopleIcon className="mb-2 h-8 w-8 text-accent sm:mb-3 sm:h-10 sm:w-10" aria-hidden />
          <h2 className="mb-1 text-sm font-semibold text-foreground sm:text-base">Seguidores</h2>
          <p className="text-xs text-foreground-muted sm:text-sm">
            Usuarios que te siguen.
          </p>
          <p className="mt-2 flex flex-wrap items-center justify-end gap-1 text-lg font-bold text-accent sm:text-2xl">
            {followers} <IoArrowForward className="size-5 shrink-0" />
          </p>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
      <Link
        href="/my-trophies"
        className="block min-w-0 rounded-xl border border-secondary/80 bg-secondary/50 p-4 transition hover:border-accent/50 hover:bg-secondary/70 sm:p-6"
      >
        <TrophyIcon className="mb-2 h-8 w-8 text-accent sm:mb-3 sm:h-10 sm:w-10" aria-hidden />
        <h2 className="mb-1 text-sm font-semibold text-foreground sm:text-base">
          Trofeos desbloqueados
        </h2>
        <p className="text-xs text-foreground-muted sm:text-sm">
          Tu progreso en los canales que sigues.
        </p>
        <p className="mt-2 flex flex-wrap items-center justify-end gap-1 text-lg font-bold text-accent sm:text-2xl">
          {unlocked} <IoArrowForward className="size-5 shrink-0" />
        </p>
      </Link>
      <Link
        href="/following"
        className="block min-w-0 rounded-xl border border-secondary/80 bg-secondary/50 p-4 transition hover:border-accent/50 hover:bg-secondary/70 sm:p-6"
      >
        <PeopleIcon className="mb-2 h-8 w-8 text-accent sm:mb-3 sm:h-10 sm:w-10" aria-hidden />
        <h2 className="mb-1 text-sm font-semibold text-foreground sm:text-base">
          Canales seguidos
        </h2>
        <p className="text-xs text-foreground-muted sm:text-sm">
          Explora canales y desbloquea trofeos.
        </p>
        <p className="mt-2 flex flex-wrap items-center justify-end gap-1 text-lg font-bold text-accent sm:text-2xl">
          {following} <IoArrowForward className="size-5 shrink-0" />
        </p>
      </Link>
    </div>
  );
}

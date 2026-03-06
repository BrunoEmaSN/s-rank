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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/trophies"
          className="block rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/50 hover:bg-secondary/70"
        >
          <TrophyIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
          <h2 className="mb-1 font-semibold text-foreground">Trofeos creados</h2>
          <p className="text-sm text-foreground-muted">
            Crea y gestiona trofeos para tu comunidad.
          </p>
          <p className="mt-2 flex items-center justify-end gap-1 text-2xl font-bold text-accent">
            Ver trofeos <IoArrowForward className="size-5" />
          </p>
        </Link>
        <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
          <ChartIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
          <h2 className="mb-1 font-semibold text-foreground">Estadísticas</h2>
          <p className="text-sm text-foreground-muted">
            Desbloqueos y engagement de tus suscriptores.
          </p>
          <p className="mt-2 text-2xl font-bold text-accent">—</p>
        </div>
        <Link
          href="/followers"
          className="block rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/50 hover:bg-secondary/70"
        >
          <PeopleIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
          <h2 className="mb-1 font-semibold text-foreground">Seguidores</h2>
          <p className="text-sm text-foreground-muted">
            Usuarios que te siguen.
          </p>
          <p className="mt-2 flex items-center justify-end gap-1 text-2xl font-bold text-accent">
            {followers} <IoArrowForward className="size-5" />
          </p>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Link
        href="/my-trophies"
        className="block rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/50 hover:bg-secondary/70"
      >
        <TrophyIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
        <h2 className="mb-1 font-semibold text-foreground">
          Trofeos desbloqueados
        </h2>
        <p className="text-sm text-foreground-muted">
          Tu progreso en los canales que sigues.
        </p>
        <p className="mt-2 flex items-center justify-end gap-1 text-2xl font-bold text-accent">
          {unlocked} <IoArrowForward className="size-5" />
        </p>
      </Link>
      <Link
        href="/following"
        className="block rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/50 hover:bg-secondary/70"
      >
        <PeopleIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
        <h2 className="mb-1 font-semibold text-foreground">
          Canales seguidos
        </h2>
        <p className="text-sm text-foreground-muted">
          Explora canales y desbloquea trofeos.
        </p>
        <p className="mt-2 flex items-center justify-end gap-1 text-2xl font-bold text-accent">
          {following} <IoArrowForward className="size-5" />
        </p>
      </Link>
    </div>
  );
}

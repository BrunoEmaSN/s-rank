"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrophyIcon, TvIcon } from "@/components/icons";
import type { RecommendedChannel } from "@/lib/recommended-channels";
import { IoArrowForward } from "react-icons/io5";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

type RecommendedChannelsCarouselProps = {
  channels: RecommendedChannel[];
};

/** Número de tarjetas visibles según ancho: 1 en móvil, 2 en tablet, 3 en desktop */
function useVisibleCount() {
  const [visibleCount, setVisibleCount] = useState(1);
  useEffect(() => {
    const mq1 = window.matchMedia("(min-width: 1024px)");
    const mq2 = window.matchMedia("(min-width: 640px)");
    const update = () => {
      if (mq1.matches) setVisibleCount(3);
      else if (mq2.matches) setVisibleCount(2);
      else setVisibleCount(1);
    };
    update();
    mq1.addEventListener("change", update);
    mq2.addEventListener("change", update);
    return () => {
      mq1.removeEventListener("change", update);
      mq2.removeEventListener("change", update);
    };
  }, []);
  return visibleCount;
}

export function RecommendedChannelsCarousel({ channels }: RecommendedChannelsCarouselProps) {
  const visibleCount = useVisibleCount();
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(channels.length / visibleCount));

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, totalPages - 1)));
  }, [totalPages, visibleCount]);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));
  const start = page * visibleCount;
  const visibleChannels = channels.slice(start, start + visibleCount);

  return (
    <section className="min-w-0 rounded-xl border border-secondary/80 bg-secondary/50 p-4 sm:p-6">
      <div className="mb-3 flex min-w-0 items-center justify-between gap-2 sm:mb-4">
        <h2
          className="min-w-0 truncate text-base font-semibold text-foreground-muted sm:text-lg"
          style={{ fontFamily: "var(--font-zen-kaku)" }}
        >
          Canales recomendados
        </h2>
        {channels.length > 0 && (
          <Link
            href="/explore"
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Ver todos
            <IoArrowForward className="size-5" />
          </Link>
        )}
      </div>

      {channels.length === 0 ? (
        <div className="rounded-xl border border-secondary/80 bg-primary/50 py-12 text-center">
          <TvIcon
            className="mx-auto mb-3 h-12 w-12 text-foreground-muted"
            aria-hidden
          />
          <p className="mb-1 font-medium text-foreground">
            Aún no hay canales recomendados
          </p>
          <p className="text-sm text-foreground-muted">
            Cuando existan canales con trofeos, aparecerán aquí.
          </p>
          <Link
            href="/explore"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Explorar canales <IoArrowForward className="size-5" />
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={page <= 0}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary/80 bg-primary text-foreground shadow transition hover:enabled:bg-secondary/80 disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Anterior"
          >
            <HiOutlineChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <div
            className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
            aria-label="Carrusel de canales recomendados"
          >
            {visibleChannels.map((ch) => (
              <Link
                key={ch.id}
                href="/explore"
                className="group flex min-w-0 flex-col items-center rounded-xl border border-secondary/80 bg-primary p-4 transition hover:border-accent/50"
              >
                <div className="mb-2 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary">
                  {ch.avatarUrl ? (
                    <img
                      src={ch.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-foreground-muted">
                      {(ch.displayName ?? ch.name).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="w-full truncate text-center text-sm font-medium text-foreground">
                  {ch.displayName ?? ch.name}
                </p>
                <p className="mt-0.5 text-xs text-foreground-muted">{ch.platform}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-accent">
                  <TrophyIcon className="h-3.5 w-3.5" aria-hidden />
                  {ch.trophies} trofeos
                </p>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={page >= totalPages - 1}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary/80 bg-primary text-foreground shadow transition hover:enabled:bg-secondary/80 disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Siguiente"
          >
            <HiOutlineChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
    </section>
  );
}

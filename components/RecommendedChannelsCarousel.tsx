"use client";

import { useRef } from "react";
import Link from "next/link";
import { TrophyIcon, TvIcon } from "@/components/icons";
import type { RecommendedChannel } from "@/lib/recommended-channels";
import { IoArrowForward } from "react-icons/io5";

type RecommendedChannelsCarouselProps = {
  channels: RecommendedChannel[];
};

const CARD_WIDTH = 180;
const GAP = 16;

export function RecommendedChannelsCarousel({ channels }: RecommendedChannelsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = CARD_WIDTH + GAP;
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="text-lg font-semibold text-foreground-muted"
          style={{ fontFamily: "var(--font-zen-kaku)" }}
        >
          Canales recomendados
        </h2>
        {channels.length > 0 && (
          <Link
            href="/explore"
            className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
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
            className="mt-4 text-sm font-medium text-accent hover:underline flex justify-center items-center gap-1"
          >
            Explorar canales <IoArrowForward className="size-5" />
          </Link>
        </div>
      ) : (
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-thin"
          style={{
            scrollSnapType: "x proximity",
            scrollbarWidth: "thin",
          }}
          aria-label="Carrusel de canales recomendados"
        >
          {channels.map((ch) => (
            <Link
              key={ch.id}
              href="/explore"
              className="group flex w-[180px] shrink-0 flex-col items-center rounded-xl border border-secondary/80 bg-primary p-4 transition hover:border-accent/50"
              style={{ scrollSnapAlign: "start" }}
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

        {channels.length > 2 && (
          <>
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-secondary/80 bg-primary/95 text-foreground shadow-md transition hover:bg-secondary/80 md:flex"
              aria-label="Anterior"
            >
              <span className="text-lg leading-none" aria-hidden>‹</span>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-secondary/80 bg-primary/95 text-foreground shadow-md transition hover:bg-secondary/80 md:flex"
              aria-label="Siguiente"
            >
              <span className="text-lg leading-none" aria-hidden>›</span>
            </button>
          </>
        )}
      </div>
      )}
    </section>
  );
}

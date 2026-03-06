"use client";

import { useRef } from "react";
import Link from "next/link";
import type { RecommendedCommunity } from "@/lib/community";
import { IoArrowForward } from "react-icons/io5";

type RecommendedCommunitiesProps = {
  communities: RecommendedCommunity[];
};

const CARD_WIDTH = 200;
const GAP = 16;

export function RecommendedCommunities({ communities }: RecommendedCommunitiesProps) {
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
          Comunidades recomendadas
        </h2>
        {communities.length > 0 && (
          <Link
            href="/explore"
            className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Explorar canales
            <IoArrowForward className="size-5" />
          </Link>
        )}
      </div>

      {communities.length === 0 ? (
        <div className="rounded-xl border border-secondary/80 bg-primary/50 py-12 text-center">
          <p className="mb-1 font-medium text-foreground">
            No hay más comunidades recomendadas
          </p>
          <p className="text-sm text-foreground-muted">
            Sigue a más streamers para ver sus comunidades aquí.
          </p>
          <Link
            href="/explore"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Explorar canales <IoArrowForward className="size-4" />
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
            aria-label="Carrusel de comunidades recomendadas"
          >
            {communities.map((c) => (
              <Link
                key={c.id}
                href={`/community/${c.id}`}
                className="group flex w-[200px] shrink-0 flex-col rounded-xl border border-secondary/80 bg-primary p-4 transition hover:border-accent/50"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="mb-3 flex items-center gap-3">
                  {c.streamerAvatar ? (
                    <img
                      src={c.streamerAvatar}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-foreground-muted">
                      {(c.streamerName ?? "?").charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {c.name}
                    </p>
                    <p className="truncate text-xs text-foreground-muted">
                      {c.streamerName ?? "Streamer"}
                    </p>
                  </div>
                </div>
                {c.description && (
                  <p className="line-clamp-2 text-xs text-foreground-muted">
                    {c.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-foreground-muted">
                  {c.memberCount} {c.memberCount === 1 ? "miembro" : "miembros"}
                </p>
              </Link>
            ))}
          </div>

          {communities.length > 2 && (
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

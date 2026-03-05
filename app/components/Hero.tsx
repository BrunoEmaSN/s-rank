import Link from "next/link";
import { TrophyIcon } from "./icons";

export function Hero() {
  return (
    <section className="bg-primary px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <TrophyIcon className="mb-6 h-20 w-20 text-accent md:h-24 md:w-24" aria-hidden />
        <h1
          className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-zen-kaku)" }}
        >
          Sistema de trofeos para streamers
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-foreground-muted md:text-xl">
          Recompensa a tu comunidad con trofeos desbloqueables. Crea logros basados en horas de visualización, puntos,
          suscripciones y más. Integrado con Twitch y Kick.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground no-underline transition hover:opacity-90"
          >
            Comenzar gratis
          </Link>
          <Link
            href="#demo"
            className="rounded-lg border-2 border-accent bg-transparent px-6 py-3 text-base font-semibold text-accent no-underline transition hover:bg-accent/10"
          >
            Ver demo
          </Link>
        </div>
      </div>
    </section>
  );
}

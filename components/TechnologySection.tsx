import Link from "next/link";
import { TrophyIcon } from "./icons";

export function TechnologySection() {
  return (
    <section className="bg-primary px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2
              className="mb-2 text-2xl font-bold text-foreground md:text-3xl"
              style={{ fontFamily: "var(--font-zen-kaku)" }}
            >
              La tecnología
            </h2>
            <p className="mb-2 text-lg font-medium text-foreground-muted">Crear trofeos para trofeos personalizados</p>
            <p className="mb-6 text-foreground-muted">
              Crea bellos diseños para tus trofeos personalizados. Define criterios por horas de visualización, puntos del
              canal, suscripciones y eventos. Todo desde un panel intuitivo conectado a Twitch y Kick.
            </p>
            <Link
              href="/panel"
              className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground no-underline transition hover:opacity-90"
            >
              Crear trofeos
            </Link>
          </div>
          <div className="rounded-xl border border-secondary bg-secondary/80 p-6 md:p-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {["Oro", "Plata", "Bronce", "Estrella", "Insignia"].map((label, i) => (
                <div
                  key={label}
                  className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/80 text-accent"
                  title={label}
                >
                  <TrophyIcon className="h-7 w-7" />
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-primary/50 bg-primary/40 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground-muted">
                Editor de trofeo
              </p>
              <div className="space-y-2 text-sm text-foreground-muted">
                <div className="h-3 w-3/4 rounded bg-foreground-muted/20" />
                <div className="h-3 w-1/2 rounded bg-foreground-muted/20" />
                <div className="mt-4 flex gap-2">
                  <div className="h-8 w-20 rounded bg-accent/30" />
                  <div className="h-8 w-20 rounded border border-foreground-muted/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

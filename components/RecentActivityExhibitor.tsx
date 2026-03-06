import Link from "next/link";
import { TrophyIcon, TvIcon } from "@/components/icons";
import type { ActividadRecienteItem } from "@/lib/recent-activity";

type RecentActivityExhibitorProps = {
  items: ActividadRecienteItem[];
};

function formatLastUsed(date: Date | null): string {
  if (!date) return "Sin actividad reciente";
  return `Usado por última vez el ${date.toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase()}`;
}

export function RecentActivityExhibitor({ items }: RecentActivityExhibitorProps) {
  return (
    <section className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
      <h2
        className="mb-4 text-lg font-semibold text-foreground-muted"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Actividad reciente
      </h2>
      <p className="mb-6 text-sm text-foreground-muted">
        Canales en los que has desbloqueado trofeos o tienes horas vistas.
      </p>

      {items.length === 0 ? (
        <div className="rounded-xl border border-secondary/80 bg-primary/50 py-12 text-center">
          <TvIcon
            className="mx-auto mb-3 h-12 w-12 text-foreground-muted"
            aria-hidden
          />
          <p className="mb-1 font-medium text-foreground">
            Aún no hay actividad reciente
          </p>
          <p className="text-sm text-foreground-muted">
            Sigue canales y desbloquea trofeos para ver aquí tu actividad.
          </p>
          <Link
            href="/explore"
            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
          >
            Explorar canales →
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => {
              const progressPercent =
                item.trophiesTotal > 0
                  ? Math.round((item.trophiesUnlocked / item.trophiesTotal) * 100)
                  : 0;
              return (
                <li key={item.streamerId}>
                  <Link
                    href="/my-trophies"
                    className="group flex flex-col overflow-hidden rounded-xl border border-secondary/80 bg-primary transition hover:border-accent/50 sm:flex-row"
                  >
                    <div className="relative h-28 w-full shrink-0 overflow-hidden bg-secondary/50 sm:h-24 sm:w-32">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt=""
                          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-2xl font-semibold text-foreground-muted">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-4 sm:p-4">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="mt-0.5 text-sm text-foreground-muted">
                        {item.watchHours} h registradas
                      </p>
                      <p className="text-xs text-foreground-muted">
                        {formatLastUsed(item.lastActivityAt)}
                      </p>
                      <div className="mt-2">
                        <p className="mb-1 text-xs font-medium text-foreground-muted">
                          Avance en los trofeos
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-accent transition-all"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground tabular-nums">
                            {item.trophiesUnlocked} de {item.trophiesTotal}
                          </span>
                          {item.trophiesTotal > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent">
                              <TrophyIcon className="h-3 w-3" aria-hidden />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <nav
            className="mt-6 flex flex-wrap items-center gap-2 border-t border-secondary/80 pt-4 text-sm"
            aria-label="Enlaces de actividad"
          >
            <Link
              href="/following"
              className="font-medium text-accent hover:underline"
            >
              Ver canales seguidos
            </Link>
            <span className="text-foreground-muted">|</span>
            <Link
              href="/my-trophies"
              className="font-medium text-accent hover:underline"
            >
              Mis trofeos
            </Link>
          </nav>
        </>
      )}
    </section>
  );
}

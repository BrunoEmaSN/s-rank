import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { userTrophies, trophies, profiles } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { TrophyIcon } from "@/components/icons";
import { TrophyImage } from "@/components/TrophyImage";

type TrophyRow = {
  trophyId: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  earnedAt: Date | null;
  progress: number | null;
  isUnlocked: boolean | null;
  streamerId: string;
  streamerDisplayName: string | null;
  streamerUsername: string | null;
  streamerAvatarUrl: string | null;
};

export default async function MyTrophiesPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;

  const rows = await db
    .select({
      trophyId: userTrophies.trophyId,
      title: trophies.title,
      description: trophies.description,
      icon: trophies.icon,
      rarity: trophies.rarity,
      earnedAt: userTrophies.earnedAt,
      progress: userTrophies.progress,
      isUnlocked: userTrophies.isUnlocked,
      streamerId: trophies.streamerId,
      streamerDisplayName: profiles.displayName,
      streamerUsername: profiles.username,
      streamerAvatarUrl: profiles.avatarUrl,
    })
    .from(userTrophies)
    .innerJoin(trophies, eq(userTrophies.trophyId, trophies.id))
    .innerJoin(profiles, eq(trophies.streamerId, profiles.id))
    .where(eq(userTrophies.userId, userId))
    .orderBy(desc(userTrophies.earnedAt));

  const byStreamer = new Map<
    string,
    { name: string; avatarUrl: string | null; trophies: TrophyRow[] }
  >();

  for (const r of rows) {
    const name =
      r.streamerDisplayName ?? r.streamerUsername ?? "Streamer";
    if (!byStreamer.has(r.streamerId)) {
      byStreamer.set(r.streamerId, {
        name,
        avatarUrl: r.streamerAvatarUrl,
        trophies: [],
      });
    }
    byStreamer.get(r.streamerId)!.trophies.push({
      trophyId: r.trophyId,
      title: r.title,
      description: r.description,
      icon: r.icon,
      rarity: r.rarity,
      earnedAt: r.earnedAt,
      progress: r.progress,
      isUnlocked: r.isUnlocked,
      streamerId: r.streamerId,
      streamerDisplayName: r.streamerDisplayName,
      streamerUsername: r.streamerUsername,
      streamerAvatarUrl: r.streamerAvatarUrl,
    });
  }

  const streamerGroups = Array.from(byStreamer.entries());

  return (
    <div>
      <h1
        className="mb-2 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Mis trofeos
      </h1>
      <p className="mb-8 text-foreground-muted">
        Trofeos desbloqueados en los canales que sigues, agrupados por streamer.
      </p>

      {streamerGroups.length === 0 ? (
        <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-12 text-center">
          <TrophyIcon className="mx-auto mb-3 h-12 w-12 text-foreground-muted" aria-hidden />
          <p className="mb-2 font-medium text-foreground">Aún no tienes trofeos desbloqueados</p>
          <p className="text-sm text-foreground-muted">
            Sigue canales, participa y desbloquea trofeos viendo streams y cumpliendo requisitos.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {streamerGroups.map(([streamerId, { name, avatarUrl, trophies: list }]) => (
            <section
              key={streamerId}
              className="rounded-xl border border-secondary/80 bg-secondary/30 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-foreground-muted">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Trofeos de {name}
                </h2>
                <span className="text-sm text-foreground-muted">
                  {list.length} {list.length === 1 ? "trofeo" : "trofeos"}
                </span>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((t) => (
                  <li
                    key={t.trophyId}
                    className="rounded-xl border border-secondary/80 bg-secondary/50 p-4"
                  >
                    <TrophyImage
                      src={t.icon}
                      alt={t.title}
                      width={48}
                      height={48}
                      className="inline-block"
                    />
                    <h3 className="mt-2 font-semibold text-foreground">{t.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-foreground-muted">
                      {t.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs text-foreground-muted">
                        {t.rarity}
                      </span>
                      {t.isUnlocked && t.earnedAt && (
                        <span className="text-xs text-foreground-muted">
                          Desbloqueado{" "}
                          {new Date(t.earnedAt).toLocaleDateString("es", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

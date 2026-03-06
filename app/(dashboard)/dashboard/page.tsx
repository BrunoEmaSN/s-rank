import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { favoriteStreamers, userTrophies } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { TrophyIcon, ChartIcon, PeopleIcon } from "@/components/icons";
import { getRecommendedChannels } from "@/lib/recommended-channels";
import { RecommendedChannelsCarousel } from "@/components/RecommendedChannelsCarousel";
import { StreamerRecommendationsPanels } from "@/components/StreamerRecommendationsPanels";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user as {
    name?: string;
    email?: string;
    role?: string;
    needsRoleSelection?: boolean;
  } | undefined;
  const role = (user?.role as "streamer" | "sub") ?? "sub";
  const userId = session?.user?.id;

  const [followingCountRow, followersCountRow, unlockedTrophiesCountRow] = userId
    ? await Promise.all([
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(favoriteStreamers)
          .where(eq(favoriteStreamers.userId, userId)),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(favoriteStreamers)
          .where(eq(favoriteStreamers.streamerId, userId)),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(userTrophies)
          .where(
            and(
              eq(userTrophies.userId, userId),
              eq(userTrophies.isUnlocked, true)
            )
          ),
      ])
    : [[{ count: 0 }], [{ count: 0 }], [{ count: 0 }]];

  const followingCount = followingCountRow[0]?.count ?? 0;
  const followersCount = followersCountRow[0]?.count ?? 0;
  const unlockedTrophiesCount = unlockedTrophiesCountRow[0]?.count ?? 0;

  const recommendedChannels = role === "sub" ? await getRecommendedChannels(8) : [];

  return (
    <div>
      <h1
        className="mb-2 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Dashboard
      </h1>
      <p className="mb-8 text-foreground-muted">
        Hola, {user?.name ?? user?.email}. Estás como {role === "streamer" ? "streamer" : "suscriptor"}.
      </p>

      {role === "streamer" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/trophies"
            className="block rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/50 hover:bg-secondary/70"
          >
            <TrophyIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
            <h2 className="mb-1 font-semibold text-foreground">Trofeos creados</h2>
            <p className="text-sm text-foreground-muted">Crea y gestiona trofeos para tu comunidad.</p>
            <p className="mt-2 text-2xl font-bold text-accent">Ver trofeos →</p>
          </Link>
          <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
            <ChartIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
            <h2 className="mb-1 font-semibold text-foreground">Estadísticas</h2>
            <p className="text-sm text-foreground-muted">Desbloqueos y engagement de tus suscriptores.</p>
            <p className="mt-2 text-2xl font-bold text-accent">—</p>
          </div>
          <Link
            href="/followers"
            className="block rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/50 hover:bg-secondary/70"
          >
            <PeopleIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
            <h2 className="mb-1 font-semibold text-foreground">Seguidores</h2>
            <p className="text-sm text-foreground-muted">Usuarios que te siguen.</p>
            <p className="mt-2 text-2xl font-bold text-accent">{followersCount} →</p>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/my-trophies"
            className="block rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/50 hover:bg-secondary/70"
          >
            <TrophyIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
            <h2 className="mb-1 font-semibold text-foreground">Trofeos desbloqueados</h2>
            <p className="text-sm text-foreground-muted">Tu progreso en los canales que sigues.</p>
            <p className="mt-2 text-2xl font-bold text-accent">{unlockedTrophiesCount} →</p>
          </Link>
          <Link
            href="/following"
            className="block rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/50 hover:bg-secondary/70"
          >
            <PeopleIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
            <h2 className="mb-1 font-semibold text-foreground">Canales seguidos</h2>
            <p className="text-sm text-foreground-muted">Explora canales y desbloquea trofeos.</p>
            <p className="mt-2 text-2xl font-bold text-accent">{followingCount} →</p>
          </Link>
        </div>
      )}

      <div className="mt-8">
        {role === "streamer" ? (
          <StreamerRecommendationsPanels />
        ) : (
          <RecommendedChannelsCarousel channels={recommendedChannels} />
        )}
      </div>
    </div>
  );
}

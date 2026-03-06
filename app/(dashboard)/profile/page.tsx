import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { favoriteStreamers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { TrophyIcon } from "@/components/icons";
import { getCanalesCompletists } from "@/lib/completist";
import { getFavoriteChannel } from "@/lib/favorite-channel";
import { getRecentActivity } from "@/lib/recent-activity";
import { CompletistExhibitor } from "@/components/CompletistExhibitor";
import { FavoriteChannelExhibitor } from "@/components/FavoriteChannelExhibitor";
import { RecentActivityExhibitor } from "@/components/RecentActivityExhibitor";

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user as {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    needsRoleSelection?: boolean;
  } | undefined;
  const role = (user?.role as "streamer" | "sub") ?? "sub";
  const userId = session?.user?.id;

  const [followingCountRow, followersCountRow] = userId
    ? await Promise.all([
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(favoriteStreamers)
          .where(eq(favoriteStreamers.userId, userId)),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(favoriteStreamers)
          .where(eq(favoriteStreamers.streamerId, userId)),
      ])
    : [[{ count: 0 }], [{ count: 0 }]];

  const followingCount = followingCountRow[0]?.count ?? 0;
  const followersCount = followersCountRow[0]?.count ?? 0;

  const [favoriteChannel, completistData, recentActivity] =
    userId && role === "sub"
      ? await Promise.all([
          getFavoriteChannel(userId),
          getCanalesCompletists(userId),
          getRecentActivity(userId),
        ])
      : userId
        ? [null, { canales: [], totalCanalesCompletados: 0, totalTrofeosEnCompletados: 0 }, await getRecentActivity(userId)]
        : [null, { canales: [], totalCanalesCompletados: 0, totalTrofeosEnCompletados: 0 }, []];

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Perfil
      </h1>
      <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 md:max-w-xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-foreground-muted">
            {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user?.name ?? "Sin nombre"}</p>
            <p className="text-sm text-foreground-muted">{user?.email}</p>
            <p className="mt-1 text-xs text-accent">
              {role === "streamer" ? "Streamer" : "Suscriptor / Viewer"}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 border-t border-secondary/80 pt-4">
          <Link
            href="/following"
            className="text-sm font-medium text-accent hover:underline"
          >
            Siguiendo ({followingCount})
          </Link>
          {role === "streamer" && (
            <Link
              href="/followers"
              className="text-sm font-medium text-accent hover:underline"
            >
              Seguidores ({followersCount})
            </Link>
          )}
        </div>

        {role === "streamer" ? (
          <div className="space-y-2 text-sm text-foreground-muted">
            <p>Conecta tu canal de Twitch o Kick desde Ajustes para crear trofeos y ver estadísticas.</p>
            <div className="flex gap-2 pt-2">
              <TrophyIcon className="h-5 w-5 text-accent" aria-hidden />
              <span>Panel de trofeos disponible en el dashboard.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-foreground-muted">
            <p>Explora canales y desbloquea trofeos viendo streams y participando.</p>
          </div>
        )}
      </div>

      {role === "sub" && (
        <div className="mt-8 space-y-8">
          <FavoriteChannelExhibitor canal={favoriteChannel} />
          <CompletistExhibitor
            canales={completistData.canales}
            totalCanalesCompletados={completistData.totalCanalesCompletados}
            totalTrofeosEnCompletados={completistData.totalTrofeosEnCompletados}
          />
        </div>
      )}

      <div className="mt-8">
        <RecentActivityExhibitor items={recentActivity} />
      </div>
    </div>
  );
}

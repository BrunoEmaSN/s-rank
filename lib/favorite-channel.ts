import { db } from "@/lib/db";
import { favoriteStreamers, trophies, userTrophies, profiles, userStats } from "@/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";

export type CanalFavorito = {
  streamerId: string;
  name: string;
  avatarUrl: string | null;
  watchHours: number;
  trophiesUnlocked: number;
  trophiesTotal: number;
};

/**
 * Canal favorito: el que el usuario sigue y en el que tiene más trofeos desbloqueados.
 * En empate, el que tiene más horas vistas.
 */
export async function getFavoriteChannel(userId: string): Promise<CanalFavorito | null> {
  const followRows = await db
    .select({ streamerId: favoriteStreamers.streamerId })
    .from(favoriteStreamers)
    .where(eq(favoriteStreamers.userId, userId));

  const streamerIds = followRows.map((r) => r.streamerId);
  if (streamerIds.length === 0) return null;

  const [allTrophiesRows, unlockedRows, statsRows] = await Promise.all([
    db
      .select({ streamerId: trophies.streamerId })
      .from(trophies)
      .where(and(inArray(trophies.streamerId, streamerIds), eq(trophies.isActive, true))),
    db
      .select({ streamerId: trophies.streamerId })
      .from(userTrophies)
      .innerJoin(trophies, eq(userTrophies.trophyId, trophies.id))
      .where(
        and(
          eq(userTrophies.userId, userId),
          eq(userTrophies.isUnlocked, true),
          inArray(trophies.streamerId, streamerIds)
        )
      ),
    db
      .select({
        streamerId: userStats.streamerId,
        watchHours: sql<number>`COALESCE(SUM(${userStats.watchHours}), 0)::int`.as("watchHours"),
      })
      .from(userStats)
      .where(
        and(eq(userStats.userId, userId), inArray(userStats.streamerId, streamerIds))
      )
      .groupBy(userStats.streamerId),
  ]);

  const totalByStreamer = new Map<string, number>();
  for (const r of allTrophiesRows) {
    totalByStreamer.set(r.streamerId, (totalByStreamer.get(r.streamerId) ?? 0) + 1);
  }
  const unlockedByStreamer = new Map<string, number>();
  for (const r of unlockedRows) {
    unlockedByStreamer.set(r.streamerId, (unlockedByStreamer.get(r.streamerId) ?? 0) + 1);
  }
  const watchHoursByStreamer = new Map<string, number>();
  for (const r of statsRows) {
    watchHoursByStreamer.set(r.streamerId, Number(r.watchHours) || 0);
  }

  let bestStreamerId: string | null = null;
  let bestUnlocked = -1;
  let bestWatchHours = -1;

  for (const sid of streamerIds) {
    const unlocked = unlockedByStreamer.get(sid) ?? 0;
    const watchHours = watchHoursByStreamer.get(sid) ?? 0;
    if (unlocked > bestUnlocked || (unlocked === bestUnlocked && watchHours > bestWatchHours)) {
      bestUnlocked = unlocked;
      bestWatchHours = watchHours;
      bestStreamerId = sid;
    }
  }

  if (!bestStreamerId) return null;

  const [profile] = await db
    .select({
      id: profiles.id,
      displayName: profiles.displayName,
      username: profiles.username,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.id, bestStreamerId))
    .limit(1);

  if (!profile) return null;

  const total = totalByStreamer.get(bestStreamerId) ?? 0;

  return {
    streamerId: profile.id,
    name: profile.displayName ?? profile.username ?? "Canal",
    avatarUrl: profile.avatarUrl ?? null,
    watchHours: bestWatchHours,
    trophiesUnlocked: bestUnlocked,
    trophiesTotal: total,
  };
}

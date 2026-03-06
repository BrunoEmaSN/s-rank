import { db } from "@/lib/db";
import {
  favoriteStreamers,
  trophies,
  userTrophies,
  profiles,
  userStats,
} from "@/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";

export type ActividadRecienteItem = {
  streamerId: string;
  name: string;
  avatarUrl: string | null;
  watchHours: number;
  trophiesUnlocked: number;
  trophiesTotal: number;
  lastActivityAt: Date | null;
};

const DEFAULT_LIMIT = 5;

/**
 * Canales seguidos con actividad reciente (trofeos desbloqueados o stats),
 * ordenados por última actividad (trofeo ganado o actualización de stats).
 */
export async function getRecentActivity(
  userId: string,
  limit: number = DEFAULT_LIMIT
): Promise<ActividadRecienteItem[]> {
  const followRows = await db
    .select({ streamerId: favoriteStreamers.streamerId })
    .from(favoriteStreamers)
    .where(eq(favoriteStreamers.userId, userId));

  const streamerIds = followRows.map((r) => r.streamerId);
  if (streamerIds.length === 0) return [];

  const [allTrophiesRows, unlockedRows, trophyEarnedRows, statsRows] = await Promise.all([
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
        streamerId: trophies.streamerId,
        earnedAt: userTrophies.earnedAt,
      })
      .from(userTrophies)
      .innerJoin(trophies, eq(userTrophies.trophyId, trophies.id))
      .where(
        and(eq(userTrophies.userId, userId), inArray(trophies.streamerId, streamerIds))
      ),
    db
      .select({
        streamerId: userStats.streamerId,
        watchHours: sql<number>`COALESCE(SUM(${userStats.watchHours}), 0)::int`.as("watchHours"),
        lastUpdated: sql<Date>`MAX(${userStats.updatedAt})`.as("lastUpdated"),
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

  const lastEarnedByStreamer = new Map<string, Date>();
  for (const r of trophyEarnedRows) {
    const prev = lastEarnedByStreamer.get(r.streamerId);
    const at = r.earnedAt ? new Date(r.earnedAt) : null;
    if (at && (!prev || at > prev)) lastEarnedByStreamer.set(r.streamerId, at);
  }

  const watchHoursByStreamer = new Map<string, number>();
  const lastUpdatedByStreamer = new Map<string, Date>();
  for (const r of statsRows) {
    watchHoursByStreamer.set(r.streamerId, Number(r.watchHours) || 0);
    const at = r.lastUpdated ? new Date(r.lastUpdated) : null;
    if (at) lastUpdatedByStreamer.set(r.streamerId, at);
  }

  const lastActivityByStreamer = new Map<string, Date>();
  for (const sid of streamerIds) {
    const earned = lastEarnedByStreamer.get(sid);
    const updated = lastUpdatedByStreamer.get(sid);
    const candidates = [earned, updated].filter(Boolean) as Date[];
    if (candidates.length > 0) {
      lastActivityByStreamer.set(sid, new Date(Math.max(...candidates.map((d) => d.getTime()))));
    }
  }

  const sortedStreamerIds = [...streamerIds].sort((a, b) => {
    const atA = lastActivityByStreamer.get(a)?.getTime() ?? 0;
    const atB = lastActivityByStreamer.get(b)?.getTime() ?? 0;
    return atB - atA;
  });

  const toFetch = sortedStreamerIds.slice(0, limit);
  if (toFetch.length === 0) return [];

  const profileRows = await db
    .select({
      id: profiles.id,
      displayName: profiles.displayName,
      username: profiles.username,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(inArray(profiles.id, toFetch));

  const profileById = new Map(profileRows.map((p) => [p.id, p]));

  return toFetch
    .map((streamerId) => {
      const profile = profileById.get(streamerId);
      if (!profile) return null;
      const total = totalByStreamer.get(streamerId) ?? 0;
      const unlocked = unlockedByStreamer.get(streamerId) ?? 0;
      const watchHours = watchHoursByStreamer.get(streamerId) ?? 0;
      const lastActivityAt = lastActivityByStreamer.get(streamerId) ?? null;
      return {
        streamerId: profile.id,
        name: profile.displayName ?? profile.username ?? "Canal",
        avatarUrl: profile.avatarUrl ?? null,
        watchHours,
        trophiesUnlocked: unlocked,
        trophiesTotal: total,
        lastActivityAt,
      };
    })
    .filter((x): x is ActividadRecienteItem => x != null);
}

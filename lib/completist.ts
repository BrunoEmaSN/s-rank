import { db } from "@/lib/db";
import { favoriteStreamers, trophies, userTrophies, profiles } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export type CanalCompletist = {
  streamerId: string;
  name: string;
  avatarUrl: string | null;
  totalTrophies: number;
};

export type CompletistStats = {
  canales: CanalCompletist[];
  totalCanalesCompletados: number;
  totalTrofeosEnCompletados: number;
};

/**
 * Canales que el usuario sigue y en los que tiene todos los trofeos desbloqueados.
 */
export async function getCanalesCompletists(userId: string): Promise<CompletistStats> {
  const followRows = await db
    .select({ streamerId: favoriteStreamers.streamerId })
    .from(favoriteStreamers)
    .where(eq(favoriteStreamers.userId, userId));

  const streamerIds = followRows.map((r) => r.streamerId);
  if (streamerIds.length === 0) {
    return { canales: [], totalCanalesCompletados: 0, totalTrofeosEnCompletados: 0 };
  }

  const [allTrophiesRows, unlockedRows] = await Promise.all([
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
  ]);

  const totalByStreamer = new Map<string, number>();
  for (const r of allTrophiesRows) {
    totalByStreamer.set(r.streamerId, (totalByStreamer.get(r.streamerId) ?? 0) + 1);
  }
  const unlockedByStreamer = new Map<string, number>();
  for (const r of unlockedRows) {
    unlockedByStreamer.set(r.streamerId, (unlockedByStreamer.get(r.streamerId) ?? 0) + 1);
  }

  const completedStreamerIds = streamerIds.filter((id) => {
    const total = totalByStreamer.get(id) ?? 0;
    const unlocked = unlockedByStreamer.get(id) ?? 0;
    return total > 0 && unlocked === total;
  });

  if (completedStreamerIds.length === 0) {
    return { canales: [], totalCanalesCompletados: 0, totalTrofeosEnCompletados: 0 };
  }

  const profileRows = await db
    .select({
      id: profiles.id,
      displayName: profiles.displayName,
      username: profiles.username,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(inArray(profiles.id, completedStreamerIds));

  const canales: CanalCompletist[] = profileRows.map((p) => {
    const total = totalByStreamer.get(p.id) ?? 0;
    return {
      streamerId: p.id,
      name: p.displayName ?? p.username ?? "Canal",
      avatarUrl: p.avatarUrl ?? null,
      totalTrophies: total,
    };
  });

  const totalTrofeosEnCompletados = canales.reduce((sum, c) => sum + c.totalTrophies, 0);

  return {
    canales,
    totalCanalesCompletados: canales.length,
    totalTrofeosEnCompletados,
  };
}

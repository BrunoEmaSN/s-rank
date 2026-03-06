import { db } from "@/lib/db";
import { channel, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export type RecommendedChannel = {
  id: string;
  userId: string;
  name: string;
  platform: string;
  trophies: number;
  avatarUrl: string | null;
  displayName: string | null;
};

const DEFAULT_LIMIT = 8;

/**
 * Canales recomendados para el dashboard: ordenados por cantidad de trofeos,
 * con avatar y nombre para mostrar en el carrusel.
 */
export async function getRecommendedChannels(
  limit: number = DEFAULT_LIMIT
): Promise<RecommendedChannel[]> {
  const rows = await db
    .select({
      id: channel.id,
      userId: channel.userId,
      name: channel.name,
      platform: channel.platform,
      trophies: channel.trophies,
      avatarUrl: profiles.avatarUrl,
      displayName: profiles.displayName,
    })
    .from(channel)
    .leftJoin(profiles, eq(channel.userId, profiles.id))
    .orderBy(desc(channel.trophies), desc(channel.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    name: r.name,
    platform: r.platform,
    trophies: r.trophies,
    avatarUrl: r.avatarUrl ?? null,
    displayName: r.displayName ?? null,
  }));
}

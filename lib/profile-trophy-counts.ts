import { db } from "@/lib/db";
import { userTrophies, trophies } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export type TrophyCountsByRarity = {
  common: number;
  rare: number;
  epic: number;
  legendary: number;
};

/**
 * Cuenta los trofeos desbloqueados del usuario por rareza (common = normales, rare, epic, legendary).
 */
export async function getTrophyCountsByRarity(
  userId: string
): Promise<TrophyCountsByRarity> {
  const rows = await db
    .select({
      rarity: trophies.rarity,
      count: sql<number>`count(*)::int`,
    })
    .from(userTrophies)
    .innerJoin(trophies, eq(userTrophies.trophyId, trophies.id))
    .where(
      and(
        eq(userTrophies.userId, userId),
        eq(userTrophies.isUnlocked, true)
      )
    )
    .groupBy(trophies.rarity);

  const counts: TrophyCountsByRarity = {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  };
  for (const row of rows) {
    if (row.rarity in counts) {
      counts[row.rarity as keyof TrophyCountsByRarity] = row.count;
    }
  }
  return counts;
}

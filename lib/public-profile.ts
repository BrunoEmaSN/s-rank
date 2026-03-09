import { db } from "@/lib/db";
import { account, profiles, userTrophies, trophies } from "@/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";

export type LinkedPlatform = {
  platform: "twitch" | "kick";
  username?: string;
  url: string;
};

export type PublicProfileData = {
  id: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  bannerUrl: string | null;
  linkedPlatforms: LinkedPlatform[];
  trophyCountsByRarity: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  trophiesByStreamer: {
    streamerId: string;
    streamerName: string | null;
    unlocked: number;
  }[];
};

export async function getPublicProfile(
  profileId: string
): Promise<PublicProfileData | null> {
  const [profile] = await db
    .select({
      id: profiles.id,
      displayName: profiles.displayName,
      username: profiles.username,
      avatarUrl: profiles.avatarUrl,
      bio: profiles.bio,
      bannerUrl: profiles.bannerUrl,
      twitchUsername: profiles.twitchUsername,
      kickUsername: profiles.kickUsername,
    })
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1);

  if (!profile) return null;

  const rarityRows = await db
    .select({
      rarity: trophies.rarity,
      count: sql<number>`count(*)::int`,
    })
    .from(userTrophies)
    .innerJoin(trophies, eq(userTrophies.trophyId, trophies.id))
    .where(
      and(
        eq(userTrophies.userId, profileId),
        eq(userTrophies.isUnlocked, true)
      )
    )
    .groupBy(trophies.rarity);

  const counts = { common: 0, rare: 0, epic: 0, legendary: 0 };
  for (const row of rarityRows) {
    if (row.rarity in counts) {
      counts[row.rarity as keyof typeof counts] = row.count;
    }
  }

  const byStreamerRows = await db
    .select({
      streamerId: trophies.streamerId,
      count: sql<number>`count(*)::int`,
    })
    .from(userTrophies)
    .innerJoin(trophies, eq(userTrophies.trophyId, trophies.id))
    .where(
      and(
        eq(userTrophies.userId, profileId),
        eq(userTrophies.isUnlocked, true)
      )
    )
    .groupBy(trophies.streamerId);

  const streamerIds = byStreamerRows.map((r) => r.streamerId);
  const allStreamerProfiles =
    streamerIds.length > 0
      ? await db
          .select({ id: profiles.id, displayName: profiles.displayName })
          .from(profiles)
          .where(inArray(profiles.id, streamerIds))
      : [];
  const streamerByIdMap = new Map(allStreamerProfiles.map((p) => [p.id, p]));

  const trophiesByStreamer = byStreamerRows.map((r) => ({
    streamerId: r.streamerId,
    streamerName: streamerByIdMap.get(r.streamerId)?.displayName ?? null,
    unlocked: r.count,
  }));

  const linkedAccounts = await db
    .select({ providerId: account.providerId })
    .from(account)
    .where(eq(account.userId, profileId));
  const linkedProviderIds = new Set(
    linkedAccounts.map((a) => a.providerId?.toLowerCase()).filter(Boolean)
  );

  const linkedPlatforms: PublicProfileData["linkedPlatforms"] = [];
  if (linkedProviderIds.has("twitch")) {
    const username = profile.twitchUsername?.trim();
    linkedPlatforms.push({
      platform: "twitch",
      ...(username && { username }),
      url: username ? `https://twitch.tv/${username}` : "https://twitch.tv",
    });
  }
  if (linkedProviderIds.has("kick")) {
    const username = profile.kickUsername?.trim();
    linkedPlatforms.push({
      platform: "kick",
      ...(username && { username }),
      url: username ? `https://kick.com/${username}` : "https://kick.com",
    });
  }

  return {
    id: profile.id,
    displayName: profile.displayName,
    username: profile.username,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio ?? null,
    bannerUrl: profile.bannerUrl ?? null,
    linkedPlatforms,
    trophyCountsByRarity: counts,
    trophiesByStreamer,
  };
}

import type { SeedDb } from "../db";
import { favoriteStreamers, userStats, userTrophies } from "../../schema";
import { SEED_USER_IDS } from "./01-users";
import { SEED_TROPHY_IDS } from "./03-trophies";

export async function seedFollowsAndStats(db: SeedDb) {
  await db.insert(favoriteStreamers).values([
    { userId: SEED_USER_IDS.sub1, streamerId: SEED_USER_IDS.streamer1 },
    { userId: SEED_USER_IDS.sub1, streamerId: SEED_USER_IDS.streamer2 },
    { userId: SEED_USER_IDS.sub2, streamerId: SEED_USER_IDS.streamer1 },
  ]).onConflictDoNothing();

  await db.insert(userStats).values([
    {
      userId: SEED_USER_IDS.sub1,
      streamerId: SEED_USER_IDS.streamer1,
      platform: "Twitch",
      watchHours: 15,
      subscriptionMonths: 2,
    },
    {
      userId: SEED_USER_IDS.sub1,
      streamerId: SEED_USER_IDS.streamer2,
      platform: "Kick",
      watchHours: 5,
    },
    {
      userId: SEED_USER_IDS.sub2,
      streamerId: SEED_USER_IDS.streamer1,
      platform: "Twitch",
      watchHours: 3,
    },
  ]).onConflictDoNothing();

  await db.insert(userTrophies).values([
    { userId: SEED_USER_IDS.sub1, trophyId: SEED_TROPHY_IDS.t1, isUnlocked: true, progress: 100 },
    { userId: SEED_USER_IDS.sub1, trophyId: SEED_TROPHY_IDS.t2, isUnlocked: true, progress: 100 },
    { userId: SEED_USER_IDS.sub1, trophyId: SEED_TROPHY_IDS.t4, isUnlocked: true, progress: 100 },
    { userId: SEED_USER_IDS.sub2, trophyId: SEED_TROPHY_IDS.t1, isUnlocked: true, progress: 100 },
  ]).onConflictDoNothing();
}

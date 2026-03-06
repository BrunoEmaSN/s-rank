import type { SeedDb } from "../db";
import { channel } from "../../schema";
import { SEED_USER_IDS } from "./01-users";

export const SEED_CHANNEL_IDS = {
  streamer1: "seed-channel-1",
  streamer2: "seed-channel-2",
} as const;

export async function seedChannels(db: SeedDb) {
  await db.insert(channel).values([
    {
      id: SEED_CHANNEL_IDS.streamer1,
      userId: SEED_USER_IDS.streamer1,
      name: "Streamer Demo",
      platform: "Twitch",
      trophies: 3,
    },
    {
      id: SEED_CHANNEL_IDS.streamer2,
      userId: SEED_USER_IDS.streamer2,
      name: "Otro Canal",
      platform: "Kick",
      trophies: 2,
    },
  ]).onConflictDoNothing();
}

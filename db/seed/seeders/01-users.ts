import type { SeedDb } from "../db";
import { user, profiles } from "../../schema";

export const SEED_USER_IDS = {
  streamer1: "seed-streamer-1",
  streamer2: "seed-streamer-2",
  sub1: "seed-sub-1",
  sub2: "seed-sub-2",
} as const;

export async function seedUsers(db: SeedDb) {
  await db.insert(user).values([
    {
      id: SEED_USER_IDS.streamer1,
      name: "Streamer Demo",
      email: "streamer-demo@seed.local",
      emailVerified: true,
      role: "streamer",
      needsRoleSelection: false,
    },
    {
      id: SEED_USER_IDS.streamer2,
      name: "Otro Canal",
      email: "streamer-2@seed.local",
      emailVerified: true,
      role: "streamer",
      needsRoleSelection: false,
    },
    {
      id: SEED_USER_IDS.sub1,
      name: "Viewer Uno",
      email: "viewer-1@seed.local",
      emailVerified: true,
      role: "sub",
      needsRoleSelection: false,
    },
    {
      id: SEED_USER_IDS.sub2,
      name: "Viewer Dos",
      email: "viewer-2@seed.local",
      emailVerified: true,
      role: "sub",
      needsRoleSelection: false,
    },
  ]).onConflictDoNothing();

  await db.insert(profiles).values([
    {
      id: SEED_USER_IDS.streamer1,
      email: "streamer-demo@seed.local",
      username: "streamerdemo",
      displayName: "Streamer Demo",
      avatarUrl: null,
      isStreamer: true,
      platform: "twitch",
    },
    {
      id: SEED_USER_IDS.streamer2,
      email: "streamer-2@seed.local",
      username: "otrocanal",
      displayName: "Otro Canal",
      avatarUrl: null,
      isStreamer: true,
      platform: "kick",
    },
    {
      id: SEED_USER_IDS.sub1,
      email: "viewer-1@seed.local",
      username: "viewer1",
      displayName: "Viewer Uno",
      avatarUrl: null,
      isStreamer: false,
    },
    {
      id: SEED_USER_IDS.sub2,
      email: "viewer-2@seed.local",
      username: "viewer2",
      displayName: "Viewer Dos",
      avatarUrl: null,
      isStreamer: false,
    },
  ]).onConflictDoNothing();
}

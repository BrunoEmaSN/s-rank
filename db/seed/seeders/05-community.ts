import type { SeedDb } from "../db";
import { community, communityMember, communityPost, trophyRequest, userTrophies } from "../../schema";
import { SEED_USER_IDS } from "./01-users";
import { SEED_TROPHY_IDS } from "./03-trophies";
import { eq } from "drizzle-orm";

export const SEED_COMMUNITY_IDS = {
  streamer1: "b0000001-0001-4000-8000-000000000001",
  streamer2: "b0000002-0001-4000-8000-000000000001",
} as const;

export async function seedCommunity(db: SeedDb) {
  await db.insert(community).values([
    {
      id: SEED_COMMUNITY_IDS.streamer1,
      streamerId: SEED_USER_IDS.streamer1,
      name: "Comunidad Streamer Demo",
      description: "La comunidad oficial del canal Streamer Demo. Comparte logros y pide tus trofeos.",
    },
    {
      id: SEED_COMMUNITY_IDS.streamer2,
      streamerId: SEED_USER_IDS.streamer2,
      name: "Fans de Otro Canal",
      description: "Comunidad de Otro Canal en Kick.",
    },
  ]).onConflictDoNothing();

  await db.insert(communityMember).values([
    { communityId: SEED_COMMUNITY_IDS.streamer1, userId: SEED_USER_IDS.sub1 },
    { communityId: SEED_COMMUNITY_IDS.streamer1, userId: SEED_USER_IDS.sub2 },
    { communityId: SEED_COMMUNITY_IDS.streamer2, userId: SEED_USER_IDS.sub1 },
  ]).onConflictDoNothing();

  const utRows = await db
    .select({ id: userTrophies.id, userId: userTrophies.userId, trophyId: userTrophies.trophyId })
    .from(userTrophies)
    .where(eq(userTrophies.isUnlocked, true));

  const sub1T1 = utRows.find((r) => r.userId === SEED_USER_IDS.sub1 && r.trophyId === SEED_TROPHY_IDS.t1);
  const sub1T2 = utRows.find((r) => r.userId === SEED_USER_IDS.sub1 && r.trophyId === SEED_TROPHY_IDS.t2);
  const sub2T1 = utRows.find((r) => r.userId === SEED_USER_IDS.sub2 && r.trophyId === SEED_TROPHY_IDS.t1);

  const posts: Array<{
    communityId: string;
    userId: string;
    type: "trophy_unlock" | "trophy_share";
    trophyId: string;
    userTrophyId: string | null;
    message: string | null;
  }> = [];

  if (sub1T1?.id) {
    posts.push({
      communityId: SEED_COMMUNITY_IDS.streamer1,
      userId: SEED_USER_IDS.sub1,
      type: "trophy_unlock",
      trophyId: SEED_TROPHY_IDS.t1,
      userTrophyId: sub1T1.id,
      message: null,
    });
  }
  if (sub1T2?.id) {
    posts.push({
      communityId: SEED_COMMUNITY_IDS.streamer1,
      userId: SEED_USER_IDS.sub1,
      type: "trophy_share",
      trophyId: SEED_TROPHY_IDS.t2,
      userTrophyId: sub1T2.id,
      message: "¡Mi primer mes de suscripción!",
    });
  }
  if (sub2T1?.id) {
    posts.push({
      communityId: SEED_COMMUNITY_IDS.streamer1,
      userId: SEED_USER_IDS.sub2,
      type: "trophy_unlock",
      trophyId: SEED_TROPHY_IDS.t1,
      userTrophyId: sub2T1.id,
      message: null,
    });
  }

  if (posts.length > 0) {
    await db.insert(communityPost).values(
      posts.map((p) => ({
        communityId: p.communityId,
        userId: p.userId,
        type: p.type,
        trophyId: p.trophyId,
        userTrophyId: p.userTrophyId ?? undefined,
        message: p.message ?? undefined,
      }))
    );
  }

  const SEED_TROPHY_REQUEST_IDS = {
    req1: "c0000001-0001-4000-8000-000000000001",
    req2: "c0000001-0001-4000-8000-000000000002",
  } as const;

  await db.insert(trophyRequest).values([
    {
      id: SEED_TROPHY_REQUEST_IDS.req1,
      communityId: SEED_COMMUNITY_IDS.streamer1,
      userId: SEED_USER_IDS.sub2,
      trophyId: SEED_TROPHY_IDS.t3,
      message: "Llevo mucho tiempo en el chat y el streamer me dijo que me lo daría. Gracias!",
      proofImageUrl: null,
      status: "pending",
    },
    {
      id: SEED_TROPHY_REQUEST_IDS.req2,
      communityId: SEED_COMMUNITY_IDS.streamer1,
      userId: SEED_USER_IDS.sub1,
      trophyId: SEED_TROPHY_IDS.t3,
      message: "Solicito el VIP del chat, aquí mi prueba de actividad.",
      proofImageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      status: "approved",
      reviewedAt: new Date(),
      reviewedBy: SEED_USER_IDS.streamer1,
    },
  ]).onConflictDoNothing();
}

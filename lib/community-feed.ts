import { db } from "@/lib/db";
import { community, communityMember, communityPost } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Creates a community_post (trophy_unlock) when a user unlocks a trophy, if the streamer
 * has a community and the user is a member. Call after granting a trophy (manual or from sync).
 */
export async function createCommunityPostForUnlock(
  streamerId: string,
  userId: string,
  trophyId: string,
  userTrophyId: string
): Promise<void> {
  const [comm] = await db
    .select({ id: community.id })
    .from(community)
    .where(eq(community.streamerId, streamerId))
    .limit(1);

  if (!comm) return;

  const [member] = await db
    .select({ id: communityMember.id })
    .from(communityMember)
    .where(
      and(
        eq(communityMember.communityId, comm.id),
        eq(communityMember.userId, userId)
      )
    )
    .limit(1);

  if (!member) return;

  await db.insert(communityPost).values({
    communityId: comm.id,
    userId,
    type: "trophy_unlock",
    trophyId,
    userTrophyId,
  });
}

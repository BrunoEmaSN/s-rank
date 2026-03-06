import { db } from "@/lib/db";
import { community, communityMember, profiles, favoriteStreamers } from "@/db/schema";
import { eq, inArray, and, desc, sql, notInArray } from "drizzle-orm";

export type CommunityFromFollowed = CommunityListItem & { isMember: boolean };

export type RecommendedCommunity = CommunityListItem & { memberCount: number };

export type CommunityListItem = {
  id: string;
  name: string;
  description: string | null;
  streamerId: string;
  streamerName: string | null;
  streamerAvatar: string | null;
  isOwner: boolean;
};

export async function getCommunitiesForUser(
  userId: string
): Promise<CommunityListItem[]> {
  const memberships = await db
    .select({ communityId: communityMember.communityId })
    .from(communityMember)
    .where(eq(communityMember.userId, userId));

  const owned = await db
    .select({
      id: community.id,
      name: community.name,
      description: community.description,
      streamerId: community.streamerId,
    })
    .from(community)
    .where(eq(community.streamerId, userId));

  const communityIds = [
    ...new Set([
      ...memberships.map((m) => m.communityId),
      ...owned.map((c) => c.id),
    ]),
  ];

  if (communityIds.length === 0) return [];

  const rows = await db
    .select({
      id: community.id,
      name: community.name,
      description: community.description,
      streamerId: community.streamerId,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(community)
    .leftJoin(profiles, eq(community.streamerId, profiles.id))
    .where(inArray(community.id, communityIds));

  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description ?? null,
    streamerId: c.streamerId,
    streamerName: c.displayName ?? null,
    streamerAvatar: c.avatarUrl ?? null,
    isOwner: c.streamerId === userId,
  }));
}

export type CommunityDetailData = {
  id: string;
  name: string;
  description: string | null;
  streamerId: string;
  streamerName: string | null;
  streamerAvatar: string | null;
  isMember: boolean;
  isOwner: boolean;
};

export async function getCommunityDetail(
  communityId: string,
  userId: string
): Promise<CommunityDetailData | null> {
  const [row] = await db
    .select({
      id: community.id,
      name: community.name,
      description: community.description,
      streamerId: community.streamerId,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(community)
    .leftJoin(profiles, eq(community.streamerId, profiles.id))
    .where(eq(community.id, communityId))
    .limit(1);

  if (!row) return null;

  const isOwner = row.streamerId === userId;
  const memberRows = await db
    .select({ id: communityMember.id })
    .from(communityMember)
    .where(
      and(
        eq(communityMember.communityId, communityId),
        eq(communityMember.userId, userId)
      )
    )
    .limit(1);
  const isMember = isOwner || memberRows.length > 0;

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    streamerId: row.streamerId,
    streamerName: row.displayName ?? null,
    streamerAvatar: row.avatarUrl ?? null,
    isMember,
    isOwner: row.streamerId === userId,
  };
}

/**
 * Comunidades de streamers que el usuario sigue. Incluye isMember para saber si ya está unido.
 */
export async function getCommunitiesFromFollowedStreamers(
  userId: string
): Promise<CommunityFromFollowed[]> {
  const followedStreamerIds = await db
    .select({ streamerId: favoriteStreamers.streamerId })
    .from(favoriteStreamers)
    .where(eq(favoriteStreamers.userId, userId));

  const streamerIds = followedStreamerIds.map((r) => r.streamerId);
  if (streamerIds.length === 0) return [];

  const rows = await db
    .select({
      id: community.id,
      name: community.name,
      description: community.description,
      streamerId: community.streamerId,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(community)
    .leftJoin(profiles, eq(community.streamerId, profiles.id))
    .where(inArray(community.streamerId, streamerIds));

  const myMemberCommunityIds = await db
    .select({ communityId: communityMember.communityId })
    .from(communityMember)
    .where(eq(communityMember.userId, userId));

  const myOwnedCommunityIds = await db
    .select({ id: community.id })
    .from(community)
    .where(eq(community.streamerId, userId));

  const alreadyInIds = new Set([
    ...myMemberCommunityIds.map((m) => m.communityId),
    ...myOwnedCommunityIds.map((c) => c.id),
  ]);

  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description ?? null,
    streamerId: c.streamerId,
    streamerName: c.displayName ?? null,
    streamerAvatar: c.avatarUrl ?? null,
    isOwner: c.streamerId === userId,
    isMember: alreadyInIds.has(c.id),
  }));
}

const DEFAULT_RECOMMENDED_LIMIT = 6;

/**
 * Comunidades recomendadas: no pertenecientes al usuario, priorizando las de streamers que sigue.
 * Incluye conteo de miembros.
 */
export async function getRecommendedCommunities(
  userId: string,
  limit: number = DEFAULT_RECOMMENDED_LIMIT
): Promise<RecommendedCommunity[]> {
  const myCommunityIds = await db
    .select({ id: community.id })
    .from(community)
    .where(eq(community.streamerId, userId));

  const myMemberIds = await db
    .select({ communityId: communityMember.communityId })
    .from(communityMember)
    .where(eq(communityMember.userId, userId));

  const excludeIds = new Set([
    ...myCommunityIds.map((c) => c.id),
    ...myMemberIds.map((m) => m.communityId),
  ]);

  const followedStreamerIds = await db
    .select({ streamerId: favoriteStreamers.streamerId })
    .from(favoriteStreamers)
    .where(eq(favoriteStreamers.userId, userId));

  const followedSet = new Set(followedStreamerIds.map((r) => r.streamerId));

  const excludeList = [...excludeIds];
  const rows = await db
    .select({
      id: community.id,
      name: community.name,
      description: community.description,
      streamerId: community.streamerId,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
      memberCount: sql<number>`(SELECT count(*)::int FROM community_member cm WHERE cm.community_id = ${community.id})`.as("member_count"),
    })
    .from(community)
    .leftJoin(profiles, eq(community.streamerId, profiles.id))
    .where(excludeList.length > 0 ? notInArray(community.id, excludeList) : sql`1 = 1`);

  const withFollowed = rows.map((r) => ({
    ...r,
    fromFollowed: followedSet.has(r.streamerId),
  }));

  withFollowed.sort((a, b) => {
    if (a.fromFollowed && !b.fromFollowed) return -1;
    if (!a.fromFollowed && b.fromFollowed) return 1;
    return (b.memberCount ?? 0) - (a.memberCount ?? 0);
  });

  return withFollowed.slice(0, limit).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    streamerId: r.streamerId,
    streamerName: r.displayName ?? null,
    streamerAvatar: r.avatarUrl ?? null,
    isOwner: false,
    memberCount: r.memberCount ?? 0,
  }));
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { community, communityMember, userTrophies, trophies } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, and } from "drizzle-orm";

/**
 * GET: list current user's unlocked trophies for this community's streamer (for share-to-feed).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: communityId } = await params;

  const [comm] = await db
    .select({ streamerId: community.streamerId })
    .from(community)
    .where(eq(community.id, communityId))
    .limit(1);

  if (!comm) {
    return NextResponse.json(
      { error: "Comunidad no encontrada" },
      { status: 404 }
    );
  }

  const memberRows = await db
    .select({ id: communityMember.id })
    .from(communityMember)
    .where(
      and(
        eq(communityMember.communityId, communityId),
        eq(communityMember.userId, session.user.id)
      )
    )
    .limit(1);

  const isOwner = comm.streamerId === session.user.id;
  if (!isOwner && memberRows.length === 0) {
    return NextResponse.json(
      { error: "Debes ser miembro para compartir" },
      { status: 403 }
    );
  }

  const rows = await db
    .select({
      userTrophyId: userTrophies.id,
      trophyId: trophies.id,
      title: trophies.title,
      icon: trophies.icon,
    })
    .from(userTrophies)
    .innerJoin(trophies, eq(userTrophies.trophyId, trophies.id))
    .where(
      and(
        eq(userTrophies.userId, session.user.id),
        eq(userTrophies.isUnlocked, true),
        eq(trophies.streamerId, comm.streamerId)
      )
    );

  return NextResponse.json({
    data: rows.map((r) => ({
      userTrophyId: r.userTrophyId,
      trophyId: r.trophyId,
      title: r.title,
      icon: r.icon,
    })),
  });
}

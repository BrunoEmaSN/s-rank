import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { community, communityMember, profiles } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, and } from "drizzle-orm";

export type CommunityDetail = {
  id: string;
  name: string;
  description: string | null;
  streamerId: string;
  streamerName: string | null;
  streamerAvatar: string | null;
  isMember: boolean;
  isOwner: boolean;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: communityId } = await params;

  try {
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

    if (!row) {
      return NextResponse.json({ error: "Comunidad no encontrada" }, { status: 404 });
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

    const isOwner = row.streamerId === session.user.id;
    const isMemberResult = isOwner || memberRows.length > 0;

    const data: CommunityDetail = {
      id: row.id,
      name: row.name,
      description: row.description ?? null,
      streamerId: row.streamerId,
      streamerName: row.displayName ?? null,
      streamerAvatar: row.avatarUrl ?? null,
      isMember: isMemberResult,
      isOwner,
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/communities/[id]]", error);
    return NextResponse.json(
      { error: "Error al cargar la comunidad" },
      { status: 500 }
    );
  }
}

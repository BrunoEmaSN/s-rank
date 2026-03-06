import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { community, communityMember, trophies } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, and } from "drizzle-orm";

/**
 * GET: list manual trophies for this community's streamer (for request-trophy form).
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
  const isMember = isOwner || memberRows.length > 0;

  if (!isMember) {
    return NextResponse.json(
      { error: "Debes ser miembro para ver los trofeos" },
      { status: 403 }
    );
  }

  const manualTrophies = await db
    .select({
      id: trophies.id,
      title: trophies.title,
      description: trophies.description,
      icon: trophies.icon,
    })
    .from(trophies)
    .where(
      and(
        eq(trophies.streamerId, comm.streamerId),
        eq(trophies.grantMode, "manual"),
        eq(trophies.isActive, true)
      )
    );

  return NextResponse.json({
    data: manualTrophies.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      icon: t.icon,
    })),
  });
}

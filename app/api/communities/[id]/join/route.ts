import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { community, communityMember } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq } from "drizzle-orm";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: communityId } = await params;
  const userId = session.user.id;

  try {
    const [comm] = await db
      .select({ id: community.id })
      .from(community)
      .where(eq(community.id, communityId))
      .limit(1);

    if (!comm) {
      return NextResponse.json(
        { error: "Comunidad no encontrada" },
        { status: 404 }
      );
    }

    await db
      .insert(communityMember)
      .values({
        communityId,
        userId,
      })
      .onConflictDoNothing({
        target: [communityMember.communityId, communityMember.userId],
      });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[POST /api/communities/[id]/join]", error);
    return NextResponse.json(
      { error: "Error al unirse a la comunidad" },
      { status: 500 }
    );
  }
}

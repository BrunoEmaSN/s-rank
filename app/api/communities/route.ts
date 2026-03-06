import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { community, communityMember, profiles } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, inArray } from "drizzle-orm";

export type CommunityListItem = {
  id: string;
  name: string;
  description: string | null;
  streamerId: string;
  streamerName: string | null;
  streamerAvatar: string | null;
  isOwner: boolean;
  memberCount?: number;
};

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Communities where user is member OR streamer (owner)
    const memberships = await db
      .select({
        communityId: communityMember.communityId,
      })
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

    if (communityIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const communitiesWithProfile = await db
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

    const result: CommunityListItem[] = communitiesWithProfile.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description ?? null,
      streamerId: c.streamerId,
      streamerName: c.displayName ?? null,
      streamerAvatar: c.avatarUrl ?? null,
      isOwner: c.streamerId === userId,
    }));

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[GET /api/communities]", error);
    return NextResponse.json(
      { error: "Error al listar comunidades" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "streamer") {
    return NextResponse.json(
      { error: "Solo los streamers pueden crear una comunidad" },
      { status: 403 }
    );
  }

  const streamerId = session.user.id;

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : null;

    if (!name) {
      return NextResponse.json(
        { error: "El nombre de la comunidad es obligatorio" },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select({ id: community.id })
      .from(community)
      .where(eq(community.streamerId, streamerId))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(community)
        .set({
          name,
          description: description ?? undefined,
          updatedAt: new Date(),
        })
        .where(eq(community.id, existing.id))
        .returning({ id: community.id, name: community.name });

      return NextResponse.json({
        data: { id: updated?.id, name: updated?.name, updated: true },
      });
    }

    const [created] = await db
      .insert(community)
      .values({
        streamerId,
        name,
        description: description ?? undefined,
      })
      .returning({ id: community.id, name: community.name });

    if (!created) {
      return NextResponse.json(
        { error: "Error al crear la comunidad" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { id: created.id, name: created.name },
    });
  } catch (error) {
    console.error("[POST /api/communities]", error);
    return NextResponse.json(
      { error: "Error al crear la comunidad" },
      { status: 500 }
    );
  }
}

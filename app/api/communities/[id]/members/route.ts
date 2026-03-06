import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { community, communityMember, profiles } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, and, desc, inArray, sql } from "drizzle-orm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 100;

export type CommunityMemberItem = {
  userId: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  joinedAt: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: communityId } = await params;

  try {
    const [comm] = await db
      .select({ id: community.id, streamerId: community.streamerId })
      .from(community)
      .where(eq(community.id, communityId))
      .limit(1);

    if (!comm) {
      return NextResponse.json(
        { error: "Comunidad no encontrada" },
        { status: 404 }
      );
    }

    const isOwner = comm.streamerId === session.user.id;
    const memberCheck = await db
      .select({ id: communityMember.id })
      .from(communityMember)
      .where(
        and(
          eq(communityMember.communityId, communityId),
          eq(communityMember.userId, session.user.id)
        )
      )
      .limit(1);
    const isMemberOrOwner = isOwner || memberCheck.length > 0;

    if (!isMemberOrOwner) {
      return NextResponse.json(
        { error: "Debes ser miembro para ver la lista" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(
      1,
      parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE), 10) || DEFAULT_PAGE
    );
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(
        1,
        parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT
      )
    );

    const [memberRows, countResult] = await Promise.all([
      db
        .select({
          userId: communityMember.userId,
          joinedAt: communityMember.joinedAt,
        })
        .from(communityMember)
        .where(eq(communityMember.communityId, communityId))
        .orderBy(desc(communityMember.joinedAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(communityMember)
        .where(eq(communityMember.communityId, communityId)),
    ]);

    const total = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    if (memberRows.length === 0) {
      return NextResponse.json({
        data: [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    }

    const userIds = memberRows.map((r) => r.userId);
    const profileRows = await db
      .select({
        id: profiles.id,
        displayName: profiles.displayName,
        username: profiles.username,
        avatarUrl: profiles.avatarUrl,
      })
      .from(profiles)
      .where(inArray(profiles.id, userIds));

    const profileById = new Map(profileRows.map((p) => [p.id, p]));

    const data: CommunityMemberItem[] = memberRows.map((r) => {
      const p = profileById.get(r.userId);
      return {
        userId: r.userId,
        displayName: p?.displayName ?? null,
        username: p?.username ?? null,
        avatarUrl: p?.avatarUrl ?? null,
        joinedAt: r.joinedAt ? new Date(r.joinedAt).toISOString() : "",
      };
    });

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[GET /api/communities/[id]/members]", error);
    return NextResponse.json(
      { error: "Error al cargar miembros" },
      { status: 500 }
    );
  }
}

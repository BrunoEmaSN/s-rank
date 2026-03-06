import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  community,
  communityMember,
  communityPost,
  profiles,
  trophies,
  userTrophies,
} from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, and, desc, inArray, sql } from "drizzle-orm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export type CommunityPostItem = {
  id: string;
  type: "trophy_unlock" | "trophy_share";
  userId: string;
  userDisplayName: string | null;
  userAvatar: string | null;
  trophyId: string | null;
  trophyTitle: string | null;
  trophyIcon: string | null;
  message: string | null;
  createdAt: string;
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
    const isMember = isOwner || memberCheck.length > 0;

    if (!isMember) {
      return NextResponse.json(
        { error: "Debes ser miembro para ver el feed" },
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

    const [postRows, countResult] = await Promise.all([
      db
        .select({
          id: communityPost.id,
          type: communityPost.type,
          userId: communityPost.userId,
          trophyId: communityPost.trophyId,
          message: communityPost.message,
          createdAt: communityPost.createdAt,
        })
        .from(communityPost)
        .where(eq(communityPost.communityId, communityId))
        .orderBy(desc(communityPost.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(communityPost)
        .where(eq(communityPost.communityId, communityId)),
    ]);

    const total = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    if (postRows.length === 0) {
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

    const userIds = [...new Set(postRows.map((p) => p.userId))];
    const trophyIds = [...new Set(postRows.map((p) => p.trophyId).filter(Boolean) as string[])];

    const [profileRows, trophyRows] = await Promise.all([
      userIds.length > 0
        ? db
            .select({
              id: profiles.id,
              displayName: profiles.displayName,
              avatarUrl: profiles.avatarUrl,
            })
            .from(profiles)
            .where(inArray(profiles.id, userIds))
        : Promise.resolve([]),
      trophyIds.length > 0
        ? db
            .select({
              id: trophies.id,
              title: trophies.title,
              icon: trophies.icon,
            })
            .from(trophies)
            .where(inArray(trophies.id, trophyIds))
        : Promise.resolve([]),
    ]);

    const profileById = new Map(profileRows.map((p) => [p.id, p]));
    const trophyById = new Map(trophyRows.map((t) => [t.id, t]));

    const data: CommunityPostItem[] = postRows.map((row) => {
      const p = profileById.get(row.userId);
      const t = row.trophyId ? trophyById.get(row.trophyId) : null;
      return {
        id: row.id,
        type: row.type as "trophy_unlock" | "trophy_share",
        userId: row.userId,
        userDisplayName: p?.displayName ?? null,
        userAvatar: p?.avatarUrl ?? null,
        trophyId: row.trophyId,
        trophyTitle: t?.title ?? null,
        trophyIcon: t?.icon ?? null,
        message: row.message,
        createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : "",
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
    console.error("[GET /api/communities/[id]/posts]", error);
    return NextResponse.json(
      { error: "Error al cargar el feed" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
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

    const memberCheck = await db
      .select({ id: communityMember.id })
      .from(communityMember)
      .where(
        and(
          eq(communityMember.communityId, communityId),
          eq(communityMember.userId, userId)
        )
      )
      .limit(1);

    if (memberCheck.length === 0) {
      return NextResponse.json(
        { error: "Debes ser miembro para publicar" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const userTrophyId = typeof body.userTrophyId === "string" ? body.userTrophyId.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : null;

    if (!userTrophyId) {
      return NextResponse.json(
        { error: "userTrophyId es obligatorio para compartir un logro" },
        { status: 400 }
      );
    }

    const [ut] = await db
      .select({
        id: userTrophies.id,
        trophyId: userTrophies.trophyId,
      })
      .from(userTrophies)
      .innerJoin(trophies, eq(userTrophies.trophyId, trophies.id))
      .where(
        and(
          eq(userTrophies.id, userTrophyId),
          eq(userTrophies.userId, userId),
          eq(userTrophies.isUnlocked, true),
          eq(trophies.streamerId, comm.streamerId)
        )
      )
      .limit(1);

    if (!ut) {
      return NextResponse.json(
        { error: "Trofeo no encontrado o no desbloqueado para compartir" },
        { status: 400 }
      );
    }

    await db.insert(communityPost).values({
      communityId,
      userId,
      type: "trophy_share",
      trophyId: ut.trophyId,
      userTrophyId: ut.id,
      message: message ?? undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[POST /api/communities/[id]/posts]", error);
    return NextResponse.json(
      { error: "Error al publicar" },
      { status: 500 }
    );
  }
}

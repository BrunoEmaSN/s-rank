import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { favoriteStreamers, profiles } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, desc, sql, inArray } from "drizzle-orm";
import type { Follower } from "@/types/follows";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

export type FollowersApiResponse = {
  data: Follower[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: rawId } = await params;
  const profileId = rawId === "me" ? session.user.id : rawId;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE), 10) || DEFAULT_PAGE);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
    );

    const [followRows, countResult] = await Promise.all([
      db
        .select({
          userId: favoriteStreamers.userId,
          followedAt: favoriteStreamers.createdAt,
        })
        .from(favoriteStreamers)
        .where(eq(favoriteStreamers.streamerId, profileId))
        .orderBy(desc(favoriteStreamers.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(favoriteStreamers)
        .where(eq(favoriteStreamers.streamerId, profileId)),
    ]);

    const total = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    if (followRows.length === 0) {
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

    const userIds = followRows.map((r) => r.userId);
    const profileRows = await db
      .select()
      .from(profiles)
      .where(inArray(profiles.id, userIds));

    const profileById = new Map(profileRows.map((p) => [p.id, p]));

    const data: Follower[] = followRows.map((r) => {
      const p = profileById.get(r.userId);
      return {
        userId: r.userId,
        displayName: p?.displayName ?? null,
        username: p?.username ?? null,
        avatarUrl: p?.avatarUrl ?? null,
        followedAt: r.followedAt ? new Date(r.followedAt).toISOString() : "",
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
    console.error("[GET /api/users/[id]/followers]", error);
    return NextResponse.json(
      { error: "Error al cargar seguidores" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { favoriteStreamers, profiles, channel } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, desc, sql, inArray } from "drizzle-orm";
import type { FollowedStreamer } from "@/types/follows";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

export type FollowingApiResponse = {
  data: FollowedStreamer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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
          streamerId: favoriteStreamers.streamerId,
          followedAt: favoriteStreamers.createdAt,
        })
        .from(favoriteStreamers)
        .where(eq(favoriteStreamers.userId, session.user.id))
        .orderBy(desc(favoriteStreamers.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(favoriteStreamers)
        .where(eq(favoriteStreamers.userId, session.user.id)),
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

    const streamerIds = followRows.map((r) => r.streamerId);
    const [profileRows, channelRows] = await Promise.all([
      db.select().from(profiles).where(inArray(profiles.id, streamerIds)),
      db.select().from(channel).where(inArray(channel.userId, streamerIds)),
    ]);

    const profileById = new Map(profileRows.map((p) => [p.id, p]));
    const bestChannelByStreamer = new Map<string, { name: string; platform: string; trophies: number }>();
    for (const ch of channelRows) {
      const cur = bestChannelByStreamer.get(ch.userId);
      if (!cur || (ch.trophies ?? 0) > cur.trophies) {
        bestChannelByStreamer.set(ch.userId, {
          name: ch.name,
          platform: ch.platform,
          trophies: ch.trophies ?? 0,
        });
      }
    }

    const data: FollowedStreamer[] = followRows.map((r) => {
      const p = profileById.get(r.streamerId);
      const ch = bestChannelByStreamer.get(r.streamerId);
      return {
        streamerId: r.streamerId,
        displayName: p?.displayName ?? null,
        username: p?.username ?? null,
        avatarUrl: p?.avatarUrl ?? null,
        channelName: ch?.name ?? null,
        platform: ch?.platform ?? null,
        trophies: ch?.trophies ?? 0,
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
    console.error("[GET /api/users/me/following]", error);
    return NextResponse.json(
      { error: "Error al cargar siguiendo" },
      { status: 500 }
    );
  }
}

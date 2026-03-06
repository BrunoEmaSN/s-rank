import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { channel as channelTable, community } from "@/db/schema";
import { ilike, eq, and, sql, desc } from "drizzle-orm";

const PLATFORMS = ["Twitch", "Kick"] as const;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 50;

export type ChannelRow = {
  id: string;
  userId: string;
  name: string;
  platform: string;
  trophies: number;
  createdAt: Date;
  updatedAt: Date;
  communityId?: string | null;
};

export type ChannelsApiResponse = {
  data: ChannelRow[];
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
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE), 10) || DEFAULT_PAGE);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
    );
    const platformParam = searchParams.get("platform")?.trim();
    const search = searchParams.get("search")?.trim();
    const platform =
      platformParam && PLATFORMS.includes(platformParam as (typeof PLATFORMS)[number])
        ? (platformParam as (typeof PLATFORMS)[number])
        : undefined;

    const platformFilter = platform ? eq(channelTable.platform, platform) : undefined;

    const searchFilter = search
      ? ilike(channelTable.name, `%${search}%`)
      : undefined;

    const whereClause =
      platformFilter && searchFilter
        ? and(platformFilter, searchFilter)
        : platformFilter ?? searchFilter ?? undefined;

    const [rows, countResult] = await Promise.all([
      db
        .select({
          id: channelTable.id,
          userId: channelTable.userId,
          name: channelTable.name,
          platform: channelTable.platform,
          trophies: channelTable.trophies,
          createdAt: channelTable.createdAt,
          updatedAt: channelTable.updatedAt,
          communityId: community.id,
        })
        .from(channelTable)
        .leftJoin(community, eq(community.streamerId, channelTable.userId))
        .where(whereClause)
        .orderBy(desc(channelTable.trophies), desc(channelTable.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(channelTable)
        .where(whereClause),
    ]);

    const total = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const data: ChannelRow[] = rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      name: r.name,
      platform: r.platform,
      trophies: r.trophies,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      communityId: r.communityId ?? undefined,
    }));

    const response: ChannelsApiResponse = {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/channels]", error);
    return NextResponse.json(
      { error: "Error al cargar canales" },
      { status: 500 }
    );
  }
}

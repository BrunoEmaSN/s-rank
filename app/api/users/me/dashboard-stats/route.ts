import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { favoriteStreamers, userTrophies } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, sql, and } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const [followingCountRow, followersCountRow, unlockedTrophiesCountRow] =
      await Promise.all([
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(favoriteStreamers)
          .where(eq(favoriteStreamers.userId, userId)),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(favoriteStreamers)
          .where(eq(favoriteStreamers.streamerId, userId)),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(userTrophies)
          .where(
            and(
              eq(userTrophies.userId, userId),
              eq(userTrophies.isUnlocked, true)
            )
          ),
      ]);

    return NextResponse.json({
      followingCount: followingCountRow[0]?.count ?? 0,
      followersCount: followersCountRow[0]?.count ?? 0,
      unlockedTrophiesCount: unlockedTrophiesCountRow[0]?.count ?? 0,
    });
  } catch (error) {
    console.error("[GET /api/users/me/dashboard-stats]", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas del dashboard" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { favoriteStreamers } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, sql } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: rawId } = await params;
  const profileId = rawId === "me" ? session.user.id : rawId;

  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(favoriteStreamers)
      .where(eq(favoriteStreamers.streamerId, profileId));

    return NextResponse.json({ count: row?.count ?? 0 });
  } catch (error) {
    console.error("[GET /api/users/[id]/followers/count]", error);
    return NextResponse.json(
      { error: "Error al obtener conteo" },
      { status: 500 }
    );
  }
}

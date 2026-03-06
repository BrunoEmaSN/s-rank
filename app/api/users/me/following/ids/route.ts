import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { favoriteStreamers } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const rows = await db
      .select({ streamerId: favoriteStreamers.streamerId })
      .from(favoriteStreamers)
      .where(eq(favoriteStreamers.userId, session.user.id));

    return NextResponse.json({
      streamerIds: rows.map((r) => r.streamerId),
    });
  } catch (error) {
    console.error("[GET /api/users/me/following/ids]", error);
    return NextResponse.json(
      { error: "Error al obtener ids" },
      { status: 500 }
    );
  }
}

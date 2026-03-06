import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { favoriteStreamers } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const streamerId = (body.streamerId ?? body.streamer_id) as string | undefined;
    if (!streamerId?.trim()) {
      return NextResponse.json(
        { error: "streamerId es requerido" },
        { status: 400 }
      );
    }

    if (streamerId === session.user.id) {
      return NextResponse.json(
        { error: "No puedes seguirte a ti mismo" },
        { status: 400 }
      );
    }

    await db
      .insert(favoriteStreamers)
      .values({
        userId: session.user.id,
        streamerId: streamerId.trim(),
      })
      .onConflictDoNothing({
        target: [favoriteStreamers.userId, favoriteStreamers.streamerId],
      });

    return NextResponse.json({ following: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/follows]", error);
    return NextResponse.json(
      { error: "Error al seguir" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const streamerId = searchParams.get("streamerId") ?? searchParams.get("streamer_id");
    if (!streamerId?.trim()) {
      return NextResponse.json(
        { error: "streamerId es requerido" },
        { status: 400 }
      );
    }

    await db
      .delete(favoriteStreamers)
      .where(
        and(
          eq(favoriteStreamers.userId, session.user.id),
          eq(favoriteStreamers.streamerId, streamerId.trim())
        )
      );

    return NextResponse.json({ following: false });
  } catch (error) {
    console.error("[DELETE /api/follows]", error);
    return NextResponse.json(
      { error: "Error al dejar de seguir" },
      { status: 500 }
    );
  }
}

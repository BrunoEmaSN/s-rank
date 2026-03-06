import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { getRecentActivity } from "@/lib/recent-activity";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(1, Number(searchParams.get("limit")) || 5),
    20
  );

  try {
    const items = await getRecentActivity(session.user.id, limit);
    return NextResponse.json(items);
  } catch (error) {
    console.error("[GET /api/users/me/recent-activity]", error);
    return NextResponse.json(
      { error: "Error al obtener actividad reciente" },
      { status: 500 }
    );
  }
}

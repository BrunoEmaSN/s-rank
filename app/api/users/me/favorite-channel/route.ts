import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { getFavoriteChannel } from "@/lib/favorite-channel";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const canal = await getFavoriteChannel(session.user.id);
    return NextResponse.json(canal);
  } catch (error) {
    console.error("[GET /api/users/me/favorite-channel]", error);
    return NextResponse.json(
      { error: "Error al obtener canal favorito" },
      { status: 500 }
    );
  }
}

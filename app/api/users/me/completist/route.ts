import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { getCanalesCompletists } from "@/lib/completist";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const data = await getCanalesCompletists(session.user.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/users/me/completist]", error);
    return NextResponse.json(
      { error: "Error al obtener datos completista" },
      { status: 500 }
    );
  }
}

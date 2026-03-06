import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { getPublicProfile } from "@/lib/public-profile";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: profileId } = await params;

  try {
    const data = await getPublicProfile(profileId);
    if (!data) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/users/[id]/profile]", error);
    return NextResponse.json(
      { error: "Error al cargar el perfil" },
      { status: 500 }
    );
  }
}

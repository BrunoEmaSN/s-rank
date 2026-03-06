import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { community, trophyRequest } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, and } from "drizzle-orm";
import { grantTrophy } from "@/app/(dashboard)/trophies/actions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "streamer") {
    return NextResponse.json(
      { error: "Solo el streamer puede aprobar o rechazar solicitudes" },
      { status: 403 }
    );
  }

  const { id: communityId, requestId } = await params;

  try {
    const [comm] = await db
      .select({ id: community.id, streamerId: community.streamerId })
      .from(community)
      .where(eq(community.id, communityId))
      .limit(1);

    if (!comm || comm.streamerId !== session.user.id) {
      return NextResponse.json(
        { error: "Comunidad no encontrada o no autorizado" },
        { status: 404 }
      );
    }

    const [req] = await db
      .select({
        id: trophyRequest.id,
        userId: trophyRequest.userId,
        trophyId: trophyRequest.trophyId,
        status: trophyRequest.status,
      })
      .from(trophyRequest)
      .where(
        and(
          eq(trophyRequest.id, requestId),
          eq(trophyRequest.communityId, communityId)
        )
      )
      .limit(1);

    if (!req) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    if (req.status !== "pending") {
      return NextResponse.json(
        { error: "La solicitud ya fue revisada" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const action = typeof body.action === "string" ? body.action.trim() : "";

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "action debe ser 'approve' o 'reject'" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const result = await grantTrophy(req.trophyId, req.userId);
      if (!result.ok) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }
    }

    await db
      .update(trophyRequest)
      .set({
        status: action === "approve" ? "approved" : "rejected",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      })
      .where(eq(trophyRequest.id, requestId));

    return NextResponse.json({ ok: true, status: action === "approve" ? "approved" : "rejected" });
  } catch (error) {
    console.error("[PATCH /api/communities/[id]/trophy-requests/[requestId]]", error);
    return NextResponse.json(
      { error: "Error al actualizar la solicitud" },
      { status: 500 }
    );
  }
}

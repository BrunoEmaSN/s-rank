import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  community,
  communityMember,
  trophyRequest,
  trophies,
  profiles,
} from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq, and, desc, inArray } from "drizzle-orm";

export type TrophyRequestItem = {
  id: string;
  userId: string;
  userDisplayName: string | null;
  userAvatar: string | null;
  trophyId: string;
  trophyTitle: string;
  trophyIcon: string;
  message: string;
  proofImageUrl: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: communityId } = await params;
  const userId = session.user.id;

  try {
    const [comm] = await db
      .select({ id: community.id, streamerId: community.streamerId })
      .from(community)
      .where(eq(community.id, communityId))
      .limit(1);

    if (!comm) {
      return NextResponse.json(
        { error: "Comunidad no encontrada" },
        { status: 404 }
      );
    }

    const isOwner = comm.streamerId === userId;
    const memberCheck = await db
      .select({ id: communityMember.id })
      .from(communityMember)
      .where(
        and(
          eq(communityMember.communityId, communityId),
          eq(communityMember.userId, userId)
        )
      )
      .limit(1);
    const isMember = isOwner || memberCheck.length > 0;

    if (!isMember) {
      return NextResponse.json(
        { error: "Debes ser miembro para ver solicitudes" },
        { status: 403 }
      );
    }

    const where = isOwner
      ? eq(trophyRequest.communityId, communityId)
      : and(
          eq(trophyRequest.communityId, communityId),
          eq(trophyRequest.userId, userId)
        );

    const rows = await db
      .select({
        id: trophyRequest.id,
        userId: trophyRequest.userId,
        trophyId: trophyRequest.trophyId,
        message: trophyRequest.message,
        proofImageUrl: trophyRequest.proofImageUrl,
        status: trophyRequest.status,
        createdAt: trophyRequest.createdAt,
      })
      .from(trophyRequest)
      .where(where)
      .orderBy(desc(trophyRequest.createdAt));

    if (rows.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const userIds = [...new Set(rows.map((r) => r.userId))];
    const trophyIds = [...new Set(rows.map((r) => r.trophyId))];

    const [profileRows, trophyRows] = await Promise.all([
      db
        .select({
          id: profiles.id,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
        })
        .from(profiles)
        .where(inArray(profiles.id, userIds)),
      db
        .select({ id: trophies.id, title: trophies.title, icon: trophies.icon })
        .from(trophies)
        .where(inArray(trophies.id, trophyIds)),
    ]);

    const profileById = new Map(profileRows.map((p) => [p.id, p]));
    const trophyById = new Map(trophyRows.map((t) => [t.id, t]));

    const data: TrophyRequestItem[] = rows.map((r) => {
      const p = profileById.get(r.userId);
      const t = trophyById.get(r.trophyId);
      return {
        id: r.id,
        userId: r.userId,
        userDisplayName: p?.displayName ?? null,
        userAvatar: p?.avatarUrl ?? null,
        trophyId: r.trophyId,
        trophyTitle: t?.title ?? "",
        trophyIcon: t?.icon ?? "🏆",
        message: r.message,
        proofImageUrl: r.proofImageUrl,
        status: r.status as "pending" | "approved" | "rejected",
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/communities/[id]/trophy-requests]", error);
    return NextResponse.json(
      { error: "Error al cargar solicitudes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: communityId } = await params;
  const userId = session.user.id;

  try {
    const [comm] = await db
      .select({ id: community.id, streamerId: community.streamerId })
      .from(community)
      .where(eq(community.id, communityId))
      .limit(1);

    if (!comm) {
      return NextResponse.json(
        { error: "Comunidad no encontrada" },
        { status: 404 }
      );
    }

    const memberCheck = await db
      .select({ id: communityMember.id })
      .from(communityMember)
      .where(
        and(
          eq(communityMember.communityId, communityId),
          eq(communityMember.userId, userId)
        )
      )
      .limit(1);

    if (memberCheck.length === 0) {
      return NextResponse.json(
        { error: "Debes ser miembro para solicitar un trofeo" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const trophyId = typeof body.trophyId === "string" ? body.trophyId.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const proofImageUrl =
      typeof body.proofImageUrl === "string" ? body.proofImageUrl.trim() : null;

    if (!trophyId || !message) {
      return NextResponse.json(
        { error: "trophyId y message son obligatorios" },
        { status: 400 }
      );
    }

    const [trophy] = await db
      .select({ id: trophies.id, streamerId: trophies.streamerId, grantMode: trophies.grantMode })
      .from(trophies)
      .where(eq(trophies.id, trophyId))
      .limit(1);

    if (!trophy || trophy.streamerId !== comm.streamerId) {
      return NextResponse.json(
        { error: "Trofeo no encontrado o no pertenece a esta comunidad" },
        { status: 400 }
      );
    }

    if (trophy.grantMode !== "manual") {
      return NextResponse.json(
        { error: "Solo se pueden solicitar trofeos de otorgamiento manual" },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(trophyRequest)
      .values({
        communityId,
        userId,
        trophyId,
        message,
        proofImageUrl: proofImageUrl ?? undefined,
      })
      .returning({ id: trophyRequest.id });

    return NextResponse.json({ data: { id: created?.id } });
  } catch (error) {
    console.error("[POST /api/communities/[id]/trophy-requests]", error);
    return NextResponse.json(
      { error: "Error al crear la solicitud" },
      { status: 500 }
    );
  }
}

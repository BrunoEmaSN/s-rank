import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profiles } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq } from "drizzle-orm";

const MAX_BIO_LENGTH = 500;
const MAX_USERNAME_LENGTH = 100;

export type PatchProfileBody = {
  bio?: string | null;
  bannerUrl?: string | null;
  twitchUsername?: string | null;
  kickUsername?: string | null;
};

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: PatchProfileBody;
  try {
    body = (await request.json()) as PatchProfileBody;
  } catch {
    return NextResponse.json(
      { error: "Cuerpo JSON inválido" },
      { status: 400 }
    );
  }

  const updates: {
    bio?: string | null;
    bannerUrl?: string | null;
    twitchUsername?: string | null;
    kickUsername?: string | null;
    updatedAt: Date;
  } = { updatedAt: new Date() };

  if (body.bio !== undefined) {
    const bio =
      body.bio === null || body.bio === ""
        ? null
        : String(body.bio).slice(0, MAX_BIO_LENGTH);
    updates.bio = bio;
  }
  if (body.bannerUrl !== undefined) {
    updates.bannerUrl =
      body.bannerUrl === null || body.bannerUrl === "" ? null : String(body.bannerUrl);
  }
  if (body.twitchUsername !== undefined) {
    const v =
      body.twitchUsername === null || body.twitchUsername === ""
        ? null
        : String(body.twitchUsername).trim().slice(0, MAX_USERNAME_LENGTH);
    updates.twitchUsername = v || null;
  }
  if (body.kickUsername !== undefined) {
    const v =
      body.kickUsername === null || body.kickUsername === ""
        ? null
        : String(body.kickUsername).trim().slice(0, MAX_USERNAME_LENGTH);
    updates.kickUsername = v || null;
  }

  try {
    const [updated] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, session.user.id))
      .returning({
        id: profiles.id,
        bio: profiles.bio,
        bannerUrl: profiles.bannerUrl,
        twitchUsername: profiles.twitchUsername,
        kickUsername: profiles.kickUsername,
      });

    if (!updated) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/users/me/profile]", err);
    return NextResponse.json(
      { error: "Error al actualizar el perfil" },
      { status: 500 }
    );
  }
}

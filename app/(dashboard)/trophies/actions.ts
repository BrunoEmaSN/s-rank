"use server";

import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { trophies, trophyRules, userTrophies } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type TrophyRarity = "common" | "rare" | "epic" | "legendary";
export type TrophySourcePlatform = "Twitch" | "Kick";
export type TrophyGrantMode = "auto" | "manual";

export type TrophyRuleInput = { ruleType: string; value: number };

export interface CreateTrophyInput {
  title: string;
  description: string;
  rarity: TrophyRarity;
  icon?: string;
  sourcePlatform: TrophySourcePlatform;
  grantMode: TrophyGrantMode;
  rulesCombineMode?: "and" | "or";
  rules?: TrophyRuleInput[];
}

export async function createTrophy(input: CreateTrophyInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session?.user?.id) return { ok: false, error: "No autenticado" };

  const role = (session.user as { role?: string }).role;
  if (role !== "streamer") return { ok: false, error: "Solo los streamers pueden crear trofeos" };

  const streamerId = session.user.id;
  if (!input.title?.trim()) return { ok: false, error: "El título es obligatorio" };
  if (!input.description?.trim()) return { ok: false, error: "La descripción es obligatoria" };

  if (input.grantMode === "auto") {
    if (!input.rules?.length) return { ok: false, error: "Añade al menos una regla para trofeos automáticos" };
  }

  const requirementType =
    input.grantMode === "manual"
      ? "manual"
      : (input.rules?.[0]?.ruleType as "watch_hours" | "points" | "subscription_months" | "gift_subs") ?? "watch_hours";
  const requirementValue = input.grantMode === "manual" ? null : input.rules?.[0]?.value ?? 0;

  const [trophy] = await db
    .insert(trophies)
    .values({
      streamerId,
      title: input.title.trim(),
      description: input.description.trim(),
      icon: input.icon?.trim() || "🏆",
      rarity: input.rarity,
      requirementType,
      requirementValue,
      sourcePlatform: input.sourcePlatform,
      grantMode: input.grantMode,
      rulesCombineMode: input.rulesCombineMode ?? "and",
    })
    .returning({ id: trophies.id });

  if (!trophy?.id) return { ok: false, error: "Error al crear el trofeo" };

  if (input.grantMode === "auto" && input.rules?.length) {
    await db.insert(trophyRules).values(
      input.rules.map((r, i) => ({
        trophyId: trophy.id,
        ruleType: r.ruleType as "watch_hours" | "following_hours" | "subscription_months" | "consecutive_subscription_months" | "gift_subs",
        value: r.value,
        sortOrder: i,
      }))
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/trophies");
  return { ok: true };
}

export async function grantTrophy(
  trophyId: string,
  userId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session?.user?.id) return { ok: false, error: "No autenticado" };

  const role = (session.user as { role?: string }).role;
  if (role !== "streamer") return { ok: false, error: "Solo los streamers pueden otorgar trofeos" };

  const streamerId = session.user.id;
  const [trophy] = await db.select().from(trophies).where(eq(trophies.id, trophyId)).limit(1);

  if (!trophy) return { ok: false, error: "Trofeo no encontrado" };
  if (trophy.streamerId !== streamerId) return { ok: false, error: "No puedes otorgar este trofeo" };
  if (trophy.grantMode !== "manual") return { ok: false, error: "Este trofeo se desbloquea automáticamente por reglas" };

  await db
    .insert(userTrophies)
    .values({
      userId,
      trophyId,
      isUnlocked: true,
      progress: 0,
    })
    .onConflictDoUpdate({
      target: [userTrophies.userId, userTrophies.trophyId],
      set: { isUnlocked: true, earnedAt: new Date() },
    });

  revalidatePath("/dashboard");
  revalidatePath("/trophies");
  return { ok: true };
}

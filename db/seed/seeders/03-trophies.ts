import type { SeedDb } from "../db";
import { trophies, trophyRules } from "../../schema";
import { SEED_USER_IDS } from "./01-users";

const TROPHY_ICON_PLACEHOLDER = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

export const SEED_TROPHY_IDS = {
  t1: "a0000001-0001-4000-8000-000000000001",
  t2: "a0000001-0001-4000-8000-000000000002",
  t3: "a0000001-0001-4000-8000-000000000003",
  t4: "a0000002-0001-4000-8000-000000000001",
  t5: "a0000002-0001-4000-8000-000000000002",
} as const;

export async function seedTrophies(db: SeedDb) {
  await db.insert(trophies).values([
    {
      id: SEED_TROPHY_IDS.t1,
      streamerId: SEED_USER_IDS.streamer1,
      title: "Primera hora",
      description: "Una hora viendo el canal.",
      icon: TROPHY_ICON_PLACEHOLDER,
      rarity: "common",
      requirementType: "watch_hours",
      requirementValue: 1,
      sourcePlatform: "Twitch",
      grantMode: "auto",
      rulesCombineMode: "and",
      isActive: true,
    },
    {
      id: SEED_TROPHY_IDS.t2,
      streamerId: SEED_USER_IDS.streamer1,
      title: "Suscriptor 1 mes",
      description: "Un mes suscrito al canal.",
      icon: TROPHY_ICON_PLACEHOLDER,
      rarity: "rare",
      requirementType: "subscription_months",
      requirementValue: 1,
      sourcePlatform: "Twitch",
      grantMode: "auto",
      rulesCombineMode: "and",
      isActive: true,
    },
    {
      id: SEED_TROPHY_IDS.t3,
      streamerId: SEED_USER_IDS.streamer1,
      title: "VIP del chat",
      description: "Trofeo especial del streamer.",
      icon: TROPHY_ICON_PLACEHOLDER,
      rarity: "legendary",
      requirementType: "manual",
      sourcePlatform: "Twitch",
      grantMode: "manual",
      rulesCombineMode: "and",
      isActive: true,
    },
    {
      id: SEED_TROPHY_IDS.t4,
      streamerId: SEED_USER_IDS.streamer2,
      title: "Bienvenido",
      description: "Primera vez en el canal.",
      icon: TROPHY_ICON_PLACEHOLDER,
      rarity: "common",
      requirementType: "watch_hours",
      requirementValue: 1,
      sourcePlatform: "Kick",
      grantMode: "auto",
      rulesCombineMode: "and",
      isActive: true,
    },
    {
      id: SEED_TROPHY_IDS.t5,
      streamerId: SEED_USER_IDS.streamer2,
      title: "Fan 10h",
      description: "Diez horas de visionado.",
      icon: TROPHY_ICON_PLACEHOLDER,
      rarity: "epic",
      requirementType: "watch_hours",
      requirementValue: 10,
      sourcePlatform: "Kick",
      grantMode: "auto",
      rulesCombineMode: "and",
      isActive: true,
    },
  ]).onConflictDoNothing();

  await db.insert(trophyRules).values([
    { trophyId: SEED_TROPHY_IDS.t1, ruleType: "watch_hours", value: 1, sortOrder: 0 },
    { trophyId: SEED_TROPHY_IDS.t2, ruleType: "subscription_months", value: 1, sortOrder: 0 },
    { trophyId: SEED_TROPHY_IDS.t4, ruleType: "watch_hours", value: 1, sortOrder: 0 },
    { trophyId: SEED_TROPHY_IDS.t5, ruleType: "watch_hours", value: 10, sortOrder: 0 },
  ]).onConflictDoNothing();
}

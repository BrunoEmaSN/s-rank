/**
 * Registry of trophy rule types. Add new entries here to support new rules
 * without changing the evaluation logic (trigger + column in user_stats).
 */

export const TROPHY_RULE_TYPES = [
  {
    id: "watch_hours",
    label: "Horas de visualización",
    unit: "horas",
    description: "Tiempo total viendo el canal",
  },
  {
    id: "following_hours",
    label: "Tiempo siguiendo",
    unit: "horas",
    description: "Tiempo desde que sigue al streamer",
  },
  {
    id: "subscription_months",
    label: "Meses suscrito",
    unit: "meses",
    description: "Total de meses suscrito al canal",
  },
  {
    id: "consecutive_subscription_months",
    label: "Meses suscrito consecutivos (mejor racha)",
    unit: "meses",
    description: "Racha más larga de meses suscrito seguidos",
  },
  {
    id: "gift_subs",
    label: "Subs regaladas",
    unit: "subs",
    description: "Número de suscripciones regaladas al canal",
  },
] as const;

export type TrophyRuleTypeId = (typeof TROPHY_RULE_TYPES)[number]["id"];

export const TROPHY_RULE_TYPE_IDS = TROPHY_RULE_TYPES.map((r) => r.id);

export function getTrophyRuleType(id: string) {
  return TROPHY_RULE_TYPES.find((r) => r.id === id);
}

export function isValidRuleType(id: string): id is TrophyRuleTypeId {
  return TROPHY_RULE_TYPE_IDS.includes(id as TrophyRuleTypeId);
}

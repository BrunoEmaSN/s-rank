import {
  pgTable,
  text,
  boolean,
  timestamp,
  primaryKey,
  integer,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

// Better Auth core tables (see https://www.better-auth.com/docs/concepts/database)

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  role: text("role", { enum: ["streamer", "sub"] }).notNull().default("sub"),
  needsRoleSelection: boolean("needs_role_selection").notNull().default(false),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Canales (streamers) para explorar
export const channel = pgTable("channel", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  platform: text("platform", { enum: ["Twitch", "Kick"] }).notNull(),
  trophies: integer("trophies").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Profiles (synced from auth; streamers have platform etc.)
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  username: text("username").unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  isStreamer: boolean("is_streamer").default(false),
  platform: text("platform", { enum: ["twitch", "kick"] }),
  platformUserId: text("platform_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// User stats per (user, streamer, platform) - fed by Twitch/Kick APIs
export const userStats = pgTable(
  "user_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    streamerId: text("streamer_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    platform: text("platform", { enum: ["Twitch", "Kick"] }).notNull().default("Twitch"),
    watchHours: integer("watch_hours").default(0),
    points: integer("points").default(0),
    subscriptionMonths: integer("subscription_months").default(0),
    giftSubs: integer("gift_subs").default(0),
    followingHours: integer("following_hours").default(0),
    consecutiveSubscriptionMonths: integer("consecutive_subscription_months").default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [unique("user_stats_user_id_streamer_id_platform_key").on(t.userId, t.streamerId, t.platform)]
);

// Trophies (streamer-created)
export const trophies = pgTable("trophies", {
  id: uuid("id").primaryKey().defaultRandom(),
  streamerId: text("streamer_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  rarity: text("rarity", { enum: ["common", "rare", "epic", "legendary"] }).notNull(),
  requirementType: text("requirement_type", {
    enum: ["watch_hours", "points", "subscription_months", "gift_subs", "manual"],
  }).notNull(),
  requirementValue: integer("requirement_value"),
  sourcePlatform: text("source_platform", { enum: ["Twitch", "Kick"] }).notNull().default("Twitch"),
  grantMode: text("grant_mode", { enum: ["auto", "manual"] }).notNull().default("auto"),
  rulesCombineMode: text("rules_combine_mode", { enum: ["and", "or"] }).notNull().default("and"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Rules for a trophy (multiple rules per trophy when grant_mode = auto)
export const trophyRules = pgTable("trophy_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  trophyId: uuid("trophy_id")
    .notNull()
    .references(() => trophies.id, { onDelete: "cascade" }),
  ruleType: text("rule_type", {
    enum: [
      "watch_hours",
      "following_hours",
      "subscription_months",
      "consecutive_subscription_months",
      "gift_subs",
    ],
  }).notNull(),
  value: integer("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// User-unlocked trophies (user_id = profiles.id = user.id)
export const userTrophies = pgTable(
  "user_trophies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    trophyId: uuid("trophy_id")
      .notNull()
      .references(() => trophies.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at", { withTimezone: true }).defaultNow(),
    progress: integer("progress").default(0),
    isUnlocked: boolean("is_unlocked").default(false),
  },
  (t) => [unique("user_trophies_user_id_trophy_id_key").on(t.userId, t.trophyId)]
);

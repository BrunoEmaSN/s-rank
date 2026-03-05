/**
 * Integration with Twitch and Kick APIs to fetch viewer stats and persist to user_stats.
 * Used by periodic sync jobs (cron/background) so the unlock trigger can read from DB.
 *
 * To implement:
 * - Twitch: use Helix API (follows, subscriptions, etc.) + any custom view-time if available.
 * - Kick: use Kick API for equivalent metrics.
 * - Store access tokens per streamer (e.g. from account table where providerId = 'twitch'/'kick').
 */

import { db } from "@/lib/db";
import { userStats } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type Platform = "Twitch" | "Kick";

export interface UserStatsRow {
  userId: string;
  streamerId: string;
  platform: Platform;
  watchHours?: number;
  points?: number;
  subscriptionMonths?: number;
  giftSubs?: number;
  followingHours?: number;
  consecutiveSubscriptionMonths?: number;
}

/**
 * Upsert a user's stats for a given streamer and platform.
 * Call this after fetching from Twitch/Kick API (or from your own tracking).
 */
export async function upsertUserStats(row: UserStatsRow) {
  await db
    .insert(userStats)
    .values({
      userId: row.userId,
      streamerId: row.streamerId,
      platform: row.platform,
      watchHours: row.watchHours ?? 0,
      points: row.points ?? 0,
      subscriptionMonths: row.subscriptionMonths ?? 0,
      giftSubs: row.giftSubs ?? 0,
      followingHours: row.followingHours ?? 0,
      consecutiveSubscriptionMonths: row.consecutiveSubscriptionMonths ?? 0,
    })
    .onConflictDoUpdate({
      target: [userStats.userId, userStats.streamerId, userStats.platform],
      set: {
        watchHours: row.watchHours ?? 0,
        points: row.points ?? 0,
        subscriptionMonths: row.subscriptionMonths ?? 0,
        giftSubs: row.giftSubs ?? 0,
        followingHours: row.followingHours ?? 0,
        consecutiveSubscriptionMonths: row.consecutiveSubscriptionMonths ?? 0,
        updatedAt: new Date(),
      },
    });
}

/**
 * Fetch stats from Twitch API for a streamer's channel and persist to user_stats.
 * TODO: Implement with Twitch Helix (get followers, subs, etc.) using streamer's access token.
 */
export async function syncTwitchStatsForStreamer(_streamerId: string): Promise<void> {
  // 1. Get streamer's Twitch access token from account table (providerId = 'twitch').
  // 2. Call Twitch Helix: get followers list, subscription list, etc. for the channel.
  // 3. For each follower/sub, compute watch_hours, following_hours, subscription_months,
  //    consecutive_subscription_months, gift_subs (from API or your own tracking).
  // 4. Call upsertUserStats for each (userId, streamerId, 'Twitch') with the metrics.
}

/**
 * Fetch stats from Kick API for a streamer's channel and persist to user_stats.
 * TODO: Implement with Kick API using streamer's credentials.
 */
export async function syncKickStatsForStreamer(_streamerId: string): Promise<void> {
  // 1. Get streamer's Kick token.
  // 2. Call Kick API for channel followers/subs metrics.
  // 3. Call upsertUserStats for each (userId, streamerId, 'Kick').
}

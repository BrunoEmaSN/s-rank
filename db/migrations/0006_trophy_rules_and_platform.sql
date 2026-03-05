-- user_stats: add platform and new stat columns; change unique to (user_id, streamer_id, platform)
ALTER TABLE public.user_stats
  ADD COLUMN IF NOT EXISTS platform text,
  ADD COLUMN IF NOT EXISTS following_hours integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS consecutive_subscription_months integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
UPDATE public.user_stats SET platform = 'Twitch' WHERE platform IS NULL;
--> statement-breakpoint
ALTER TABLE public.user_stats ALTER COLUMN platform SET DEFAULT 'Twitch';
--> statement-breakpoint
ALTER TABLE public.user_stats ALTER COLUMN platform SET NOT NULL;
--> statement-breakpoint
ALTER TABLE public.user_stats ADD CONSTRAINT user_stats_platform_check CHECK (platform IN ('Twitch', 'Kick'));
--> statement-breakpoint
ALTER TABLE public.user_stats DROP CONSTRAINT IF EXISTS user_stats_user_id_streamer_id_key;
--> statement-breakpoint
ALTER TABLE public.user_stats ADD CONSTRAINT user_stats_user_id_streamer_id_platform_key UNIQUE (user_id, streamer_id, platform);

--> statement-breakpoint
-- trophies: add source_platform, grant_mode, rules_combine_mode
ALTER TABLE public.trophies
  ADD COLUMN IF NOT EXISTS source_platform text,
  ADD COLUMN IF NOT EXISTS grant_mode text DEFAULT 'auto' NOT NULL,
  ADD COLUMN IF NOT EXISTS rules_combine_mode text DEFAULT 'and' NOT NULL;
--> statement-breakpoint
UPDATE public.trophies SET source_platform = 'Twitch' WHERE source_platform IS NULL;
--> statement-breakpoint
UPDATE public.trophies SET grant_mode = CASE WHEN requirement_type = 'manual' THEN 'manual' ELSE 'auto' END;
--> statement-breakpoint
ALTER TABLE public.trophies ALTER COLUMN source_platform SET DEFAULT 'Twitch';
--> statement-breakpoint
ALTER TABLE public.trophies ALTER COLUMN source_platform SET NOT NULL;
--> statement-breakpoint
ALTER TABLE public.trophies ADD CONSTRAINT trophies_source_platform_check CHECK (source_platform IN ('Twitch', 'Kick'));
--> statement-breakpoint
ALTER TABLE public.trophies ADD CONSTRAINT trophies_grant_mode_check CHECK (grant_mode IN ('auto', 'manual'));
--> statement-breakpoint
ALTER TABLE public.trophies ADD CONSTRAINT trophies_rules_combine_mode_check CHECK (rules_combine_mode IN ('and', 'or'));

--> statement-breakpoint
-- trophy_rules table
CREATE TABLE IF NOT EXISTS public.trophy_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trophy_id uuid NOT NULL REFERENCES public.trophies(id) ON DELETE CASCADE,
  rule_type text NOT NULL,
  value integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE public.trophy_rules ADD CONSTRAINT trophy_rules_rule_type_check CHECK (rule_type IN (
  'watch_hours',
  'following_hours',
  'subscription_months',
  'consecutive_subscription_months',
  'gift_subs'
));
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS trophy_rules_trophy_id_idx ON public.trophy_rules(trophy_id);

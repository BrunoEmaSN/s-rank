-- Based on scripts/001_create_database_schema.sql
-- Adapted for Better Auth: public.user (id text). No RLS (auth in app).

CREATE TABLE IF NOT EXISTS public.profiles (
  id text PRIMARY KEY REFERENCES public."user"(id) ON DELETE CASCADE,
  email text NOT NULL,
  username text UNIQUE,
  display_name text,
  avatar_url text,
  is_streamer boolean DEFAULT false,
  platform text CHECK (platform IN ('twitch', 'kick')),
  platform_user_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS public.trophies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  streamer_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  rarity text NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  requirement_type text NOT NULL CHECK (requirement_type IN ('watch_hours', 'points', 'subscription_months', 'gift_subs', 'manual')),
  requirement_value integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS public.user_trophies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trophy_id uuid NOT NULL REFERENCES public.trophies(id) ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT now(),
  progress integer DEFAULT 0,
  is_unlocked boolean DEFAULT false,
  UNIQUE(user_id, trophy_id)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS public.user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  streamer_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  watch_hours integer DEFAULT 0,
  points integer DEFAULT 0,
  subscription_months integer DEFAULT 0,
  gift_subs integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, streamer_id)
);

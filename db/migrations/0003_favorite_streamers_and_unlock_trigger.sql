-- Based on scripts/003_add_favorite_streamers.sql
CREATE TABLE IF NOT EXISTS public.favorite_streamers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  streamer_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, streamer_id)
);
--> statement-breakpoint
-- Trigger to auto-unlock trophies when user_stats are updated (from 001 script)
CREATE OR REPLACE FUNCTION public.check_and_unlock_trophies()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  trophy_record record;
BEGIN
  FOR trophy_record IN
    SELECT * FROM public.trophies
    WHERE streamer_id = NEW.streamer_id
    AND is_active = true
    AND requirement_type != 'manual'
  LOOP
    IF (trophy_record.requirement_type = 'watch_hours' AND NEW.watch_hours >= trophy_record.requirement_value) OR
       (trophy_record.requirement_type = 'points' AND NEW.points >= trophy_record.requirement_value) OR
       (trophy_record.requirement_type = 'subscription_months' AND NEW.subscription_months >= trophy_record.requirement_value) OR
       (trophy_record.requirement_type = 'gift_subs' AND NEW.gift_subs >= trophy_record.requirement_value) THEN
      INSERT INTO public.user_trophies (user_id, trophy_id, is_unlocked, progress)
      VALUES (NEW.user_id, trophy_record.id, true, COALESCE(trophy_record.requirement_value, 0))
      ON CONFLICT (user_id, trophy_id)
      DO UPDATE SET is_unlocked = true, earned_at = now();
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS on_user_stats_updated ON public.user_stats;
--> statement-breakpoint
CREATE TRIGGER on_user_stats_updated
  AFTER INSERT OR UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_unlock_trophies();

-- When a user unlocks a trophy (insert or update to is_unlocked = true),
-- insert a community_post (trophy_unlock) if the streamer has a community and the user is a member.
CREATE OR REPLACE FUNCTION public.on_user_trophy_unlocked_community_post()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_streamer_id text;
  v_community_id uuid;
  v_is_member boolean;
BEGIN
  IF NEW.is_unlocked IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  SELECT t.streamer_id INTO v_streamer_id
  FROM trophies t
  WHERE t.id = NEW.trophy_id
  LIMIT 1;

  IF v_streamer_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT c.id INTO v_community_id
  FROM community c
  WHERE c.streamer_id = v_streamer_id
  LIMIT 1;

  IF v_community_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM community_member cm
    WHERE cm.community_id = v_community_id
      AND cm.user_id = NEW.user_id
    LIMIT 1
  ) INTO v_is_member;

  IF NOT v_is_member THEN
    RETURN NEW;
  END IF;

  INSERT INTO community_post (community_id, user_id, type, trophy_id, user_trophy_id)
  VALUES (v_community_id, NEW.user_id, 'trophy_unlock', NEW.trophy_id, NEW.id);

  RETURN NEW;
END;
$$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS on_user_trophy_unlocked_community_post ON public.user_trophies;
--> statement-breakpoint
CREATE TRIGGER on_user_trophy_unlocked_community_post
  AFTER INSERT OR UPDATE OF is_unlocked ON public.user_trophies
  FOR EACH ROW
  WHEN (NEW.is_unlocked = true)
  EXECUTE FUNCTION public.on_user_trophy_unlocked_community_post();

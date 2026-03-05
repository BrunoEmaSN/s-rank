-- Update trigger: filter by source_platform and grant_mode; evaluate trophy_rules
CREATE OR REPLACE FUNCTION public.check_and_unlock_trophies()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  trophy_record record;
  rule_record record;
  rule_count int;
  rules_passed int;
  rule_ok boolean;
  all_passed boolean;
BEGIN
  -- Only evaluate trophies for this streamer, active, auto-grant, and matching platform
  FOR trophy_record IN
    SELECT * FROM public.trophies t
    WHERE t.streamer_id = NEW.streamer_id
      AND t.is_active = true
      AND t.grant_mode = 'auto'
      AND t.source_platform = NEW.platform
  LOOP
    all_passed := false;

    SELECT COUNT(*) INTO rule_count FROM public.trophy_rules WHERE trophy_id = trophy_record.id;

    IF rule_count > 0 THEN
      -- New logic: evaluate each rule from trophy_rules
      IF trophy_record.rules_combine_mode = 'and' THEN
        all_passed := true;
        FOR rule_record IN
          SELECT * FROM public.trophy_rules WHERE trophy_id = trophy_record.id ORDER BY sort_order
        LOOP
          rule_ok := false;
          IF rule_record.rule_type = 'watch_hours' AND NEW.watch_hours >= rule_record.value THEN rule_ok := true; END IF;
          IF rule_record.rule_type = 'following_hours' AND NEW.following_hours >= rule_record.value THEN rule_ok := true; END IF;
          IF rule_record.rule_type = 'subscription_months' AND NEW.subscription_months >= rule_record.value THEN rule_ok := true; END IF;
          IF rule_record.rule_type = 'consecutive_subscription_months' AND NEW.consecutive_subscription_months >= rule_record.value THEN rule_ok := true; END IF;
          IF rule_record.rule_type = 'gift_subs' AND NEW.gift_subs >= rule_record.value THEN rule_ok := true; END IF;
          IF NOT rule_ok THEN all_passed := false; EXIT; END IF;
        END LOOP;
      ELSE
        -- rules_combine_mode = 'or'
        FOR rule_record IN
          SELECT * FROM public.trophy_rules WHERE trophy_id = trophy_record.id ORDER BY sort_order
        LOOP
          rule_ok := false;
          IF rule_record.rule_type = 'watch_hours' AND NEW.watch_hours >= rule_record.value THEN rule_ok := true; END IF;
          IF rule_record.rule_type = 'following_hours' AND NEW.following_hours >= rule_record.value THEN rule_ok := true; END IF;
          IF rule_record.rule_type = 'subscription_months' AND NEW.subscription_months >= rule_record.value THEN rule_ok := true; END IF;
          IF rule_record.rule_type = 'consecutive_subscription_months' AND NEW.consecutive_subscription_months >= rule_record.value THEN rule_ok := true; END IF;
          IF rule_record.rule_type = 'gift_subs' AND NEW.gift_subs >= rule_record.value THEN rule_ok := true; END IF;
          IF rule_ok THEN all_passed := true; EXIT; END IF;
        END LOOP;
      END IF;
    ELSE
      -- Legacy: single requirement_type / requirement_value
      IF trophy_record.requirement_type = 'watch_hours' AND NEW.watch_hours >= COALESCE(trophy_record.requirement_value, 0) THEN all_passed := true; END IF;
      IF trophy_record.requirement_type = 'points' AND NEW.points >= COALESCE(trophy_record.requirement_value, 0) THEN all_passed := true; END IF;
      IF trophy_record.requirement_type = 'subscription_months' AND NEW.subscription_months >= COALESCE(trophy_record.requirement_value, 0) THEN all_passed := true; END IF;
      IF trophy_record.requirement_type = 'gift_subs' AND NEW.gift_subs >= COALESCE(trophy_record.requirement_value, 0) THEN all_passed := true; END IF;
    END IF;

    IF all_passed THEN
      INSERT INTO public.user_trophies (user_id, trophy_id, is_unlocked, progress)
      VALUES (NEW.user_id, trophy_record.id, true, 0)
      ON CONFLICT (user_id, trophy_id)
      DO UPDATE SET is_unlocked = true, earned_at = now();
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;

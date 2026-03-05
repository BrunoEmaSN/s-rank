-- Based on scripts/002_create_profile_trigger.sql
-- Trigger on public.user (Better Auth) to create profile on signup.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, username, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.name, split_part(NEW.email, '@', 1)),
    LOWER(REPLACE(COALESCE(NEW.name, split_part(NEW.email, '@', 1)), ' ', '_')),
    NEW.image,
    COALESCE(NEW.created_at, now()),
    COALESCE(NEW.updated_at, now())
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS on_user_created ON public."user";
--> statement-breakpoint
CREATE TRIGGER on_user_created
  AFTER INSERT ON public."user"
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

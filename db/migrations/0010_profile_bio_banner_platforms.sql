-- profiles: bio, banner, linked platforms (Twitch/Kick usernames)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS twitch_username text,
  ADD COLUMN IF NOT EXISTS kick_username text;

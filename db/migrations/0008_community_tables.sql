-- Community: one per streamer
CREATE TABLE IF NOT EXISTS public.community (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  streamer_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(streamer_id)
);
--> statement-breakpoint
-- Community members
CREATE TABLE IF NOT EXISTS public.community_member (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.community(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(community_id, user_id)
);
--> statement-breakpoint
-- Community feed posts
CREATE TABLE IF NOT EXISTS public.community_post (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.community(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('trophy_unlock', 'trophy_share')),
  trophy_id uuid REFERENCES public.trophies(id) ON DELETE SET NULL,
  user_trophy_id uuid REFERENCES public.user_trophies(id) ON DELETE SET NULL,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
--> statement-breakpoint
-- Trophy requests (user requests manual trophy with optional proof)
CREATE TABLE IF NOT EXISTS public.trophy_request (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.community(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trophy_id uuid NOT NULL REFERENCES public.trophies(id) ON DELETE CASCADE,
  message text NOT NULL,
  proof_image_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at timestamp with time zone,
  reviewed_by text REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

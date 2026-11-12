-- ==============================================================================
-- DJ EMMA PRO | THE WAKANDA BOSS - COMPLETE SECURE SUPABASE SQL SCHEMA
-- Version: 2.0 (Production Verified, Safe to Re-Run)
-- Master Admin Email: supamaya256@gmail.com
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. HELPER EXTENSIONS & TIMESTAMP FUNCTION
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. VERIFIED ADMIN ACCESS SYSTEM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Master Security Definer: Checks if calling user is the verified admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT (
    -- 1. Direct match with DJ EMMA PRO verified admin email
    LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'supamaya256@gmail.com'
    OR
    -- 2. Registered in admin_users table
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() 
         OR LOWER(email) = LOWER(COALESCE(auth.jwt() ->> 'email', ''))
    )
    OR
    -- 3. Verified custom app_metadata role
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 3. CONTENT TABLES (LIVE MIXES, NONSTOPS, NEWS POSTS, ARTIST INFO)
-- ------------------------------------------------------------------------------

-- Live Mixes Table
CREATE TABLE IF NOT EXISTS public.live_mixes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  genre TEXT DEFAULT 'Afrobeats / Club Mix',
  duration TEXT DEFAULT '45:00',
  audio_url TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  plays_count INTEGER NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Nonstop Mixes Table
CREATE TABLE IF NOT EXISTS public.nonstop_mixes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  genre TEXT DEFAULT 'Ugandan Nonstop / Party Mix',
  duration TEXT DEFAULT '1:15:00',
  audio_url TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  tracklist JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  plays_count INTEGER NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- News & Official Announcements Table
CREATE TABLE IF NOT EXISTS public.news_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT true,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artist Biography & Contact Profile Table
CREATE TABLE IF NOT EXISTS public.artist_info (
  id TEXT PRIMARY KEY DEFAULT 'dj_emma_pro',
  stage_name TEXT NOT NULL DEFAULT 'DJ EMMA PRO',
  alias TEXT NOT NULL DEFAULT 'THE WAKANDA BOSS',
  tagline TEXT NOT NULL DEFAULT 'Uganda’s Premier DJ, Mixing Prodigy & Creative Architect',
  bio TEXT NOT NULL,
  origin TEXT NOT NULL DEFAULT 'Serere District, Teso Region, Eastern Uganda',
  base_location TEXT NOT NULL DEFAULT 'Kampala, Uganda',
  phone TEXT NOT NULL DEFAULT '+256 788 123 456',
  email TEXT NOT NULL DEFAULT 'supamaya256@gmail.com',
  booking_whatsapp TEXT NOT NULL DEFAULT '+256788123456',
  avatar_url TEXT DEFAULT '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
  hero_portrait_url TEXT DEFAULT '/assets/aistudio/file_00000000577482118275a24f7cbcec0a_37ac2a88.png',
  social_links JSONB DEFAULT '{
    "tiktok": "https://tiktok.com/@djemmapro",
    "instagram": "https://instagram.com/djemmapro",
    "youtube": "https://youtube.com/@djemmapro",
    "facebook": "https://facebook.com/djemmapro"
  }'::jsonb,
  services JSONB DEFAULT '[
    {"id": "1", "title": "Live Club & Concert DJ Mixing", "desc": "Electrifying crowd-pulling sets spanning Afrobeats, Dancehall, Amapiano & Ugandan hits."},
    {"id": "2", "title": "Custom DJ Drops & Intros", "desc": "Signature studio-grade DJ drops, radio jingles, and promotional voiceovers."},
    {"id": "3", "title": "Graphic Design & Creative Branding", "desc": "Album artwork, event flyers, social media kits, and 3D metallic logos."},
    {"id": "4", "title": "Mixtape Production & Audio Mastering", "desc": "Seamlessly blended party tapes and pristine studio audio mastering."}
  ]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Homepage Headline Configuration Table
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id TEXT PRIMARY KEY DEFAULT 'current',
  hero_title TEXT DEFAULT 'DJ EMMA PRO',
  hero_subtitle TEXT DEFAULT 'THE WAKANDA BOSS',
  tagline TEXT DEFAULT 'UGANDAN DJ & CREATIVE PROFESSIONAL',
  featured_mix_id TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. VISITOR LIKES SYSTEM (DUPLICATE-PREVENTING & TOGGLE FUNCTION)
-- ------------------------------------------------------------------------------

-- Post Likes Table (Tracking each visitor like uniquely)
CREATE TABLE IF NOT EXISTS public.post_likes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.news_posts(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_post_visitor_like UNIQUE (post_id, visitor_id)
);

-- Mix & Nonstop Likes Table (Tracking each visitor like uniquely)
CREATE TABLE IF NOT EXISTS public.mix_likes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  mix_id TEXT NOT NULL,
  mix_type TEXT NOT NULL CHECK (mix_type IN ('live', 'nonstop')),
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_mix_visitor_like UNIQUE (mix_id, visitor_id)
);

-- Function: Toggle Post Like atomically (Increments/Decrements & Prevents Duplicates)
CREATE OR REPLACE FUNCTION public.toggle_post_like(p_post_id TEXT, p_visitor_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_liked BOOLEAN;
  v_count INTEGER;
BEGIN
  IF EXISTS (SELECT 1 FROM public.post_likes WHERE post_id = p_post_id AND visitor_id = p_visitor_id) THEN
    DELETE FROM public.post_likes WHERE post_id = p_post_id AND visitor_id = p_visitor_id;
    UPDATE public.news_posts SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE id = p_post_id;
    v_liked := false;
  ELSE
    INSERT INTO public.post_likes (post_id, visitor_id) VALUES (p_post_id, p_visitor_id) ON CONFLICT DO NOTHING;
    UPDATE public.news_posts SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = p_post_id;
    v_liked := true;
  END IF;

  SELECT COALESCE(likes_count, 0) INTO v_count FROM public.news_posts WHERE id = p_post_id;
  RETURN jsonb_build_object('liked', v_liked, 'likes_count', COALESCE(v_count, 0));
END;
$$;

-- Function: Toggle Mix Like atomically (Increments/Decrements & Prevents Duplicates)
CREATE OR REPLACE FUNCTION public.toggle_mix_like(p_mix_id TEXT, p_mix_type TEXT, p_visitor_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_liked BOOLEAN;
  v_count INTEGER;
BEGIN
  IF EXISTS (SELECT 1 FROM public.mix_likes WHERE mix_id = p_mix_id AND visitor_id = p_visitor_id) THEN
    DELETE FROM public.mix_likes WHERE mix_id = p_mix_id AND visitor_id = p_visitor_id;
    IF p_mix_type = 'live' THEN
      UPDATE public.live_mixes SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE id = p_mix_id;
      SELECT COALESCE(likes_count, 0) INTO v_count FROM public.live_mixes WHERE id = p_mix_id;
    ELSE
      UPDATE public.nonstop_mixes SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE id = p_mix_id;
      SELECT COALESCE(likes_count, 0) INTO v_count FROM public.nonstop_mixes WHERE id = p_mix_id;
    END IF;
    v_liked := false;
  ELSE
    INSERT INTO public.mix_likes (mix_id, mix_type, visitor_id) VALUES (p_mix_id, p_mix_type, p_visitor_id) ON CONFLICT DO NOTHING;
    IF p_mix_type = 'live' THEN
      UPDATE public.live_mixes SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = p_mix_id;
      SELECT COALESCE(likes_count, 0) INTO v_count FROM public.live_mixes WHERE id = p_mix_id;
    ELSE
      UPDATE public.nonstop_mixes SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = p_mix_id;
      SELECT COALESCE(likes_count, 0) INTO v_count FROM public.nonstop_mixes WHERE id = p_mix_id;
    END IF;
    v_liked := true;
  END IF;

  RETURN jsonb_build_object('liked', v_liked, 'likes_count', COALESCE(v_count, 0));
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_post_like(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_mix_like(TEXT, TEXT, TEXT) TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 4B. COMMENTS TABLE (PUBLIC VISITOR COMMENTS SYSTEM - PERMANENT PERSISTENCE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY DEFAULT ('comment-' || floor(extract(epoch from now()) * 1000)::text || '-' || substr(md5(random()::text), 1, 6)),
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('news', 'live', 'nonstop')),
  author_name TEXT NOT NULL DEFAULT 'Wakanda Fan',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_news_published_created ON public.news_posts (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_published_created ON public.live_mixes (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nonstop_published_created ON public.nonstop_mixes (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_lookup ON public.post_likes (post_id, visitor_id);
CREATE INDEX IF NOT EXISTS idx_mix_likes_lookup ON public.mix_likes (mix_id, visitor_id);
CREATE INDEX IF NOT EXISTS idx_comments_target_created ON public.comments (target_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. UPDATED_AT TRIGGERS
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_live_mixes_updated ON public.live_mixes;
CREATE TRIGGER trg_live_mixes_updated BEFORE UPDATE ON public.live_mixes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_nonstop_mixes_updated ON public.nonstop_mixes;
CREATE TRIGGER trg_nonstop_mixes_updated BEFORE UPDATE ON public.nonstop_mixes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_news_posts_updated ON public.news_posts;
CREATE TRIGGER trg_news_posts_updated BEFORE UPDATE ON public.news_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_artist_info_updated ON public.artist_info;
CREATE TRIGGER trg_artist_info_updated BEFORE UPDATE ON public.artist_info FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_homepage_content_updated ON public.homepage_content;
CREATE TRIGGER trg_homepage_content_updated BEFORE UPDATE ON public.homepage_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nonstop_mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mix_likes ENABLE ROW LEVEL SECURITY;

-- ADMIN USERS TABLE: Only verified admin can view/manage
DROP POLICY IF EXISTS "Admin only read admin_users" ON public.admin_users;
CREATE POLICY "Admin only read admin_users" ON public.admin_users
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admin only write admin_users" ON public.admin_users;
CREATE POLICY "Admin only write admin_users" ON public.admin_users
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- LIVE MIXES: Public reads published only; Admin manages all
DROP POLICY IF EXISTS "Public read published live mixes" ON public.live_mixes;
CREATE POLICY "Public read published live mixes" ON public.live_mixes
  FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert live mixes" ON public.live_mixes;
CREATE POLICY "Admin insert live mixes" ON public.live_mixes
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update live mixes" ON public.live_mixes;
CREATE POLICY "Admin update live mixes" ON public.live_mixes
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete live mixes" ON public.live_mixes;
CREATE POLICY "Admin delete live mixes" ON public.live_mixes
  FOR DELETE USING (public.is_admin());

-- NONSTOPS: Public reads published only; Admin manages all
DROP POLICY IF EXISTS "Public read published nonstops" ON public.nonstop_mixes;
CREATE POLICY "Public read published nonstops" ON public.nonstop_mixes
  FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert nonstops" ON public.nonstop_mixes;
CREATE POLICY "Admin insert nonstops" ON public.nonstop_mixes
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update nonstops" ON public.nonstop_mixes;
CREATE POLICY "Admin update nonstops" ON public.nonstop_mixes
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete nonstops" ON public.nonstop_mixes;
CREATE POLICY "Admin delete nonstops" ON public.nonstop_mixes
  FOR DELETE USING (public.is_admin());

-- NEWS POSTS: Public reads published only; Admin manages all
DROP POLICY IF EXISTS "Public read published news posts" ON public.news_posts;
CREATE POLICY "Public read published news posts" ON public.news_posts
  FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert news posts" ON public.news_posts;
CREATE POLICY "Admin insert news posts" ON public.news_posts
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update news posts" ON public.news_posts;
CREATE POLICY "Admin update news posts" ON public.news_posts
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete news posts" ON public.news_posts;
CREATE POLICY "Admin delete news posts" ON public.news_posts
  FOR DELETE USING (public.is_admin());

-- ARTIST INFO: Public read; Admin update only
DROP POLICY IF EXISTS "Public read artist info" ON public.artist_info;
CREATE POLICY "Public read artist info" ON public.artist_info
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage artist info" ON public.artist_info;
CREATE POLICY "Admin manage artist info" ON public.artist_info
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- HOMEPAGE CONTENT: Public read; Admin update only
DROP POLICY IF EXISTS "Public read homepage content" ON public.homepage_content;
CREATE POLICY "Public read homepage content" ON public.homepage_content
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage homepage content" ON public.homepage_content;
CREATE POLICY "Admin manage homepage content" ON public.homepage_content
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- LIKES TABLES: Anyone can read likes and toggle their own like
DROP POLICY IF EXISTS "Public read post likes" ON public.post_likes;
CREATE POLICY "Public read post likes" ON public.post_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert post likes" ON public.post_likes;
CREATE POLICY "Public insert post likes" ON public.post_likes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete post likes" ON public.post_likes;
CREATE POLICY "Public delete post likes" ON public.post_likes FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public read mix likes" ON public.mix_likes;
CREATE POLICY "Public read mix likes" ON public.mix_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert mix likes" ON public.mix_likes;
CREATE POLICY "Public insert mix likes" ON public.mix_likes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete mix likes" ON public.mix_likes;
CREATE POLICY "Public delete mix likes" ON public.mix_likes FOR DELETE USING (true);

-- COMMENTS TABLE: Everyone can read and post; Admins can delete
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read comments" ON public.comments;
CREATE POLICY "Public read comments" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert comments" ON public.comments;
CREATE POLICY "Public insert comments" ON public.comments FOR INSERT WITH CHECK (
  char_length(trim(content)) > 0 AND char_length(content) <= 500
);

DROP POLICY IF EXISTS "Admin delete comments" ON public.comments;
CREATE POLICY "Admin delete comments" ON public.comments FOR DELETE USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. SUPABASE STORAGE BUCKETS & POLICIES
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('audio-files', 'audio-files', true, 524288000, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/x-m4a']),
  ('artwork-images', 'artwork-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('news-images', 'news-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Objects Policies: Public read
DROP POLICY IF EXISTS "Public can view audio files" ON storage.objects;
CREATE POLICY "Public can view audio files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('audio-files', 'artwork-images', 'news-images'));

-- Storage Objects Policies: Admin only uploads/changes/deletions
DROP POLICY IF EXISTS "Admin can upload storage files" ON storage.objects;
CREATE POLICY "Admin can upload storage files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('audio-files', 'artwork-images', 'news-images') 
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admin can update storage files" ON storage.objects;
CREATE POLICY "Admin can update storage files" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('audio-files', 'artwork-images', 'news-images') 
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admin can delete storage files" ON storage.objects;
CREATE POLICY "Admin can delete storage files" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('audio-files', 'artwork-images', 'news-images') 
    AND public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- 9. INITIAL DEFAULT ARTIST PROFILE SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.artist_info (id, stage_name, alias, tagline, bio, origin, base_location, phone, email, booking_whatsapp)
VALUES (
  'dj_emma_pro',
  'DJ EMMA PRO',
  'THE WAKANDA BOSS',
  'Uganda’s Premier DJ, Mixing Prodigy & Creative Architect',
  'DJ EMMA PRO is a Ugandan DJ and creative professional from Serere District in the Teso Region of Eastern Uganda, based in Kampala. He is passionate about music entertainment, DJ mixing, graphic design, creative branding and professional DJ drops. Known as THE WAKANDA BOSS, DJ EMMA PRO represents the Ugandan entertainment scene through music, creativity and energetic mixes.',
  'Serere District, Teso Region, Eastern Uganda',
  'Kampala, Uganda',
  '+256 788 123 456',
  'supamaya256@gmail.com',
  '+256788123456'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.homepage_content (id, hero_title, hero_subtitle, tagline, featured_mix_id)
VALUES (
  'current',
  'DJ EMMA PRO',
  'THE WAKANDA BOSS',
  'UGANDAN DJ & CREATIVE PROFESSIONAL',
  ''
)
ON CONFLICT (id) DO NOTHING;

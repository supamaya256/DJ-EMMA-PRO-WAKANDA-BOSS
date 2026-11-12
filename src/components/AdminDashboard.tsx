import React, { useState, useEffect } from 'react';
import { 
  LiveMix, 
  NonstopMix, 
  NewsPost,
  ArtistInfo, 
  HomepageConfig, 
  SupabaseStatus 
} from '../types';
import { 
  Radio, 
  Music, 
  User, 
  Database, 
  Key, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Plus, 
  Check, 
  AlertCircle, 
  Save, 
  LogOut, 
  RefreshCw,
  Copy,
  ShieldCheck,
  Newspaper,
  Image as ImageIcon,
  Heart,
  ExternalLink,
  Volume2,
  Play,
  Square
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  liveMixes: LiveMix[];
  nonstops: NonstopMix[];
  newsPosts: NewsPost[];
  artist: ArtistInfo;
  homepage: HomepageConfig;
  onRefreshData: () => Promise<void>;
  onNavigateHome?: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  liveMixes,
  nonstops,
  newsPosts = [],
  artist,
  homepage,
  onRefreshData,
  onNavigateHome,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'live' | 'nonstops' | 'artist' | 'supabase' | 'security'>('news');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Supabase status state
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('https://ruyediepdsvycrxniplt.supabase.co');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('sb_publishable_EaGYMl3jfXzLvuJTGLH7oA_N_3yM9gw');

  // Welcome Audio State
  const [isPlayingWelcome, setIsPlayingWelcome] = useState(false);
  const [copiedWelcomeSql, setCopiedWelcomeSql] = useState(false);
  const [uploadingWelcome, setUploadingWelcome] = useState(false);
  const welcomeTestAudioRef = React.useRef<HTMLAudioElement | null>(null);

  // News Form State
  const [isEditingNews, setIsEditingNews] = useState<NewsPost | null>(null);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsPublished, setNewsPublished] = useState(true);
  const [isUploadingNewsImage, setIsUploadingNewsImage] = useState(false);

  // Live Mix Form State
  const [isEditingLive, setIsEditingLive] = useState<LiveMix | null>(null);
  const [showLiveForm, setShowLiveForm] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [liveDescription, setLiveDescription] = useState('');
  const [liveGenre, setLiveGenre] = useState('Afrobeats / Club Mix');
  const [liveDuration, setLiveDuration] = useState('45:00');
  const [liveAudioUrl, setLiveAudioUrl] = useState('');
  const [liveCoverUrl, setLiveCoverUrl] = useState('');
  const [livePublished, setLivePublished] = useState(true);
  const [isUploadingLiveAudio, setIsUploadingLiveAudio] = useState(false);
  const [isUploadingLiveCover, setIsUploadingLiveCover] = useState(false);

  // Nonstop Form State
  const [isEditingNonstop, setIsEditingNonstop] = useState<NonstopMix | null>(null);
  const [showNonstopForm, setShowNonstopForm] = useState(false);
  const [nonstopTitle, setNonstopTitle] = useState('');
  const [nonstopDescription, setNonstopDescription] = useState('');
  const [nonstopGenre, setNonstopGenre] = useState('Ugandan Nonstop / Party Mix');
  const [nonstopDuration, setNonstopDuration] = useState('1:15:00');
  const [nonstopAudioUrl, setNonstopAudioUrl] = useState('');
  const [nonstopCoverUrl, setNonstopCoverUrl] = useState('');
  const [nonstopTracklistText, setNonstopTracklistText] = useState('');
  const [nonstopPublished, setNonstopPublished] = useState(true);
  const [isUploadingNonstopAudio, setIsUploadingNonstopAudio] = useState(false);
  const [isUploadingNonstopCover, setIsUploadingNonstopCover] = useState(false);

  // Artist Form State
  const [artistForm, setArtistForm] = useState<ArtistInfo>(artist);

  // Security Form State
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  // SQL schema copied notification
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    fetchSupabaseStatus();
  }, []);

  useEffect(() => {
    setArtistForm(artist);
  }, [artist]);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const fetchSupabaseStatus = async () => {
    setTestingSupabase(true);
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      setSupabaseStatus(data);
    } catch {
      setSupabaseStatus({
        configured: false,
        connected: false,
        storageMode: 'server-persistent',
        message: 'Could not contact server API.',
      });
    } finally {
      setTestingSupabase(false);
    }
  };

  // ----------------------------------------------------
  // FILE UPLOAD HELPER
  // ----------------------------------------------------
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'audio' | 'image',
    setter: (url: string) => void,
    loadingSetter: (loading: boolean) => void,
    bucket: 'audio-files' | 'artwork-images' | 'news-images' = type === 'audio' ? 'audio-files' : 'artwork-images'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    loadingSetter(true);

    try {
      // 1. Direct Supabase Storage upload if authenticated session exists
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          const fileExt = file.name.split('.').pop() || (type === 'audio' ? 'mp3' : 'jpg');
          const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const storagePath = `${Date.now()}_${cleanName}`;
          
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from(bucket)
            .upload(storagePath, file, {
              contentType: file.type || (type === 'audio' ? 'audio/mpeg' : 'image/jpeg'),
              upsert: true,
            });

          if (!uploadErr && uploadData) {
            const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
            if (pubData?.publicUrl) {
              setter(pubData.publicUrl);
              showStatus('success', `${type === 'audio' ? 'Audio file' : 'Image'} uploaded directly to Supabase storage (${bucket})!`);
              loadingSetter(false);
              return;
            }
          }
        }
      } catch (clientErr) {
        console.warn('Client Supabase direct upload fallback:', clientErr);
      }

      // 2. Server upload with bucket parameter
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const res = await fetch(`/api/upload?bucket=${encodeURIComponent(bucket)}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setter(data.url);
        showStatus('success', `${type === 'audio' ? 'Audio file' : 'Image'} uploaded successfully! (${bucket})`);
      } else {
        showStatus('error', data.message || 'File upload failed');
      }
    } catch (err: any) {
      showStatus('error', 'File upload error: ' + err.message);
    } finally {
      loadingSetter(false);
    }
  };

  // ----------------------------------------------------
  // NEWS POSTS CRUD (DIRECT SUPABASE CLOUD PERSISTENCE)
  // ----------------------------------------------------
  const handleOpenCreateNews = () => {
    setIsEditingNews(null);
    setNewsTitle('');
    setNewsContent('');
    setNewsImageUrl('');
    setNewsPublished(true);
    setShowNewsForm(true);
  };

  const handleOpenEditNews = (post: NewsPost) => {
    setIsEditingNews(post);
    setNewsTitle(post.title);
    setNewsContent(post.content);
    setNewsImageUrl(post.imageUrl || '');
    setNewsPublished(post.isPublished);
    setShowNewsForm(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) {
      showStatus('error', 'Please provide a title and news message.');
      return;
    }

    try {
      if (isEditingNews) {
        // Direct Supabase Update
        const { error: sbError } = await supabase
          .from('news_posts')
          .update({
            title: newsTitle.trim(),
            content: newsContent.trim(),
            image_url: newsImageUrl,
            is_published: newsPublished,
            updated_at: new Date().toISOString(),
          })
          .eq('id', isEditingNews.id);

        if (sbError) {
          showStatus('error', 'Supabase error: ' + sbError.message);
          return;
        }

        showStatus('success', 'News post updated permanently in Supabase!');
      } else {
        // Direct Supabase Insert
        const newId = 'news-' + Date.now();
        const { error: sbError } = await supabase
          .from('news_posts')
          .insert({
            id: newId,
            title: newsTitle.trim(),
            content: newsContent.trim(),
            image_url: newsImageUrl,
            is_published: newsPublished,
            likes_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (sbError) {
          showStatus('error', 'Supabase error: ' + sbError.message);
          return;
        }

        showStatus('success', 'New post saved permanently in Supabase! Opening Home page...');
      }

      await onRefreshData();
      setShowNewsForm(false);

      if (!isEditingNews && onNavigateHome) {
        setTimeout(() => {
          onNavigateHome();
        }, 800);
      }
    } catch (err: any) {
      showStatus('error', 'Failed to save news post: ' + err.message);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news post?')) return;
    try {
      const { error: sbError } = await supabase
        .from('news_posts')
        .delete()
        .eq('id', id);

      if (sbError) {
        showStatus('error', 'Supabase delete error: ' + sbError.message);
        return;
      }

      showStatus('success', 'News post deleted permanently from Supabase.');
      await onRefreshData();
    } catch (err: any) {
      showStatus('error', 'Delete failed: ' + err.message);
    }
  };

  const handleTogglePublishNews = async (post: NewsPost) => {
    try {
      const { error: sbError } = await supabase
        .from('news_posts')
        .update({
          is_published: !post.isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id);

      if (sbError) {
        showStatus('error', 'Supabase update error: ' + sbError.message);
        return;
      }

      await onRefreshData();
      showStatus('success', `Post ${!post.isPublished ? 'published' : 'unpublished'} in Supabase.`);
    } catch (err: any) {
      showStatus('error', 'Update failed: ' + err.message);
    }
  };

  // ----------------------------------------------------
  // LIVE MIXES CRUD (DIRECT SUPABASE CLOUD PERSISTENCE)
  // ----------------------------------------------------
  const handleOpenCreateLive = () => {
    setIsEditingLive(null);
    setLiveTitle('');
    setLiveDescription('');
    setLiveGenre('Afrobeats / Club Mix');
    setLiveDuration('45:00');
    setLiveAudioUrl('');
    setLiveCoverUrl('/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png');
    setLivePublished(true);
    setShowLiveForm(true);
  };

  const handleOpenEditLive = (mix: LiveMix) => {
    setIsEditingLive(mix);
    setLiveTitle(mix.title);
    setLiveDescription(mix.description);
    setLiveGenre(mix.genre);
    setLiveDuration(mix.duration);
    setLiveAudioUrl(mix.audioUrl);
    setLiveCoverUrl(mix.coverUrl);
    setLivePublished(mix.isPublished);
    setShowLiveForm(true);
  };

  const handleSaveLiveMix = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle || !liveAudioUrl) {
      showStatus('error', 'Please provide mix title and audio file/URL');
      return;
    }

    try {
      if (isEditingLive) {
        const { error: sbError } = await supabase
          .from('live_mixes')
          .update({
            title: liveTitle.trim(),
            description: liveDescription.trim(),
            genre: liveGenre,
            duration: liveDuration,
            audio_url: liveAudioUrl,
            cover_url: liveCoverUrl || '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
            is_published: livePublished,
            updated_at: new Date().toISOString(),
          })
          .eq('id', isEditingLive.id);

        if (sbError) {
          showStatus('error', 'Supabase error: ' + sbError.message);
          return;
        }

        showStatus('success', 'Live mix updated permanently in Supabase!');
      } else {
        const newId = 'live-' + Date.now();
        const { error: sbError } = await supabase
          .from('live_mixes')
          .insert({
            id: newId,
            title: liveTitle.trim(),
            description: liveDescription.trim(),
            genre: liveGenre,
            duration: liveDuration,
            audio_url: liveAudioUrl,
            cover_url: liveCoverUrl || '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
            is_published: livePublished,
            plays_count: 0,
            likes_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (sbError) {
          showStatus('error', 'Supabase error: ' + sbError.message);
          return;
        }

        showStatus('success', 'New Live mix saved permanently in Supabase!');
      }

      await onRefreshData();
      setShowLiveForm(false);
    } catch (err: any) {
      showStatus('error', 'Failed to save mix: ' + err.message);
    }
  };

  const handleDeleteLive = async (id: string) => {
    if (!confirm('Are you sure you want to delete this live mix?')) return;
    try {
      const { error: sbError } = await supabase
        .from('live_mixes')
        .delete()
        .eq('id', id);

      if (sbError) {
        showStatus('error', 'Supabase delete error: ' + sbError.message);
        return;
      }

      showStatus('success', 'Live mix deleted permanently from Supabase.');
      await onRefreshData();
    } catch (err: any) {
      showStatus('error', 'Delete failed: ' + err.message);
    }
  };

  const handleTogglePublishLive = async (mix: LiveMix) => {
    try {
      const { error: sbError } = await supabase
        .from('live_mixes')
        .update({
          is_published: !mix.isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq('id', mix.id);

      if (sbError) {
        showStatus('error', 'Supabase update error: ' + sbError.message);
        return;
      }

      await onRefreshData();
      showStatus('success', `Live mix ${!mix.isPublished ? 'published' : 'unpublished'} in Supabase.`);
    } catch (err: any) {
      showStatus('error', 'Update failed: ' + err.message);
    }
  };

  // ----------------------------------------------------
  // NONSTOPS CRUD (DIRECT SUPABASE CLOUD PERSISTENCE)
  // ----------------------------------------------------
  const handleOpenCreateNonstop = () => {
    setIsEditingNonstop(null);
    setNonstopTitle('');
    setNonstopDescription('');
    setNonstopGenre('Ugandan Nonstop / Party Mix');
    setNonstopDuration('1:15:00');
    setNonstopAudioUrl('');
    setNonstopCoverUrl('/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png');
    setNonstopTracklistText('');
    setNonstopPublished(true);
    setShowNonstopForm(true);
  };

  const handleOpenEditNonstop = (nonstop: NonstopMix) => {
    setIsEditingNonstop(nonstop);
    setNonstopTitle(nonstop.title);
    setNonstopDescription(nonstop.description);
    setNonstopGenre(nonstop.genre);
    setNonstopDuration(nonstop.duration);
    setNonstopAudioUrl(nonstop.audioUrl);
    setNonstopCoverUrl(nonstop.coverUrl);
    setNonstopTracklistText(nonstop.tracklist?.join('\n') || '');
    setNonstopPublished(nonstop.isPublished);
    setShowNonstopForm(true);
  };

  const handleSaveNonstop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nonstopTitle || !nonstopAudioUrl) {
      showStatus('error', 'Please provide nonstop title and audio file/URL');
      return;
    }

    try {
      const tracklist = nonstopTracklistText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      if (isEditingNonstop) {
        const { error: sbError } = await supabase
          .from('nonstop_mixes')
          .update({
            title: nonstopTitle.trim(),
            description: nonstopDescription.trim(),
            genre: nonstopGenre,
            duration: nonstopDuration,
            audio_url: nonstopAudioUrl,
            cover_url: nonstopCoverUrl || '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
            tracklist,
            is_published: nonstopPublished,
            updated_at: new Date().toISOString(),
          })
          .eq('id', isEditingNonstop.id);

        if (sbError) {
          showStatus('error', 'Supabase error: ' + sbError.message);
          return;
        }

        showStatus('success', 'Nonstop mix updated permanently in Supabase!');
      } else {
        const newId = 'nonstop-' + Date.now();
        const { error: sbError } = await supabase
          .from('nonstop_mixes')
          .insert({
            id: newId,
            title: nonstopTitle.trim(),
            description: nonstopDescription.trim(),
            genre: nonstopGenre,
            duration: nonstopDuration,
            audio_url: nonstopAudioUrl,
            cover_url: nonstopCoverUrl || '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
            tracklist,
            is_published: nonstopPublished,
            plays_count: 0,
            likes_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (sbError) {
          showStatus('error', 'Supabase error: ' + sbError.message);
          return;
        }

        showStatus('success', 'New Nonstop saved permanently in Supabase!');
      }

      await onRefreshData();
      setShowNonstopForm(false);
    } catch (err: any) {
      showStatus('error', 'Failed to save nonstop: ' + err.message);
    }
  };

  const handleDeleteNonstop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this nonstop mix?')) return;
    try {
      const { error: sbError } = await supabase
        .from('nonstop_mixes')
        .delete()
        .eq('id', id);

      if (sbError) {
        showStatus('error', 'Supabase delete error: ' + sbError.message);
        return;
      }

      showStatus('success', 'Nonstop mix deleted permanently from Supabase.');
      await onRefreshData();
    } catch (err: any) {
      showStatus('error', 'Delete failed: ' + err.message);
    }
  };

  const handleTogglePublishNonstop = async (nonstop: NonstopMix) => {
    try {
      const { error: sbError } = await supabase
        .from('nonstop_mixes')
        .update({
          is_published: !nonstop.isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq('id', nonstop.id);

      if (sbError) {
        showStatus('error', 'Supabase update error: ' + sbError.message);
        return;
      }

      await onRefreshData();
      showStatus('success', `Nonstop ${!nonstop.isPublished ? 'published' : 'unpublished'} in Supabase.`);
    } catch (err: any) {
      showStatus('error', 'Update failed: ' + err.message);
    }
  };

  // ----------------------------------------------------
  // ARTIST INFO UPDATE (DIRECT SUPABASE CLOUD PERSISTENCE)
  // ----------------------------------------------------
  const handleSaveArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error: sbError } = await supabase
        .from('artist_info')
        .upsert({
          id: 'dj_emma_pro',
          stage_name: artistForm.stageName,
          alias: artistForm.alias,
          tagline: artistForm.tagline,
          bio: artistForm.bio,
          origin: artistForm.origin,
          base_location: artistForm.baseLocation,
          phone: artistForm.phone,
          email: artistForm.email,
          booking_whatsapp: artistForm.bookingWhatsapp,
          avatar_url: artistForm.avatarUrl,
          hero_portrait_url: artistForm.heroPortraitUrl,
          social_links: artistForm.socialLinks,
          services: artistForm.services,
          updated_at: new Date().toISOString(),
        });

      if (sbError) {
        showStatus('error', 'Supabase artist update error: ' + sbError.message);
        return;
      }

      await onRefreshData();
      showStatus('success', 'Artist details saved permanently in Supabase!');
    } catch (err: any) {
      showStatus('error', 'Failed to update artist details: ' + err.message);
    }
  };

  // ----------------------------------------------------
  // SUPABASE CONFIG SAVE
  // ----------------------------------------------------
  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/supabase/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: supabaseUrl,
          anonKey: supabaseAnonKey,
        }),
      });
      await fetchSupabaseStatus();
      showStatus('success', 'Supabase credentials saved and tested.');
    } catch (err: any) {
      showStatus('error', 'Failed to save Supabase credentials: ' + err.message);
    }
  };

  // ----------------------------------------------------
  // PIN UPDATE
  // ----------------------------------------------------
  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/update-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin, newPin }),
      });
      const data = await res.json();
      if (data.success) {
        showStatus('success', 'Admin PIN updated successfully!');
        setCurrentPin('');
        setNewPin('');
      } else {
        showStatus('error', data.message || 'Failed to update PIN');
      }
    } catch (err: any) {
      showStatus('error', err.message);
    }
  };

  const copySqlSchema = () => {
    const sql = `-- ==============================================================================
-- DJ EMMA PRO | THE WAKANDA BOSS - COMPLETE SECURE SUPABASE SQL SCHEMA
-- Version: 2.0 (Production Verified, Safe to Re-Run)
-- Master Admin Email: supamaya256@gmail.com
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. VERIFIED ADMIN ACCESS SYSTEM
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT (
    LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'supamaya256@gmail.com'
    OR EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() OR LOWER(email) = LOWER(COALESCE(auth.jwt() ->> 'email', ''))
    )
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 2. CONTENT TABLES
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
  social_links JSONB DEFAULT '{"tiktok": "https://tiktok.com/@djemmapro", "instagram": "https://instagram.com/djemmapro", "youtube": "https://youtube.com/@djemmapro", "facebook": "https://facebook.com/djemmapro"}'::jsonb,
  services JSONB DEFAULT '[{"id": "1", "title": "Live Club & Concert DJ Mixing", "desc": "Electrifying crowd-pulling sets spanning Afrobeats, Dancehall, Amapiano & Ugandan hits."}, {"id": "2", "title": "Custom DJ Drops & Intros", "desc": "Signature studio-grade DJ drops, radio jingles, and promotional voiceovers."}, {"id": "3", "title": "Graphic Design & Creative Branding", "desc": "Album artwork, event flyers, social media kits, and 3D metallic logos."}, {"id": "4", "title": "Mixtape Production & Audio Mastering", "desc": "Seamlessly blended party tapes and pristine studio audio mastering."}]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.homepage_content (
  id TEXT PRIMARY KEY DEFAULT 'current',
  hero_title TEXT DEFAULT 'DJ EMMA PRO',
  hero_subtitle TEXT DEFAULT 'THE WAKANDA BOSS',
  tagline TEXT DEFAULT 'UGANDAN DJ & CREATIVE PROFESSIONAL',
  featured_mix_id TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. VISITOR LIKES TABLES & TOGGLE FUNCTIONS
CREATE TABLE IF NOT EXISTS public.post_likes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.news_posts(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_post_visitor_like UNIQUE (post_id, visitor_id)
);

CREATE TABLE IF NOT EXISTS public.mix_likes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  mix_id TEXT NOT NULL,
  mix_type TEXT NOT NULL CHECK (mix_type IN ('live', 'nonstop')),
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_mix_visitor_like UNIQUE (mix_id, visitor_id)
);

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

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_news_published_created ON public.news_posts (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_published_created ON public.live_mixes (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nonstop_published_created ON public.nonstop_mixes (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_lookup ON public.post_likes (post_id, visitor_id);
CREATE INDEX IF NOT EXISTS idx_mix_likes_lookup ON public.mix_likes (mix_id, visitor_id);

-- 5. UPDATED_AT TRIGGERS
DROP TRIGGER IF EXISTS trg_live_mixes_updated ON public.live_mixes;
CREATE TRIGGER trg_live_mixes_updated BEFORE UPDATE ON public.live_mixes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_nonstop_mixes_updated ON public.nonstop_mixes;
CREATE TRIGGER trg_nonstop_mixes_updated BEFORE UPDATE ON public.nonstop_mixes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_news_posts_updated ON public.news_posts;
CREATE TRIGGER trg_news_posts_updated BEFORE UPDATE ON public.news_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_artist_info_updated ON public.artist_info;
CREATE TRIGGER trg_artist_info_updated BEFORE UPDATE ON public.artist_info FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nonstop_mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mix_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published live mixes" ON public.live_mixes;
CREATE POLICY "Public read published live mixes" ON public.live_mixes FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert live mixes" ON public.live_mixes;
CREATE POLICY "Admin insert live mixes" ON public.live_mixes FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update live mixes" ON public.live_mixes;
CREATE POLICY "Admin update live mixes" ON public.live_mixes FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete live mixes" ON public.live_mixes;
CREATE POLICY "Admin delete live mixes" ON public.live_mixes FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Public read published nonstops" ON public.nonstop_mixes;
CREATE POLICY "Public read published nonstops" ON public.nonstop_mixes FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert nonstops" ON public.nonstop_mixes;
CREATE POLICY "Admin insert nonstops" ON public.nonstop_mixes FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update nonstops" ON public.nonstop_mixes;
CREATE POLICY "Admin update nonstops" ON public.nonstop_mixes FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete nonstops" ON public.nonstop_mixes;
CREATE POLICY "Admin delete nonstops" ON public.nonstop_mixes FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Public read published news posts" ON public.news_posts;
CREATE POLICY "Public read published news posts" ON public.news_posts FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert news posts" ON public.news_posts;
CREATE POLICY "Admin insert news posts" ON public.news_posts FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update news posts" ON public.news_posts;
CREATE POLICY "Admin update news posts" ON public.news_posts FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete news posts" ON public.news_posts;
CREATE POLICY "Admin delete news posts" ON public.news_posts FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Public read artist info" ON public.artist_info;
CREATE POLICY "Public read artist info" ON public.artist_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage artist info" ON public.artist_info;
CREATE POLICY "Admin manage artist info" ON public.artist_info FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public read homepage content" ON public.homepage_content;
CREATE POLICY "Public read homepage content" ON public.homepage_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage homepage content" ON public.homepage_content;
CREATE POLICY "Admin manage homepage content" ON public.homepage_content FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

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

-- 7. SUPABASE STORAGE BUCKETS & POLICIES
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('audio-files', 'audio-files', true, 524288000, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/x-m4a']),
  ('artwork-images', 'artwork-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('news-images', 'news-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view audio files" ON storage.objects;
CREATE POLICY "Public can view audio files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('audio-files', 'artwork-images', 'news-images'));

DROP POLICY IF EXISTS "Admin can upload storage files" ON storage.objects;
CREATE POLICY "Admin can upload storage files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('audio-files', 'artwork-images', 'news-images') AND public.is_admin());

DROP POLICY IF EXISTS "Admin can update storage files" ON storage.objects;
CREATE POLICY "Admin can update storage files" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('audio-files', 'artwork-images', 'news-images') AND public.is_admin());

DROP POLICY IF EXISTS "Admin can delete storage files" ON storage.objects;
CREATE POLICY "Admin can delete storage files" ON storage.objects
  FOR DELETE USING (bucket_id IN ('audio-files', 'artwork-images', 'news-images') AND public.is_admin());
`;
    navigator.clipboard?.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="w-full text-white pb-28 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Admin Header */}
      <div className="rounded-3xl glass-card border border-white/25 p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black chrome-text font-display uppercase">
                ADMIN CONTROL CENTER
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                MASTER ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-300">
              DJ EMMA PRO • Real Uploads, News Posts & Permanent Supabase Cloud Storage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Storage Status Badge */}
          <div
            onClick={fetchSupabaseStatus}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 transition ${
              supabaseStatus?.connected
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                : 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30 hover:bg-cyan-500/20'
            }`}
            title="Click to re-test connection"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                supabaseStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
              }`}
            />
            <span>
              {supabaseStatus?.connected
                ? 'Supabase Cloud Connected'
                : 'Permanent Disk Storage Active'}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-400/30 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Status Alert Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
              : 'bg-rose-500/20 text-rose-200 border-rose-400/40'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'news'
              ? 'glass-nav-active text-white border border-amber-400/50 shadow-lg'
              : 'glass-card text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Newspaper className="w-4 h-4 text-amber-400" />
          <span>Official News ({newsPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'live'
              ? 'glass-nav-active text-white border border-cyan-400/50 shadow-lg'
              : 'glass-card text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>Live Mixes ({liveMixes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('nonstops')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'nonstops'
              ? 'glass-nav-active text-white border border-purple-400/50 shadow-lg'
              : 'glass-card text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Music className="w-4 h-4 text-purple-400" />
          <span>Nonstops ({nonstops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artist')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'artist'
              ? 'glass-nav-active text-white border border-sky-400/50 shadow-lg'
              : 'glass-card text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <User className="w-4 h-4 text-sky-400" />
          <span>Artist Profile & Contacts</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'supabase'
              ? 'glass-nav-active text-white border border-emerald-400/50 shadow-lg'
              : 'glass-card text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Supabase Cloud Sync</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'security'
              ? 'glass-nav-active text-white border border-amber-400/50 shadow-lg'
              : 'glass-card text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Key className="w-4 h-4 text-amber-400" />
          <span>Admin Security</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 0: NEWS & ANNOUNCEMENTS POSTING */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold chrome-text font-display uppercase">
                OFFICIAL NEWS & ANNOUNCEMENTS
              </h2>
              <p className="text-xs text-slate-300">
                Write messages, upload event posters/photos, and publish news visible to all visitors.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>VIEW HOMEPAGE</span>
                </button>
              )}
              <button
                onClick={handleOpenCreateNews}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition"
              >
                <Plus className="w-4 h-4" />
                <span>POST NEW ANNOUNCEMENT</span>
              </button>
            </div>
          </div>

          {/* Form for Creating / Editing News Post */}
          {showNewsForm && (
            <div className="rounded-2xl glass-card border border-amber-400/50 p-6 shadow-2xl bg-black/60 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <h3 className="font-bold text-base text-white font-display uppercase">
                  {isEditingNews ? 'Edit News Post' : 'Create New Post / Message'}
                </h3>
                <button
                  onClick={() => setShowNewsForm(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveNews} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Post Title / Announcement Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="e.g. Catch DJ EMMA PRO Live in Kampala This Friday!"
                    className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Picture Upload / URL */}
                <div className="p-4 rounded-xl glass-card border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      <span>Upload Picture / Event Poster (Optional)</span>
                    </span>
                    {isUploadingNewsImage && (
                      <span className="text-xs text-amber-400 animate-pulse">Uploading picture to storage...</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(e, 'image', setNewsImageUrl, setIsUploadingNewsImage, 'news-images')
                        }
                        className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30 cursor-pointer"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newsImageUrl}
                        onChange={(e) => setNewsImageUrl(e.target.value)}
                        placeholder="Or paste picture URL..."
                        className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {newsImageUrl && (
                    <div className="mt-2 w-28 h-20 rounded-lg overflow-hidden border border-white/20">
                      <img src={newsImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Message / Full Content *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    placeholder="Write your news update, message to fans, venue details, or drop announcement..."
                    className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newsPublished}
                      onChange={(e) => setNewsPublished(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    <span className="ml-3 text-xs font-semibold text-slate-300">
                      {newsPublished ? 'Published to Public' : 'Draft / Unpublished'}
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewsForm(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
                  >
                    {isEditingNews ? 'SAVE CHANGES' : 'PUBLISH POST'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of News Posts */}
          {newsPosts.length === 0 ? (
            <div className="rounded-2xl glass-card border border-white/15 p-12 text-center space-y-3">
              <Newspaper className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white font-display">No News Posts Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ready for your real announcements and messages! Click "POST NEW ANNOUNCEMENT" above to publish your first post.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl glass-card border border-white/15 overflow-hidden">
              <div className="divide-y divide-white/10">
                {newsPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/20"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                          <Newspaper className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate font-display">
                            {post.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              post.isPublished
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                            }`}
                          >
                            {post.isPublished ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5 max-w-lg">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1 text-rose-300">
                            <Heart className="w-3 h-3 fill-rose-500/40 text-rose-400" />
                            <span>{post.likesCount} real likes</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {onNavigateHome && post.isPublished && (
                        <button
                          onClick={onNavigateHome}
                          title="View post live on Homepage"
                          className="px-2.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">View Live</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleTogglePublishNews(post)}
                        title={post.isPublished ? 'Unpublish' : 'Publish'}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                      >
                        {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditNews(post)}
                        title="Edit Post"
                        className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/30 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteNews(post.id)}
                        title="Delete Post"
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-400/30 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 1: LIVE MIXES MANAGEMENT */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold chrome-text font-display uppercase">
                LIVE MIXES DIRECTORY
              </h2>
              <p className="text-xs text-slate-300">
                Upload real MP3 audio files and cover art. All uploads stay permanently saved.
              </p>
            </div>
            <button
              onClick={handleOpenCreateLive}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition"
            >
              <Plus className="w-4 h-4" />
              <span>UPLOAD NEW LIVE MIX</span>
            </button>
          </div>

          {/* Modal / Form for Live Mix */}
          {showLiveForm && (
            <div className="rounded-2xl glass-card border border-cyan-400/50 p-6 shadow-2xl bg-black/60 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <h3 className="font-bold text-base text-white font-display uppercase">
                  {isEditingLive ? 'Edit Live Mix' : 'Upload & Publish Real Live Mix'}
                </h3>
                <button
                  onClick={() => setShowLiveForm(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveLiveMix} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Mix Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      placeholder="e.g. Wakanda Club Lockdown Vol. 1"
                      className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Genre / Category
                    </label>
                    <input
                      type="text"
                      value={liveGenre}
                      onChange={(e) => setLiveGenre(e.target.value)}
                      placeholder="e.g. Afrobeats, Dancehall, Amapiano"
                      className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Duration (e.g. 45:00)
                    </label>
                    <input
                      type="text"
                      value={liveDuration}
                      onChange={(e) => setLiveDuration(e.target.value)}
                      placeholder="45:00"
                      className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={livePublished}
                        onChange={(e) => setLivePublished(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      <span className="ml-3 text-xs font-semibold text-slate-300">
                        {livePublished ? 'Published to Public' : 'Draft / Unpublished'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Audio Upload or URL */}
                <div className="p-4 rounded-xl glass-card border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase">
                      1. Audio File (MP3, WAV, AAC) *
                    </span>
                    {isUploadingLiveAudio && (
                      <span className="text-xs text-cyan-400 animate-pulse">Uploading file to server...</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) =>
                          handleFileUpload(e, 'audio', setLiveAudioUrl, setIsUploadingLiveAudio, 'audio-files')
                        }
                        className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={liveAudioUrl}
                        onChange={(e) => setLiveAudioUrl(e.target.value)}
                        placeholder="Or paste audio URL..."
                        className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Artwork Upload or URL */}
                <div className="p-4 rounded-xl glass-card border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase">
                      2. Cover Artwork Image
                    </span>
                    {isUploadingLiveCover && (
                      <span className="text-xs text-cyan-400 animate-pulse">Uploading artwork...</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(e, 'image', setLiveCoverUrl, setIsUploadingLiveCover, 'artwork-images')
                        }
                        className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={liveCoverUrl}
                        onChange={(e) => setLiveCoverUrl(e.target.value)}
                        placeholder="Artwork URL or preserved portrait"
                        className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Description / Track Info
                  </label>
                  <textarea
                    rows={2}
                    value={liveDescription}
                    onChange={(e) => setLiveDescription(e.target.value)}
                    placeholder="Brief description of this live set..."
                    className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLiveForm(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
                  >
                    {isEditingLive ? 'SAVE CHANGES' : 'PUBLISH LIVE MIX'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table / List of Live Mixes */}
          {liveMixes.length === 0 ? (
            <div className="rounded-2xl glass-card border border-white/15 p-12 text-center space-y-3">
              <Radio className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white font-display">No Live Mixes Uploaded Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ready for your real audio uploads! Click "UPLOAD NEW LIVE MIX" above to upload your first MP3 mix.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl glass-card border border-white/15 overflow-hidden">
              <div className="divide-y divide-white/10">
                {liveMixes.map((mix) => (
                  <div
                    key={mix.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={mix.coverUrl}
                        alt={mix.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/20"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate font-display">
                            {mix.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              mix.isPublished
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                            }`}
                          >
                            {mix.isPublished ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {mix.genre} • {mix.duration} • {mix.playsCount} real plays
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleTogglePublishLive(mix)}
                        title={mix.isPublished ? 'Unpublish' : 'Publish'}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                      >
                        {mix.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditLive(mix)}
                        title="Edit Mix"
                        className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/30 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteLive(mix.id)}
                        title="Delete Mix"
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-400/30 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: NONSTOPS MANAGEMENT */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'nonstops' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold chrome-text font-display uppercase">
                NONSTOPS DIRECTORY
              </h2>
              <p className="text-xs text-slate-300">
                Upload nonstop marathon party audio and manage tracklists.
              </p>
            </div>
            <button
              onClick={handleOpenCreateNonstop}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition"
            >
              <Plus className="w-4 h-4" />
              <span>UPLOAD NEW NONSTOP</span>
            </button>
          </div>

          {/* Form Modal for Nonstop */}
          {showNonstopForm && (
            <div className="rounded-2xl glass-card border border-purple-400/50 p-6 shadow-2xl bg-black/60 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <h3 className="font-bold text-base text-white font-display uppercase">
                  {isEditingNonstop ? 'Edit Nonstop' : 'Upload & Publish Real Nonstop Mix'}
                </h3>
                <button
                  onClick={() => setShowNonstopForm(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveNonstop} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Nonstop Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={nonstopTitle}
                      onChange={(e) => setNonstopTitle(e.target.value)}
                      placeholder="e.g. The Wakanda Boss Nonstop Vol. 1"
                      className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Genre / Category
                    </label>
                    <input
                      type="text"
                      value={nonstopGenre}
                      onChange={(e) => setNonstopGenre(e.target.value)}
                      placeholder="e.g. Ugandan Nonstop / Party Mix"
                      className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Duration (e.g. 1:15:00)
                    </label>
                    <input
                      type="text"
                      value={nonstopDuration}
                      onChange={(e) => setNonstopDuration(e.target.value)}
                      placeholder="1:15:00"
                      className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={nonstopPublished}
                        onChange={(e) => setNonstopPublished(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      <span className="ml-3 text-xs font-semibold text-slate-300">
                        {nonstopPublished ? 'Published to Public' : 'Draft / Unpublished'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Audio Upload */}
                <div className="p-4 rounded-xl glass-card border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 uppercase">
                      1. Audio File (MP3, WAV) *
                    </span>
                    {isUploadingNonstopAudio && (
                      <span className="text-xs text-purple-400 animate-pulse">Uploading audio...</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) =>
                          handleFileUpload(e, 'audio', setNonstopAudioUrl, setIsUploadingNonstopAudio, 'audio-files')
                        }
                        className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 cursor-pointer"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={nonstopAudioUrl}
                        onChange={(e) => setNonstopAudioUrl(e.target.value)}
                        placeholder="Or paste audio URL..."
                        className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Artwork Upload */}
                <div className="p-4 rounded-xl glass-card border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 uppercase">
                      2. Cover Artwork Image
                    </span>
                    {isUploadingNonstopCover && (
                      <span className="text-xs text-purple-400 animate-pulse">Uploading artwork...</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(e, 'image', setNonstopCoverUrl, setIsUploadingNonstopCover, 'artwork-images')
                        }
                        className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={nonstopCoverUrl}
                        onChange={(e) => setNonstopCoverUrl(e.target.value)}
                        placeholder="Artwork URL..."
                        className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Tracklist textarea */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Tracklist (One song per line)
                  </label>
                  <textarea
                    rows={4}
                    value={nonstopTracklistText}
                    onChange={(e) => setNonstopTracklistText(e.target.value)}
                    placeholder="1. Intro - DJ Emma Pro&#10;2. Ugandan Dance Anthem&#10;3. Afrobeats Banger"
                    className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNonstopForm(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
                  >
                    {isEditingNonstop ? 'SAVE CHANGES' : 'PUBLISH NONSTOP'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Nonstops */}
          {nonstops.length === 0 ? (
            <div className="rounded-2xl glass-card border border-white/15 p-12 text-center space-y-3">
              <Music className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white font-display">No Nonstops Uploaded Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ready for your real nonstop sessions! Click "UPLOAD NEW NONSTOP" above to upload your first marathon mix.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl glass-card border border-white/15 overflow-hidden">
              <div className="divide-y divide-white/10">
                {nonstops.map((nonstop) => (
                  <div
                    key={nonstop.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={nonstop.coverUrl}
                        alt={nonstop.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/20"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate font-display">
                            {nonstop.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              nonstop.isPublished
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                            }`}
                          >
                            {nonstop.isPublished ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {nonstop.genre} • {nonstop.duration} • {nonstop.tracklist?.length || 0} tracks • {nonstop.playsCount} real plays
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleTogglePublishNonstop(nonstop)}
                        title={nonstop.isPublished ? 'Unpublish' : 'Publish'}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                      >
                        {nonstop.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditNonstop(nonstop)}
                        title="Edit Nonstop"
                        className="p-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-400/30 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteNonstop(nonstop.id)}
                        title="Delete Nonstop"
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-400/30 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: ARTIST BIOGRAPHY & SERVICES */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'artist' && (
        <form onSubmit={handleSaveArtist} className="rounded-2xl glass-card border border-white/20 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <div>
              <h2 className="text-xl font-bold chrome-text font-display uppercase">
                MANAGE ARTIST BIOGRAPHY & CONTACTS
              </h2>
              <p className="text-xs text-slate-300">
                Update the official biography, services, and booking channels.
              </p>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition"
            >
              <Save className="w-4 h-4" />
              <span>SAVE ALL DETAILS</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Stage Name
              </label>
              <input
                type="text"
                value={artistForm.stageName}
                onChange={(e) => setArtistForm({ ...artistForm, stageName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Artist Alias
              </label>
              <input
                type="text"
                value={artistForm.alias}
                onChange={(e) => setArtistForm({ ...artistForm, alias: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Official Biography Text *
            </label>
            <textarea
              rows={4}
              required
              value={artistForm.bio}
              onChange={(e) => setArtistForm({ ...artistForm, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white leading-relaxed focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Origin
              </label>
              <input
                type="text"
                value={artistForm.origin}
                onChange={(e) => setArtistForm({ ...artistForm, origin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Current Base Location
              </label>
              <input
                type="text"
                value={artistForm.baseLocation}
                onChange={(e) => setArtistForm({ ...artistForm, baseLocation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Direct Phone
              </label>
              <input
                type="text"
                value={artistForm.phone}
                onChange={(e) => setArtistForm({ ...artistForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                WhatsApp Booking
              </label>
              <input
                type="text"
                value={artistForm.bookingWhatsapp}
                onChange={(e) => setArtistForm({ ...artistForm, bookingWhatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Official Email
              </label>
              <input
                type="email"
                value={artistForm.email}
                onChange={(e) => setArtistForm({ ...artistForm, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: SUPABASE CLOUD SYNC & CONFIG */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          <div className="rounded-2xl glass-card border border-emerald-400/40 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/15">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold chrome-text font-display uppercase">
                    SUPABASE DATABASE & STORAGE SYNC
                  </h2>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Connected to project <span className="font-mono text-emerald-300 font-bold">ruyediepdsvycrxniplt</span> • Postgres RLS & Cloud Storage
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://supabase.com/dashboard/project/ruyediepdsvycrxniplt/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-2 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Supabase SQL Editor</span>
                </a>

                <button
                  onClick={fetchSupabaseStatus}
                  disabled={testingSupabase}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-2 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-spin' : ''}`} />
                  <span>Check Status</span>
                </button>
              </div>
            </div>

            {/* Current Status Box */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                supabaseStatus?.connected
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-current mt-1 shrink-0 animate-pulse" />
              <div className="text-xs space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase">
                    Storage Mode: {supabaseStatus?.storageMode === 'supabase-cloud' ? 'Supabase Cloud Postgres (Active)' : 'High-Performance Resilient Disk Storage (Active)'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono">
                    Project: https://ruyediepdsvycrxniplt.supabase.co
                  </span>
                </div>
                <p className="text-slate-200">{supabaseStatus?.message}</p>
              </div>
            </div>

            {/* Cloud Database Tables Status Grid */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Supabase Postgres Tables & RLS Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl glass-card border border-white/15 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">news_posts</div>
                    <div className="text-[11px] text-slate-400">News & Announcements</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    supabaseStatus?.tables?.news_posts
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  }`}>
                    {supabaseStatus?.tables?.news_posts ? 'CLOUD SYNC' : 'ACTIVE'}
                  </span>
                </div>

                <div className="p-3 rounded-xl glass-card border border-white/15 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">live_mixes</div>
                    <div className="text-[11px] text-slate-400">DJ Live Mixes & MP3s</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    supabaseStatus?.tables?.live_mixes
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  }`}>
                    {supabaseStatus?.tables?.live_mixes ? 'CLOUD SYNC' : 'ACTIVE'}
                  </span>
                </div>

                <div className="p-3 rounded-xl glass-card border border-white/15 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">nonstop_mixes</div>
                    <div className="text-[11px] text-slate-400">Marathon Nonstop Tapes</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    supabaseStatus?.tables?.nonstop_mixes
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  }`}>
                    {supabaseStatus?.tables?.nonstop_mixes ? 'CLOUD SYNC' : 'ACTIVE'}
                  </span>
                </div>

                <div className="p-3 rounded-xl glass-card border border-white/15 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">artist_info</div>
                    <div className="text-[11px] text-slate-400">Bio & Booking Contacts</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    supabaseStatus?.tables?.artist_info
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  }`}>
                    {supabaseStatus?.tables?.artist_info ? 'CLOUD SYNC' : 'ACTIVE'}
                  </span>
                </div>
              </div>
            </div>

            {/* 1-Click Schema Deploy Section */}
            <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase">
                    1-Click SQL Schema & Row Level Security (RLS)
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Click copy, paste into the Supabase SQL editor, and click <span className="font-bold text-white">RUN</span> to establish cloud tables in your project.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copySqlSchema}
                    className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-2 transition shadow-lg cursor-pointer"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>SQL Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Complete SQL Schema</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Welcoming Voice Audio Card */}
            <div className="p-5 rounded-2xl bg-[#171a22] border border-cyan-400/40 space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                      <span>START SCREEN WELCOMING VOICE</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        WELCOME.mp3
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      Plays automatically when any visitor taps the START button on your blue start dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      if (isPlayingWelcome) {
                        if (welcomeTestAudioRef.current) welcomeTestAudioRef.current.pause();
                        setIsPlayingWelcome(false);
                      } else {
                        const audio = new Audio('https://ruyediepdsvycrxniplt.supabase.co/storage/v1/object/public/DJ%20EMMA%20PRO/WELCOME.mp3');
                        welcomeTestAudioRef.current = audio;
                        audio.onerror = () => {
                          audio.src = '/api/welcome-audio';
                          audio.play().catch(() => {});
                        };
                        audio.onended = () => setIsPlayingWelcome(false);
                        audio.play().catch(() => {
                          audio.src = '/api/welcome-audio';
                          audio.play().catch(() => {});
                        });
                        setIsPlayingWelcome(true);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isPlayingWelcome ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Test Welcome Voice</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const sql = "UPDATE storage.buckets SET public = true WHERE id = 'DJ EMMA PRO' OR name = 'DJ EMMA PRO';\nDROP POLICY IF EXISTS \"Public can view DJ EMMA PRO files\" ON storage.objects;\nCREATE POLICY \"Public can view DJ EMMA PRO files\" ON storage.objects FOR SELECT USING (bucket_id = 'DJ EMMA PRO');";
                      navigator.clipboard?.writeText(sql);
                      setCopiedWelcomeSql(true);
                      setTimeout(() => setCopiedWelcomeSql(false), 3000);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-white/10"
                    title="Copy 1-click SQL to make DJ EMMA PRO bucket public in Supabase"
                  >
                    {copiedWelcomeSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Public Bucket SQL Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Public Bucket SQL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 bg-black/40 p-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                <span className="truncate">
                  https://ruyediepdsvycrxniplt.supabase.co/storage/v1/object/public/DJ%20EMMA%20PRO/WELCOME.mp3
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] shrink-0 font-bold">
                  CONNECTED
                </span>
              </div>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 pt-2 border-t border-white/10">
              <h4 className="text-xs font-bold text-slate-300 uppercase">
                Supabase Connection Credentials
              </h4>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://ruyediepdsvycrxniplt.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Supabase Publishable / Anon Key
                  </label>
                  <input
                    type="password"
                    placeholder="sb_publishable_..."
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE & VERIFY SUPABASE</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: SECURITY / ADMIN PIN */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'security' && (
        <form onSubmit={handleUpdatePin} className="rounded-2xl glass-card border border-white/20 p-6 space-y-4 max-w-xl">
          <div className="pb-3 border-b border-white/15">
            <h2 className="text-xl font-bold chrome-text font-display uppercase">
              CHANGE ADMIN ACCESS PIN
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Set a private PIN or passcode to protect your DJ Emma Pro administrator dashboard.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Current PIN (Default is 2560)
            </label>
            <input
              type="password"
              required
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="Enter current PIN"
              className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              New Admin PIN (Min 4 characters)
            </label>
            <input
              type="password"
              required
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Enter new private PIN"
              className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/20 text-xs sm:text-sm text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
          >
            UPDATE ADMIN PIN
          </button>
        </form>
      )}
    </div>
  );
};

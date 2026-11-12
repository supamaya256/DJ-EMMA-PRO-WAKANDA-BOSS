import React, { useState, useEffect } from 'react';
import { ActiveTab, LiveMix, NonstopMix, NewsPost, ArtistInfo, HomepageConfig } from './types';
import { AudioProvider } from './context/AudioContext';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { StartScreen } from './components/StartScreen';
import { MainDashboardHeader } from './components/MainDashboardHeader';
import { TopNavBar } from './components/TopNavBar';
import { HomeSection } from './components/HomeSection';
import { LiveMixesSection } from './components/LiveMixesSection';
import { NonstopsSection } from './components/NonstopsSection';
import { AboutSection } from './components/AboutSection';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CommentsModal } from './components/CommentsModal';
import { PrivacyPolicySection } from './components/PrivacyPolicySection';
import { TermsConditionsSection } from './components/TermsConditionsSection';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { ShieldCheck, ArrowLeft, FileText, Lock, Cookie } from 'lucide-react';
import { getVisitorId, toggleVisitorLikedId } from './lib/visitor';
import { supabase } from './lib/supabase';

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    return sessionStorage.getItem('dj_emma_has_started') === 'true';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const hash = window.location.hash.replace('#', '') as ActiveTab;
    if (['home', 'live-mixes', 'nonstops', 'about-me', 'admin', 'privacy-policy', 'terms-conditions'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem('dj_emma_admin_token'));
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCookiePreferencesOpen, setIsCookiePreferencesOpen] = useState(false);

  // Global Comments Modal State
  const [commentsModal, setCommentsModal] = useState<{
    isOpen: boolean;
    targetId: string;
    targetType: 'news' | 'live' | 'nonstop';
    targetTitle: string;
  }>({
    isOpen: false,
    targetId: '',
    targetType: 'news',
    targetTitle: '',
  });

  const handleOpenComments = (targetId: string, targetType: 'news' | 'live' | 'nonstop', targetTitle: string) => {
    setCommentsModal({
      isOpen: true,
      targetId,
      targetType,
      targetTitle,
    });
  };

  // Core Data States
  const [liveMixes, setLiveMixes] = useState<LiveMix[]>([]);
  const [nonstops, setNonstops] = useState<NonstopMix[]>([]);
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem('dj_emma_comment_counts');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [artist, setArtist] = useState<ArtistInfo>({
    id: 'dj_emma_pro',
    stageName: 'DJ EMMA PRO',
    alias: 'THE WAKANDA BOSS',
    tagline: 'Uganda’s Premier DJ, Mixing Prodigy & Creative Architect',
    bio: 'DJ EMMA PRO is a Ugandan DJ and creative professional from Serere District in the Teso Region of Eastern Uganda, based in Kampala. He is passionate about music entertainment, DJ mixing, graphic design, creative branding and professional DJ drops. Known as THE WAKANDA BOSS, DJ EMMA PRO represents the Ugandan entertainment scene through music, creativity and energetic mixes.',
    origin: 'Serere District, Teso Region, Eastern Uganda',
    baseLocation: 'Kampala, Uganda',
    phone: '+256 788 123 456',
    email: 'supamaya256@gmail.com',
    bookingWhatsapp: '+256788123456',
    avatarUrl: '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
    heroPortraitUrl: '/assets/aistudio/file_00000000577482118275a24f7cbcec0a_37ac2a88.png',
    socialLinks: {
      tiktok: 'https://tiktok.com/@djemmapro',
      instagram: 'https://instagram.com/djemmapro',
      youtube: 'https://youtube.com/@djemmapro',
      facebook: 'https://facebook.com/djemmapro',
    },
    services: [
      { id: '1', title: 'Live Club & Concert DJ Mixing', desc: 'Electrifying crowd-pulling sets spanning Afrobeats, Dancehall, Amapiano & Ugandan hits.' },
      { id: '2', title: 'Custom DJ Drops & Intros', desc: 'Signature studio-grade DJ drops, radio jingles, and promotional voiceovers.' },
      { id: '3', title: 'Graphic Design & Creative Branding', desc: 'Album artwork, event flyers, social media kits, and 3D metallic logos.' },
      { id: '4', title: 'Mixtape Production & Audio Mastering', desc: 'Seamlessly blended party tapes and pristine studio audio mastering.' },
    ],
  });

  const [homepage, setHomepage] = useState<HomepageConfig>({
    heroTitle: 'DJ EMMA PRO',
    heroSubtitle: 'THE WAKANDA BOSS',
    tagline: 'UGANDAN DJ & CREATIVE PROFESSIONAL',
    featuredMixId: '',
  });

  // Fetch data directly from Supabase Cloud
  const refreshAllData = async () => {
    try {
      // 1. Direct Supabase Cloud queries
      const [mixesRes, nonstopsRes, newsRes, artistRes, homeRes] = await Promise.all([
        supabase.from('live_mixes').select('*').order('created_at', { ascending: false }),
        supabase.from('nonstop_mixes').select('*').order('created_at', { ascending: false }),
        supabase.from('news_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('artist_info').select('*').eq('id', 'dj_emma_pro').single(),
        supabase.from('homepage_content').select('*').eq('id', 'current').single(),
      ]);

      if (!mixesRes.error && Array.isArray(mixesRes.data)) {
        setLiveMixes(mixesRes.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          genre: item.genre || 'Afrobeats / Club Mix',
          duration: item.duration || '45:00',
          audioUrl: item.audio_url,
          coverUrl: item.cover_url,
          isPublished: item.is_published,
          playsCount: item.plays_count || 0,
          likesCount: item.likes_count || 0,
          createdAt: item.created_at,
        })));
      } else {
        const fb = await fetch('/api/mixes');
        if (fb.ok) setLiveMixes(await fb.json());
      }

      if (!nonstopsRes.error && Array.isArray(nonstopsRes.data)) {
        setNonstops(nonstopsRes.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          genre: item.genre || 'Ugandan Nonstop / Party Mix',
          duration: item.duration || '1:15:00',
          audioUrl: item.audio_url,
          coverUrl: item.cover_url,
          tracklist: item.tracklist || [],
          isPublished: item.is_published,
          playsCount: item.plays_count || 0,
          likesCount: item.likes_count || 0,
          createdAt: item.created_at,
        })));
      } else {
        const fb = await fetch('/api/nonstops');
        if (fb.ok) setNonstops(await fb.json());
      }

      if (!newsRes.error && Array.isArray(newsRes.data)) {
        setNewsPosts(newsRes.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          imageUrl: item.image_url || '',
          isPublished: item.is_published,
          likesCount: item.likes_count || 0,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        })));
      } else {
        const fb = await fetch('/api/news');
        if (fb.ok) setNewsPosts(await fb.json());
      }

      if (!artistRes.error && artistRes.data) {
        setArtist((prev) => ({
          ...prev,
          id: artistRes.data.id,
          stageName: artistRes.data.stage_name || prev.stageName,
          alias: artistRes.data.alias || prev.alias,
          tagline: artistRes.data.tagline || prev.tagline,
          bio: artistRes.data.bio || prev.bio,
          origin: artistRes.data.origin || prev.origin,
          baseLocation: artistRes.data.base_location || prev.baseLocation,
          phone: artistRes.data.phone || prev.phone,
          email: artistRes.data.email || prev.email,
          bookingWhatsapp: artistRes.data.booking_whatsapp || prev.bookingWhatsapp,
          avatarUrl: artistRes.data.avatar_url || prev.avatarUrl,
          heroPortraitUrl: artistRes.data.hero_portrait_url || prev.heroPortraitUrl,
          socialLinks: artistRes.data.social_links || prev.socialLinks,
          services: artistRes.data.services || prev.services,
        }));
      }

      if (!homeRes.error && homeRes.data) {
        setHomepage((prev) => ({
          ...prev,
          heroTitle: homeRes.data.hero_title || prev.heroTitle,
          heroSubtitle: homeRes.data.hero_subtitle || prev.heroSubtitle,
          tagline: homeRes.data.tagline || prev.tagline,
          featuredMixId: homeRes.data.featured_mix_id || prev.featuredMixId,
        }));
      }

      // 2. Fetch public comment counts from Supabase Cloud
      try {
        const { data: commentsData } = await supabase.from('comments').select('target_id');
        const counts: Record<string, number> = {};
        if (Array.isArray(commentsData)) {
          commentsData.forEach((c: any) => {
            if (c.target_id) counts[c.target_id] = (counts[c.target_id] || 0) + 1;
          });
        }
        const localCountsRaw = localStorage.getItem('dj_emma_comment_counts');
        if (localCountsRaw) {
          try {
            const localCounts = JSON.parse(localCountsRaw);
            Object.assign(counts, { ...localCounts, ...counts });
          } catch {}
        }
        setCommentCounts(counts);
      } catch {
        // Safe fallback to local cache
      }

      // 3. Synchronize this visitor's like status from Supabase Cloud
      try {
        const visitorId = getVisitorId();
        const [postLikesRes, mixLikesRes] = await Promise.all([
          supabase.from('post_likes').select('post_id').eq('visitor_id', visitorId),
          supabase.from('mix_likes').select('mix_id, mix_type').eq('visitor_id', visitorId),
        ]);

        if (Array.isArray(postLikesRes.data)) {
          const ids = postLikesRes.data.map((r: any) => r.post_id);
          localStorage.setItem('dj_emma_liked_news', JSON.stringify(ids));
        }
        if (Array.isArray(mixLikesRes.data)) {
          const liveIds = mixLikesRes.data.filter((r: any) => r.mix_type === 'live').map((r: any) => r.mix_id);
          const nonstopIds = mixLikesRes.data.filter((r: any) => r.mix_type === 'nonstop').map((r: any) => r.mix_id);
          if (liveIds.length > 0) localStorage.setItem('dj_emma_liked_live', JSON.stringify(liveIds));
          if (nonstopIds.length > 0) localStorage.setItem('dj_emma_liked_nonstops', JSON.stringify(nonstopIds));
        }
      } catch {
        // Safe fallback
      }
    } catch (err) {
      console.warn('Supabase data loading warning:', err);
    }
  };

  useEffect(() => {
    refreshAllData();

    // Check existing Supabase auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === 'supamaya256@gmail.com') {
        setIsAdminAuthenticated(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email === 'supamaya256@gmail.com') {
        setIsAdminAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync hash routing for browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ActiveTab;
      if (['home', 'live-mixes', 'nonstops', 'about-me', 'admin', 'privacy-policy', 'terms-conditions'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const handleStart = () => {
    setHasStarted(true);
    sessionStorage.setItem('dj_emma_has_started', 'true');
    handleTabChange('home');
  };

  const handleReturnToStart = () => {
    setHasStarted(false);
    sessionStorage.removeItem('dj_emma_has_started');
  };

  const handleLoginSuccess = (token: string) => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('dj_emma_admin_token', token);
    handleTabChange('admin');
  };

  const handleLogout = async () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('dj_emma_admin_token');
    sessionStorage.removeItem('dj_emma_supabase_token');
    await supabase.auth.signOut().catch(() => {});
    handleTabChange('home');
  };

  const handleLikeMix = async (id: string, type: 'live' | 'nonstop') => {
    try {
      const visitorId = getVisitorId();

      // 1. Direct Supabase Cloud RPC (Atomic, duplicate-preventing, works directly on Netlify)
      const { data, error } = await supabase.rpc('toggle_mix_like', {
        p_mix_id: id,
        p_mix_type: type,
        p_visitor_id: visitorId,
      });

      if (!error && data && typeof data.liked === 'boolean') {
        const storageKey = type === 'live' ? 'dj_emma_liked_live' : 'dj_emma_liked_nonstops';
        toggleVisitorLikedId(storageKey, id, data.liked);

        if (type === 'live') {
          setLiveMixes((prev) =>
            prev.map((m) => (m.id === id ? { ...m, likesCount: Number(data.likes_count) } : m))
          );
        } else {
          setNonstops((prev) =>
            prev.map((n) => (n.id === id ? { ...n, likesCount: Number(data.likes_count) } : n))
          );
        }
        return;
      }

      // 2. Server API fallback if RPC had network issue
      const endpoint = type === 'live' ? `/api/mixes/${id}/like` : `/api/nonstops/${id}/like`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
      }).catch(() => null);

      if (res && res.ok) {
        const resData = await res.json();
        if (resData.success) {
          toggleVisitorLikedId(type === 'live' ? 'dj_emma_liked_live' : 'dj_emma_liked_nonstops', id, resData.liked);
          if (type === 'live') {
            setLiveMixes((prev) =>
              prev.map((m) => (m.id === id ? { ...m, likesCount: resData.likesCount } : m))
            );
          } else {
            setNonstops((prev) =>
              prev.map((n) => (n.id === id ? { ...n, likesCount: resData.likesCount } : n))
            );
          }
        }
      }
    } catch (err) {
      console.warn('Like mix error:', err);
    }
  };

  const handleLikeNews = async (id: string) => {
    try {
      const visitorId = getVisitorId();

      // 1. Direct Supabase Cloud RPC
      const { data, error } = await supabase.rpc('toggle_post_like', {
        p_post_id: id,
        p_visitor_id: visitorId,
      });

      if (!error && data && typeof data.liked === 'boolean') {
        toggleVisitorLikedId('dj_emma_liked_news', id, data.liked);
        setNewsPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, likesCount: Number(data.likes_count) } : p))
        );
        return;
      }

      // 2. Server API fallback if RPC had issue
      const res = await fetch(`/api/news/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
      }).catch(() => null);

      if (res && res.ok) {
        const resData = await res.json();
        if (resData.success) {
          toggleVisitorLikedId('dj_emma_liked_news', id, resData.liked);
          setNewsPosts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, likesCount: resData.likesCount } : p))
          );
        }
      }
    } catch (err) {
      console.warn('Like news error:', err);
    }
  };

  const handleCommentAdded = (targetId: string, count: number) => {
    setCommentCounts((prev) => {
      const next = { ...prev, [targetId]: count };
      try {
        localStorage.setItem('dj_emma_comment_counts', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <AudioProvider>
      <div className="min-h-screen bg-[#111317] text-white selection:bg-cyan-500 selection:text-black">
        {/* FIRST DASHBOARD: ORIGINAL BLUE START SCREEN (IMAGE 1) */}
        {!hasStarted ? (
          <StartScreen onStart={handleStart} />
        ) : (
          /* SECOND DASHBOARD: ROYAL-BLUE & METALLIC-GOLD THEME */
          <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#060a16] via-[#0b142c] to-[#050811]">
            
            {/* 
              PERMANENT STICKY / FIXED TOP NAVIGATION BAR:
              Positioned sticky at top: 0 with z-50, stays permanently visible during scrolling.
              Keeps DJ EMMA PRO logo, profile image, HOME, LIVE MIXES, NONSTOPS and ABOUT ME together.
            */}
            <TopNavBar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              isAdmin={isAdminAuthenticated}
              onOpenAdmin={() => {
                if (isAdminAuthenticated) {
                  handleTabChange('admin');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
            />

            {/* 
              IMAGE 2 MASTER DASHBOARD HERO:
              Preserves DJ EMMA PRO photograph, 3D chrome lettering, and metallic royal blue/gold banner.
              Duplicate lower navigation bar is completely removed.
            */}
            <section className="w-full bg-[#060a16] border-b border-amber-400/20 shadow-2xl">
              <MainDashboardHeader />
            </section>

            {/* Content Area Activated by the Navigation Overlays */}
            <main id="dashboard-content-area" className="flex-1 w-full scroll-mt-20">
              {activeTab === 'home' && (
                <HomeSection
                  liveMixes={liveMixes}
                  nonstops={nonstops}
                  newsPosts={newsPosts}
                  artist={artist}
                  onNavigate={handleTabChange}
                  onLikeMix={handleLikeMix}
                  onLikeNews={handleLikeNews}
                  onOpenComments={handleOpenComments}
                  commentCounts={commentCounts}
                />
              )}

              {activeTab === 'live-mixes' && (
                <LiveMixesSection
                  mixes={liveMixes}
                  isAdmin={isAdminAuthenticated}
                  onOpenUpload={() => handleTabChange('admin')}
                  onLikeMix={(id) => handleLikeMix(id, 'live')}
                  onOpenComments={handleOpenComments}
                  commentCounts={commentCounts}
                />
              )}

              {activeTab === 'nonstops' && (
                <NonstopsSection
                  nonstops={nonstops}
                  isAdmin={isAdminAuthenticated}
                  onOpenUpload={() => handleTabChange('admin')}
                  onLikeNonstop={(id) => handleLikeMix(id, 'nonstop')}
                  onOpenComments={handleOpenComments}
                  commentCounts={commentCounts}
                />
              )}

              {activeTab === 'about-me' && (
                <AboutSection
                  artist={artist}
                  isAdmin={isAdminAuthenticated}
                  onOpenEditArtist={() => handleTabChange('admin')}
                />
              )}

              {activeTab === 'privacy-policy' && (
                <PrivacyPolicySection
                  onBackToHome={() => handleTabChange('home')}
                />
              )}

              {activeTab === 'terms-conditions' && (
                <TermsConditionsSection
                  onBackToHome={() => handleTabChange('home')}
                />
              )}

              {activeTab === 'admin' && (
                isAdminAuthenticated ? (
                  <AdminDashboard
                    liveMixes={liveMixes}
                    nonstops={nonstops}
                    newsPosts={newsPosts}
                    artist={artist}
                    homepage={homepage}
                    onRefreshData={refreshAllData}
                    onNavigateHome={() => handleTabChange('home')}
                    onLogout={handleLogout}
                  />
                ) : (
                  <div className="max-w-md mx-auto my-16 p-8 rounded-3xl royal-glass-card border border-amber-400/30 text-center space-y-4">
                    <h3 className="text-xl font-bold gold-chrome-text font-display uppercase">
                      Admin Access Required
                    </h3>
                    <p className="text-xs text-slate-300">
                      Please unlock the admin dashboard with your private DJ PIN.
                    </p>
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="px-6 py-3 rounded-full gold-btn text-slate-950 font-extrabold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      ENTER ADMIN PIN
                    </button>
                  </div>
                )
              )}
            </main>

            {/* Persistent Global Audio Player Dock */}
            <GlobalAudioPlayer />

            {/* Admin Login Modal */}
            <AdminLoginModal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              onLoginSuccess={handleLoginSuccess}
            />

            {/* Public Visitor Comments Modal */}
            <CommentsModal
              isOpen={commentsModal.isOpen}
              onClose={() => setCommentsModal((prev) => ({ ...prev, isOpen: false }))}
              targetId={commentsModal.targetId}
              targetType={commentsModal.targetType}
              targetTitle={commentsModal.targetTitle}
              onCommentAdded={handleCommentAdded}
            />

            {/* Cookie Consent Management Banner with Granular Preferences Modal */}
            <CookieConsentBanner
              onNavigateToPrivacy={() => handleTabChange('privacy-policy')}
              isOpenPreferences={isCookiePreferencesOpen}
              onClosePreferences={() => setIsCookiePreferencesOpen(false)}
            />

            {/* Google AdSense Compliant Footer with Legal Pages & Privacy Controls */}
            <footer className="w-full border-t border-amber-400/20 py-8 px-4 text-xs text-slate-400 bg-[#060a16]/95 backdrop-blur-md">
              <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Top Row: Brand & Quick Navigation */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-amber-300 gold-chrome-text text-base">
                      DJ EMMA PRO
                    </span>
                    <span className="text-amber-400">•</span>
                    <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">THE WAKANDA BOSS</span>
                    <span className="text-amber-400">•</span>
                    <span className="text-slate-400 text-[11px]">Serere ➔ Kampala, Uganda</span>
                  </div>

                  {/* Main Navigation Links in Footer */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] font-semibold text-slate-300">
                    <button onClick={() => handleTabChange('home')} className="hover:text-amber-300 transition cursor-pointer">
                      Home
                    </button>
                    <button onClick={() => handleTabChange('live-mixes')} className="hover:text-amber-300 transition cursor-pointer">
                      Live Mixes
                    </button>
                    <button onClick={() => handleTabChange('nonstops')} className="hover:text-amber-300 transition cursor-pointer">
                      Nonstop Mixes
                    </button>
                    <button onClick={() => handleTabChange('about-me')} className="hover:text-amber-300 transition cursor-pointer">
                      About & Booking
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleReturnToStart}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition text-[11px] cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3 text-amber-300" />
                      <span>Start Screen</span>
                    </button>

                    <button
                      onClick={() => {
                        if (isAdminAuthenticated) {
                          handleTabChange('admin');
                        } else {
                          setIsLoginModalOpen(true);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 transition text-[11px] cursor-pointer"
                    >
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      <span>{isAdminAuthenticated ? 'Admin Panel' : 'DJ Login'}</span>
                    </button>
                  </div>
                </div>

                {/* Middle Row: Google AdSense Mandatory Legal Pages & Cookie Consent */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                    <button
                      onClick={() => handleTabChange('privacy-policy')}
                      className="flex items-center gap-1.5 hover:text-amber-300 transition underline underline-offset-4 cursor-pointer"
                    >
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Privacy Policy</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('terms-conditions')}
                      className="flex items-center gap-1.5 hover:text-amber-300 transition underline underline-offset-4 cursor-pointer"
                    >
                      <FileText className="w-3 h-3 text-amber-400" />
                      <span>Terms & Conditions</span>
                    </button>

                    <button
                      onClick={() => setIsCookiePreferencesOpen(true)}
                      className="flex items-center gap-1.5 hover:text-amber-300 transition underline underline-offset-4 cursor-pointer text-amber-400 font-medium"
                    >
                      <Cookie className="w-3 h-3 text-amber-400" />
                      <span>Cookie Preferences</span>
                    </button>
                  </div>

                  <div className="text-center sm:text-right text-[10px] text-slate-400">
                    Google AdSense Partner Compliant • All Featured Artists Retain 100% IP Rights
                  </div>
                </div>

                {/* Bottom Row: Copyright & Disclaimers */}
                <div className="text-center pt-2 text-[10px] text-slate-400">
                  &copy; {new Date().getFullYear()} DJ EMMA PRO (THE WAKANDA BOSS). Official Music & Entertainment Platform.
                </div>
              </div>
            </footer>
          </div>
        )}
      </div>
    </AudioProvider>
  );
}

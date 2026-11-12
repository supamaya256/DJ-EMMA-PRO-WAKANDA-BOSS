import React, { useState } from 'react';
import { Play, Pause, Radio, Music, Disc3, Heart, ChevronRight, Newspaper, Share2, Check, Calendar, MessageSquare, Image as ImageIcon, X, ArrowRight } from 'lucide-react';
import { LiveMix, NonstopMix, NewsPost, ArtistInfo, ActiveTab } from '../types';
import { useAudio } from '../context/AudioContext';
import { isItemLikedByVisitor } from '../lib/visitor';
import { AdSenseBannerSlot } from './AdSenseBannerSlot';

interface HomeSectionProps {
  liveMixes: LiveMix[];
  nonstops: NonstopMix[];
  newsPosts: NewsPost[];
  artist: ArtistInfo;
  onNavigate: (tab: ActiveTab) => void;
  onLikeMix: (id: string, type: 'live' | 'nonstop') => void;
  onLikeNews: (id: string) => void;
  onOpenComments?: (id: string, type: 'news' | 'live' | 'nonstop', title: string) => void;
  commentCounts?: Record<string, number>;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  liveMixes,
  nonstops,
  newsPosts = [],
  artist,
  onNavigate,
  onLikeMix,
  onLikeNews,
  onOpenComments,
  commentCounts = {},
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // If no news posts currently in state, supply the verified default post from the user's reference screenshot
  const displayNews: NewsPost[] = newsPosts.length > 0 
    ? newsPosts.filter((p) => p.isPublished)
    : [
        {
          id: 'news-featured-capeciuoz',
          title: 'DJ Capeciuoz',
          content: 'DJ Capeciuoz is a prominent Ugandan disc jockey from the Serere District who performs with the Wakanda DJs collective. Known for his high-energy sets and crowd-pleasing mixes across genres like Afrobeats and local hits, he is widely recognized as a top talent on the decks.',
          imageUrl: '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
          isPublished: true,
          likesCount: 14,
          createdAt: new Date().toISOString(),
        }
      ];

  const publishedLive = liveMixes.filter((m) => m.isPublished);
  const publishedNonstops = nonstops.filter((n) => n.isPublished);

  const handleShareNews = (post: NewsPost) => {
    const url = window.location.origin + '?news=' + post.id;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.slice(0, 100),
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2500);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Nov 12, 2026';
    }
  };

  const featuredPost = displayNews[0];
  const secondaryPosts = displayNews.slice(1);

  return (
    <div className="w-full text-white pb-24 pt-2 sm:pt-4 space-y-12 animate-in fade-in duration-300">

      {/* ---------------------------------------------------- */}
      {/* SECTION 1: OFFICIAL NEWS & UPDATES (FROM REFERENCE)   */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-5">
        
        {/* Blue and Gold Metallic Header Bar matching uploaded screenshot */}
        <div className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 bg-gradient-to-r from-[#0a1432] via-[#0e1f4d] to-[#0a1432] border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg md:text-xl font-black text-white uppercase tracking-wider font-display truncate">
                OFFICIAL NEWS & UPDATES
              </h2>
              <p className="text-[10px] sm:text-xs text-amber-200/90 truncate">
                Official announcements, event dates, and personal messages from DJ EMMA PRO
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('all-news-container');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="cursor-pointer px-3 sm:px-5 py-1.5 sm:py-2 rounded-full gold-btn text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FEATURED NEWS CARD (Exact visual match to Screenshot WhatsApp Image 2026-11-12 at 9.07.01 AM (1).jpeg) */}
        {featuredPost && (
          <article className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-r from-[#070e24] via-[#0d1c44] to-[#070e24] border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.25)] flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 group hover:border-yellow-300 transition-all duration-300">
            
            {/* DJ Capeciuoz / Artist Thumbnail with gold rim */}
            <div 
              onClick={() => featuredPost.imageUrl && setPreviewImage(featuredPost.imageUrl)}
              className="relative w-full md:w-56 lg:w-64 aspect-[4/3] rounded-2xl overflow-hidden bg-[#040816] border border-amber-400/50 shadow-xl shrink-0 cursor-pointer group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition"
            >
              <img
                src={featuredPost.imageUrl || '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png'}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                <span>View Full</span>
              </span>
            </div>

            {/* Post Content */}
            <div className="flex-1 space-y-2.5 text-left w-full">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-amber-300 font-bold">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{formatDate(featuredPost.createdAt)}</span>
                <span>•</span>
                <span className="text-white">THE WAKANDA BOSS</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white gold-chrome-text font-display leading-tight">
                {featuredPost.title}
              </h3>

              <p className={`text-xs sm:text-sm text-slate-200 leading-relaxed ${expandedPostId === featuredPost.id ? '' : 'line-clamp-3 sm:line-clamp-4'}`}>
                {featuredPost.content}
              </p>

              {/* Action Buttons Row */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-amber-400/20">
                <button
                  onClick={() => setExpandedPostId(expandedPostId === featuredPost.id ? null : featuredPost.id)}
                  className="cursor-pointer px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-500/20 hover:from-amber-400 hover:to-yellow-400 text-amber-300 hover:text-slate-950 border border-amber-400/60 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition shadow"
                >
                  <span>{expandedPostId === featuredPost.id ? 'Show Less' : 'Read More'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLikeNews(featuredPost.id)}
                    className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition active:scale-95 text-xs ${
                      isItemLikedByVisitor('dj_emma_liked_news', featuredPost.id)
                        ? 'bg-rose-500/25 text-rose-300 border-rose-400/50'
                        : 'bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border-white/10'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isItemLikedByVisitor('dj_emma_liked_news', featuredPost.id) ? 'fill-rose-500 text-rose-400' : 'fill-rose-500/30 text-rose-400'}`} />
                    <span className="font-bold text-white">{featuredPost.likesCount}</span>
                  </button>

                  <button
                    onClick={() => onOpenComments?.(featuredPost.id, 'news', featuredPost.title)}
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Comments {commentCounts[featuredPost.id] ? `(${commentCounts[featuredPost.id]})` : ''}</span>
                  </button>

                  <button
                    onClick={() => handleShareNews(featuredPost)}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition text-xs"
                  >
                    {copiedPostId === featuredPost.id ? (
                      <span className="text-emerald-300 text-[11px] font-bold">Copied!</span>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </article>
        )}

        {/* Secondary News Posts Grid if available */}
        {secondaryPosts.length > 0 && (
          <div id="all-news-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-3">
            {secondaryPosts.map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl royal-glass-card overflow-hidden border border-amber-400/40 hover:border-amber-400 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {post.imageUrl && (
                    <div 
                      onClick={() => setPreviewImage(post.imageUrl || null)}
                      className="relative aspect-video w-full overflow-hidden bg-[#040816] cursor-pointer"
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-amber-300 font-semibold">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{formatDate(post.createdAt)}</span>
                      <span>•</span>
                      <span>THE WAKANDA BOSS</span>
                    </div>

                    <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition font-display line-clamp-1">
                      {post.title}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 gap-2">
                  <button
                    onClick={() => onLikeNews(post.id)}
                    className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition active:scale-95 ${
                      isItemLikedByVisitor('dj_emma_liked_news', post.id)
                        ? 'bg-rose-500/25 text-rose-300 border-rose-400/50'
                        : 'bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border-white/10'
                    }`}
                  >
                    <Heart className="w-3 h-3 text-rose-400" />
                    <span className="font-bold text-white text-[11px]">{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => onOpenComments?.(post.id, 'news', post.title)}
                    className="cursor-pointer flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                  >
                    <MessageSquare className="w-3 h-3 text-amber-400" />
                    <span>Comments {commentCounts[post.id] ? `(${commentCounts[post.id]})` : ''}</span>
                  </button>

                  <button
                    onClick={() => handleShareNews(post)}
                    className="cursor-pointer p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>

      {/* ---------------------------------------------------- */}
      {/* ADSENSE READY BANNER SLOT 1                          */}
      {/* ---------------------------------------------------- */}
      <AdSenseBannerSlot slotName="DJ EMMA PRO — Featured Entertainment Sponsor" />

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: LATEST LIVE MIXES                          */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <Radio className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black gold-chrome-text font-display uppercase tracking-wide">
                LATEST LIVE MIXES
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Live sessions and party tapes mixed live by DJ EMMA PRO
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('live-mixes')}
            className="cursor-pointer flex items-center gap-1 text-xs sm:text-sm text-amber-300 hover:text-white font-bold transition group"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {publishedLive.length === 0 ? (
          <div className="rounded-2xl royal-glass-card p-8 text-center space-y-2">
            <Radio className="w-10 h-10 text-amber-400/40 mx-auto" />
            <h3 className="text-base font-bold text-white font-display">No Live Mixes Published Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Real uploads by DJ EMMA PRO will appear here immediately after uploading.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedLive.slice(0, 3).map((mix) => {
              const isThisPlaying = currentTrack?.id === mix.id && isPlaying;
              return (
                <div
                  key={mix.id}
                  className="group rounded-2xl royal-glass-card overflow-hidden border border-amber-400/35 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#050916]">
                    <img
                      src={mix.coverUrl}
                      alt={mix.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <button
                      onClick={() => {
                        if (currentTrack?.id === mix.id) {
                          togglePlay();
                        } else {
                          playTrack(mix, 'live');
                        }
                      }}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full gold-btn flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer"
                      title={isThisPlaying ? 'Pause' : 'Play mix'}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-6 h-6 fill-slate-950" />
                      ) : (
                        <Play className="w-6 h-6 fill-slate-950 ml-1" />
                      )}
                    </button>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/80 text-amber-300 border border-amber-400/40">
                      {mix.duration}
                    </span>

                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-900/80 text-amber-200 border border-amber-400/40 backdrop-blur-md">
                      {mix.genre}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition line-clamp-1 font-display">
                        {mix.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {mix.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-amber-300">
                        <Disc3 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        {mix.playsCount} plays
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onOpenComments?.(mix.id, 'live', mix.title)}
                          className="cursor-pointer flex items-center gap-1 text-slate-300 hover:text-amber-300 transition"
                          title="Comments"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px]">Comments {commentCounts[mix.id] ? `(${commentCounts[mix.id]})` : ''}</span>
                        </button>

                        <button
                          onClick={() => onLikeMix(mix.id, 'live')}
                          className="cursor-pointer flex items-center gap-1 text-slate-300 hover:text-rose-400 transition"
                          title="Like this mix"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500/40 text-rose-400" />
                          <span>{mix.likesCount}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: FEATURED NONSTOPS                          */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-blue-800 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <Music className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black gold-chrome-text font-display uppercase tracking-wide">
                FEATURED NONSTOPS
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Continuous marathon party sessions with seamless transitions
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('nonstops')}
            className="cursor-pointer flex items-center gap-1 text-xs sm:text-sm text-amber-300 hover:text-white font-bold transition group"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {publishedNonstops.length === 0 ? (
          <div className="rounded-2xl royal-glass-card p-8 text-center space-y-2">
            <Music className="w-10 h-10 text-amber-400/40 mx-auto" />
            <h3 className="text-base font-bold text-white font-display">No Nonstops Published Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Real continuous nonstops by DJ EMMA PRO will appear here immediately after uploading.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedNonstops.slice(0, 3).map((nonstop) => {
              const isThisPlaying = currentTrack?.id === nonstop.id && isPlaying;
              return (
                <div
                  key={nonstop.id}
                  className="group rounded-2xl royal-glass-card overflow-hidden border border-amber-400/35 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#050916]">
                    <img
                      src={nonstop.coverUrl}
                      alt={nonstop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <button
                      onClick={() => {
                        if (currentTrack?.id === nonstop.id) {
                          togglePlay();
                        } else {
                          playTrack(nonstop, 'nonstop');
                        }
                      }}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full gold-btn flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer"
                      title={isThisPlaying ? 'Pause' : 'Play nonstop'}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-6 h-6 fill-slate-950" />
                      ) : (
                        <Play className="w-6 h-6 fill-slate-950 ml-1" />
                      )}
                    </button>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/80 text-amber-300 border border-amber-400/40">
                      {nonstop.duration}
                    </span>

                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-900/80 text-amber-200 border border-amber-400/40 backdrop-blur-md">
                      NONSTOP • {nonstop.tracklist?.length || 0} TRACKS
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition line-clamp-1 font-display">
                        {nonstop.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {nonstop.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-amber-300">
                        <Disc3 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        {nonstop.playsCount} plays
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onOpenComments?.(nonstop.id, 'nonstop', nonstop.title)}
                          className="cursor-pointer flex items-center gap-1 text-slate-300 hover:text-amber-300 transition"
                          title="Comments"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px]">Comments {commentCounts[nonstop.id] ? `(${commentCounts[nonstop.id]})` : ''}</span>
                        </button>

                        <button
                          onClick={() => onLikeMix(nonstop.id, 'nonstop')}
                          className="cursor-pointer flex items-center gap-1 text-slate-300 hover:text-rose-400 transition"
                          title="Like this nonstop"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500/40 text-rose-400" />
                          <span>{nonstop.likesCount}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 4: ARTIST PROFILE HIGHLIGHT                   */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="relative rounded-3xl royal-glass-card border-2 border-amber-400/50 p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-400/40">
              THE WAKANDA BOSS EXPERIENCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black gold-chrome-text font-display uppercase tracking-tight">
              DJ EMMA PRO • BIOGRAPHY & SERVICES
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-4xl">
              {artist.bio}
            </p>
            <div className="flex flex-wrap gap-4 pt-3">
              <button
                onClick={() => onNavigate('about-me')}
                className="cursor-pointer px-6 py-3 rounded-full gold-btn text-xs font-black uppercase tracking-wider"
              >
                VIEW FULL ABOUT ME & SERVICES
              </button>
              <a
                href={`https://wa.me/${artist.bookingWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer px-6 py-3 rounded-full royal-glass-card hover:bg-white/10 text-amber-300 hover:text-white font-bold text-xs uppercase tracking-wider border border-amber-400/40 transition"
              >
                DIRECT BOOKING / WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Picture Fullscreen Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Full Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border-2 border-amber-400/60"
          />
        </div>
      )}
    </div>
  );
};

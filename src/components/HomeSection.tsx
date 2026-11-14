import React, { useState, useEffect } from 'react';
import {
  Radio,
  Music,
  Heart,
  ChevronRight,
  ChevronLeft,
  Newspaper,
  Share2,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  X,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { LiveMix, NonstopMix, NewsPost, ArtistInfo, ActiveTab } from '../types';
import { isItemLikedByVisitor } from '../lib/visitor';
import { AdSenseBannerSlot } from './AdSenseBannerSlot';
import { ScrollReveal } from './ScrollReveal';
import { NonstopsCarousel3D } from './NonstopsCarousel3D';

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
  isLoadingContent?: boolean;
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
  isLoadingContent = false,
}) => {
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState<boolean>(false);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);

  const publishedNews = newsPosts.filter((p) => p.isPublished);
  const publishedLive = liveMixes.filter((m) => m.isPublished);
  const publishedNonstops = nonstops.filter((n) => n.isPublished);

  // Keep spotlightIndex in range when new articles are published or updated
  useEffect(() => {
    if (publishedNews.length === 0) {
      setSpotlightIndex(0);
    } else if (spotlightIndex >= publishedNews.length) {
      setSpotlightIndex(0);
    }
  }, [publishedNews.length, spotlightIndex]);

  // Automatic spotlight rotation across published news articles
  useEffect(() => {
    if (publishedNews.length <= 1 || isSpotlightPaused) return;
    const timer = window.setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % publishedNews.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [publishedNews.length, isSpotlightPaused]);

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

  const handleTickerClick = (post: NewsPost, idx: number) => {
    setSpotlightIndex(idx);
    setHighlightedPostId(post.id);
    const cardEl = document.getElementById(`news-post-${post.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    window.setTimeout(() => setHighlightedPostId(null), 2400);
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  const safeSpotlightIndex = publishedNews.length > 0 ? spotlightIndex % publishedNews.length : 0;
  const featuredPost = publishedNews[safeSpotlightIndex];

  return (
    <div className="w-full text-white pb-24 pt-2 sm:pt-4 space-y-12">

      {/* ---------------------------------------------------- */}
      {/* SECTION 1: OFFICIAL NEWS & UPDATES + LIVE TICKER     */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-5">

        {/* Blue and Gold Metallic Header Bar */}
        <ScrollReveal>
          <div className="electric-gold-shimmer rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 bg-gradient-to-r from-[#091538] via-[#0e235c] to-[#091538] border-2 border-amber-400/80 electric-blue-glow flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-300 via-yellow-400 to-sky-400 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-lg md:text-xl font-black text-white uppercase tracking-wider font-display truncate">
                  OFFICIAL NEWS & UPDATES
                </h2>
                <p className="text-[10px] sm:text-xs text-sky-200/90 truncate">
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
              <span>All News ({publishedNews.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </ScrollReveal>

        {/* Moving Latest-News Ticker fed automatically by published articles */}
        {publishedNews.length > 0 && (
          <div
            className="news-ticker-wrapper relative rounded-xl bg-gradient-to-r from-[#050c22] via-[#0b1b47] to-[#050c22] border border-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.18)] overflow-hidden flex items-center"
            aria-label="Latest news ticker"
          >
            <div className="relative z-10 px-3 sm:px-4 py-2 bg-gradient-to-r from-sky-500 via-blue-600 to-sky-500 text-white font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5 shrink-0 border-r border-amber-300/60 shadow-md">
              <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>LATEST NEWS</span>
            </div>

            <div className="flex-1 overflow-hidden py-2">
              <div className="news-ticker-track">
                {[...publishedNews, ...publishedNews].map((item, idx) => {
                  const realIdx = idx % publishedNews.length;
                  return (
                    <button
                      key={`${item.id}-${idx}`}
                      onClick={() => handleTickerClick(item, realIdx)}
                      className="cursor-pointer inline-flex items-center gap-2.5 px-5 text-xs sm:text-sm text-slate-100 hover:text-amber-300 transition whitespace-nowrap"
                    >
                      <span className="text-[10px] font-mono text-sky-300 font-bold">
                        {formatDate(item.createdAt)}
                      </span>
                      <span className="font-bold text-amber-300">{item.title}</span>
                      <span className="text-slate-300 max-w-xs truncate hidden sm:inline">
                        — {item.content}
                      </span>
                      <span className="text-sky-400 font-black pl-2" aria-hidden="true">◆</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Loading state while first batch fetches */}
        {isLoadingContent && publishedNews.length === 0 ? (
          <div className="rounded-2xl sm:rounded-3xl p-6 bg-gradient-to-r from-[#070e24] via-[#0d1c44] to-[#070e24] border border-sky-400/30 animate-pulse flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 aspect-[4/3] rounded-2xl bg-white/5" />
            <div className="flex-1 space-y-3 py-2">
              <div className="h-4 w-36 bg-white/10 rounded" />
              <div className="h-7 w-2/3 bg-white/10 rounded" />
              <div className="h-20 w-full bg-white/5 rounded" />
            </div>
          </div>
        ) : publishedNews.length === 0 ? (
          <div className="rounded-2xl royal-glass-card p-8 text-center space-y-2">
            <Newspaper className="w-10 h-10 text-amber-400/40 mx-auto" />
            <h3 className="text-base font-bold text-white font-display">No News Updates Published Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              New announcements from DJ EMMA PRO will appear here automatically once published.
            </p>
          </div>
        ) : (
          <>
            {/* AUTOMATICALLY TRANSITIONING FEATURED SPOTLIGHT ARTICLE */}
            {featuredPost && (
              <div
                onMouseEnter={() => setIsSpotlightPaused(true)}
                onMouseLeave={() => setIsSpotlightPaused(false)}
                onFocusCapture={() => setIsSpotlightPaused(true)}
                onBlurCapture={() => setIsSpotlightPaused(false)}
                className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#070e24] via-[#0d1c44] to-[#070e24] border-2 border-amber-400/80 shadow-[0_0_32px_rgba(56,189,248,0.22),0_0_24px_rgba(245,158,11,0.22)] overflow-hidden transition-all duration-300"
              >
                {/* Automatic transition timer progress bar */}
                {publishedNews.length > 1 && !isSpotlightPaused && (
                  <div className="w-full h-1 bg-white/10 overflow-hidden">
                    <div
                      key={featuredPost.id}
                      className="h-full bg-gradient-to-r from-sky-400 via-amber-300 to-yellow-500 spotlight-progress-bar"
                    />
                  </div>
                )}

                <article
                  key={featuredPost.id}
                  className="animate-spotlight-in p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 group"
                >
                  {/* Thumbnail with Electric-Blue & Gold Rim */}
                  {featuredPost.imageUrl && (
                    <div
                      onClick={() => setPreviewImage(featuredPost.imageUrl || null)}
                      className="relative w-full md:w-60 lg:w-72 aspect-[4/3] rounded-2xl overflow-hidden bg-[#040816] border border-sky-400/50 shadow-xl shrink-0 cursor-pointer group-hover:border-amber-400/80 group-hover:shadow-[0_0_24px_rgba(56,189,248,0.35)] transition"
                    >
                      <img
                        src={featuredPost.imageUrl}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover img-smooth-zoom"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>View Full</span>
                      </span>
                    </div>
                  )}

                  {/* Spotlight Article Content */}
                  <div className="flex-1 space-y-3 text-left w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-amber-300 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        <span>{formatDate(featuredPost.createdAt)}</span>
                        <span className="text-sky-400">•</span>
                        <span className="text-white">THE WAKANDA BOSS</span>
                      </div>

                      {publishedNews.length > 1 && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setSpotlightIndex((prev) => (prev - 1 + publishedNews.length) % publishedNews.length)
                            }
                            aria-label="Previous news article"
                            className="cursor-pointer w-7 h-7 rounded-lg bg-white/5 hover:bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center transition"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-[11px] font-mono text-sky-200 px-1.5">
                            {safeSpotlightIndex + 1} / {publishedNews.length}
                          </span>
                          <button
                            onClick={() =>
                              setSpotlightIndex((prev) => (prev + 1) % publishedNews.length)
                            }
                            aria-label="Next news article"
                            className="cursor-pointer w-7 h-7 rounded-lg bg-white/5 hover:bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center transition"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white gold-chrome-text font-display leading-tight">
                      {featuredPost.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {featuredPost.content}
                    </p>

                    {/* Spotlight Dots + Action Row */}
                    <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-amber-400/20">
                      {publishedNews.length > 1 ? (
                        <div className="flex items-center gap-1.5" role="tablist" aria-label="News spotlight selector">
                          {publishedNews.map((p, idx) => (
                            <button
                              key={p.id}
                              onClick={() => setSpotlightIndex(idx)}
                              aria-label={`View spotlight ${p.title}`}
                              className={`cursor-pointer h-2 rounded-full transition-all ${
                                idx === safeSpotlightIndex
                                  ? 'w-7 bg-gradient-to-r from-sky-400 to-amber-400 shadow-[0_0_10px_rgba(56,189,248,0.6)]'
                                  : 'w-2 bg-white/25 hover:bg-sky-300/60'
                              }`}
                            />
                          ))}
                        </div>
                      ) : (
                        <div />
                      )}

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
                          className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-sky-500/20 text-slate-300 hover:text-white border border-sky-400/25 transition text-xs"
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
              </div>
            )}

            {/* ALL PUBLISHED NEWS GRID — NO SHOW MORE / LOAD MORE TRUNCATION */}
            <div id="all-news-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {publishedNews.map((post, index) => (
                <ScrollReveal key={post.id} delayMs={index * 60}>
                  <article
                    id={`news-post-${post.id}`}
                    className={`group h-full rounded-2xl royal-glass-card card-3d-hover overflow-hidden border transition-all duration-300 shadow-xl flex flex-col justify-between ${
                      highlightedPostId === post.id
                        ? 'border-sky-400 ring-2 ring-sky-400/60 shadow-[0_0_28px_rgba(56,189,248,0.45)]'
                        : 'border-amber-400/40'
                    }`}
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
                            className="w-full h-full object-cover img-smooth-zoom"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/75 text-sky-300 border border-sky-400/35 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon className="w-3 h-3" />
                            <span>Zoom</span>
                          </span>
                        </div>
                      )}

                      <div className="p-4 sm:p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-amber-300 font-semibold">
                          <Calendar className="w-3 h-3 text-sky-400" />
                          <span>{formatDate(post.createdAt)}</span>
                          <span className="text-sky-400">•</span>
                          <span>THE WAKANDA BOSS</span>
                        </div>

                        <h4 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition font-display">
                          {post.title}
                        </h4>

                        <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed whitespace-pre-line">
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
                        <Heart className={`w-3 h-3 ${isItemLikedByVisitor('dj_emma_liked_news', post.id) ? 'fill-rose-500 text-rose-400' : 'text-rose-400'}`} />
                        <span className="font-bold text-white text-[11px]">{post.likesCount}</span>
                      </button>

                      <button
                        onClick={() => onOpenComments?.(post.id, 'news', post.title)}
                        className="cursor-pointer flex items-center gap-1 text-[11px] text-slate-300 hover:text-sky-300 transition"
                      >
                        <MessageSquare className="w-3 h-3 text-amber-400" />
                        <span>Comments {commentCounts[post.id] ? `(${commentCounts[post.id]})` : ''}</span>
                      </button>

                      <button
                        onClick={() => handleShareNews(post)}
                        className="cursor-pointer p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition"
                        title="Share article"
                      >
                        {copiedPostId === post.id ? (
                          <span className="text-[10px] font-bold text-emerald-300">Copied</span>
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ---------------------------------------------------- */}
      {/* ADSENSE READY BANNER SLOT 1                          */}
      {/* ---------------------------------------------------- */}
      <AdSenseBannerSlot slotName="DJ EMMA PRO — Featured Entertainment Sponsor" />

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: ALL PUBLISHED LIVE MIXES                   */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <ScrollReveal>
          <div className="flex items-center justify-between pb-3 border-b border-amber-400/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-700 to-amber-500 flex items-center justify-center text-white shadow-lg border border-sky-400/40">
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
              className="cursor-pointer flex items-center gap-1 text-xs sm:text-sm text-amber-300 hover:text-sky-300 font-bold transition group"
            >
              <span>VIEW ALL ({publishedLive.length})</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </ScrollReveal>

        {isLoadingContent && publishedLive.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((sk) => (
              <div key={sk} className="h-72 rounded-2xl royal-glass-card animate-pulse" />
            ))}
          </div>
        ) : publishedLive.length === 0 ? (
          <div className="rounded-2xl royal-glass-card p-8 text-center space-y-2">
            <Radio className="w-10 h-10 text-amber-400/40 mx-auto" />
            <h3 className="text-base font-bold text-white font-display">No Live Mixes Published Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Real uploads by DJ EMMA PRO will appear here immediately after uploading.
            </p>
          </div>
        ) : (
          <NonstopsCarousel3D
            trackType="live"
            items={publishedLive}
            onLikeItem={(id) => onLikeMix(id, 'live')}
            onOpenComments={onOpenComments}
            commentCounts={commentCounts}
            showTracklistInFocus={false}
            showShareInFocus={true}
          />
        )}
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: ALL PUBLISHED FEATURED NONSTOPS            */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <ScrollReveal>
          <div className="flex items-center justify-between pb-3 border-b border-amber-400/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-sky-500 to-amber-500 flex items-center justify-center text-white shadow-lg border border-sky-400/40">
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
              className="cursor-pointer flex items-center gap-1 text-xs sm:text-sm text-amber-300 hover:text-sky-300 font-bold transition group"
            >
              <span>VIEW ALL ({publishedNonstops.length})</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </ScrollReveal>

        {isLoadingContent && publishedNonstops.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((sk) => (
              <div key={sk} className="h-72 rounded-2xl royal-glass-card animate-pulse" />
            ))}
          </div>
        ) : publishedNonstops.length === 0 ? (
          <div className="rounded-2xl royal-glass-card p-8 text-center space-y-2">
            <Music className="w-10 h-10 text-amber-400/40 mx-auto" />
            <h3 className="text-base font-bold text-white font-display">No Nonstops Published Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Real continuous nonstops by DJ EMMA PRO will appear here immediately after uploading.
            </p>
          </div>
        ) : (
          <NonstopsCarousel3D
            nonstops={publishedNonstops}
            onLikeNonstop={(id) => onLikeMix(id, 'nonstop')}
            onOpenComments={onOpenComments}
            commentCounts={commentCounts}
            showTracklistInFocus={true}
          />
        )}
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 4: ARTIST PROFILE HIGHLIGHT                   */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="relative rounded-3xl royal-glass-card electric-gold-shimmer card-3d-hover border-2 border-amber-400/50 p-6 sm:p-10 overflow-hidden shadow-2xl">
            <div className="space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-sky-500/15 text-sky-300 border border-sky-400/40">
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
                  className="cursor-pointer px-6 py-3 rounded-full royal-glass-card hover:bg-sky-500/15 text-amber-300 hover:text-sky-200 font-bold text-xs uppercase tracking-wider border border-sky-400/40 transition"
                >
                  DIRECT BOOKING / WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Picture Fullscreen Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
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

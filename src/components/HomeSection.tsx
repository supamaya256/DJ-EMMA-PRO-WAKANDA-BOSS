import React, { useState } from 'react';
import {
  Radio,
  Music,
  Disc3,
  Heart,
  ChevronRight,
  Newspaper,
  Share2,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  X,
  ArrowRight,
  Zap,
  Play,
  Pause,
  Download,
} from 'lucide-react';
import { LiveMix, NonstopMix, NewsPost, ArtistInfo, ActiveTab } from '../types';
import { isItemLikedByVisitor } from '../lib/visitor';
import { AdSenseBannerSlot } from './AdSenseBannerSlot';
import { ScrollReveal } from './ScrollReveal';
import { MixCardRainflow } from './MixCardRainflow';
import { useAudio } from '../context/AudioContext';

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
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsPost | null>(null);

  const publishedNews = newsPosts.filter((p) => p.isPublished);
  const publishedLive = liveMixes.filter((m) => m.isPublished);
  const publishedNonstops = nonstops.filter((n) => n.isPublished);

  // Latest Mixtapes combines newest published releases across Live Mixes and Nonstops
  const latestMixtapes = [
    ...publishedLive.map((m) => ({ ...m, releaseKind: 'live' as const })),
    ...publishedNonstops.map((n) => ({ ...n, releaseKind: 'nonstop' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
      window.setTimeout(() => setCopiedPostId(null), 2400);
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
      return 'Recent';
    }
  };

  return (
    <div className="w-full text-white pb-20 space-y-20 sm:space-y-24">

      {/* ==================================================================== */}
      {/* VISUAL SECTION ONE: LARGE DJ EMMA PRO WAKANDA STAGE PRESENTATION     */}
      {/* ==================================================================== */}
      <section className="relative w-full py-14 sm:py-20 bg-[#120526] border-b border-[#ec1d64]/20 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -left-24 top-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full blur-[120px] opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ec1d64 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Large Prominent Portrait with Neon Magenta Architectural Frame */}
          <ScrollReveal className="lg:col-span-6">
            <div className="relative p-3 sm:p-4">
              <div
                aria-hidden="true"
                className="absolute inset-4 -translate-x-3 translate-y-3 border-[5px] border-[#ec1d64] pointer-events-none"
              />
              <div className="relative z-10 overflow-hidden bg-[#0e041f] border border-white/15 shadow-[0_24px_60px_rgba(4,1,14,0.9)]">
                <img
                  src="/assets/aistudio/1000355629_1467eab5.png"
                  alt="DJ EMMA PRO - The Wakanda Boss"
                  className="w-full h-auto max-h-[540px] object-cover object-top block"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Editorial Presentation Copy */}
          <ScrollReveal delayMs={100} className="lg:col-span-6 space-y-5">
            <span className="inline-block text-xs font-rainflow-condensed font-bold uppercase tracking-[0.26em] text-[#ec1d64]">
              01 · THE WAKANDA BOSS EXPERIENCE
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white leading-[1.02] uppercase">
              Signature Club Energy & Unstoppable Vibes
            </h2>
            <p className="text-sm sm:text-base text-purple-100/85 leading-relaxed">
              Known across the entertainment scene as <strong className="text-white">THE WAKANDA BOSS</strong>, DJ EMMA PRO delivers crowd-commanding club sets, precision transitions, and studio-mastered party sessions that unite Afrobeats, Dancehall, Amapiano, and Ugandan anthems.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('live-mixes')}
                className="cursor-pointer gold-btn px-7 py-3.5 font-rainflow-condensed text-xs sm:text-sm font-bold uppercase tracking-[0.18em] inline-flex items-center gap-2"
              >
                <span>STREAM LIVE MIXES</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('gallery')}
                className="cursor-pointer rainflow-btn-primary px-6 py-3.5 font-rainflow-condensed text-xs sm:text-sm font-bold uppercase tracking-[0.18em]"
              >
                VIEW GALLERY
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* VISUAL SECTION TWO: LARGE REVERSE BIOGRAPHY & ROOTS PRESENTATION     */}
      {/* ==================================================================== */}
      <section className="relative w-full py-12 sm:py-18 bg-[#0e041f] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Narrative */}
          <ScrollReveal className="lg:col-span-6 space-y-5 order-2 lg:order-1">
            <span className="inline-block text-xs font-rainflow-condensed font-bold uppercase tracking-[0.26em] text-[#ec1d64]">
              02 · SERERE TO KAMPALA, UGANDA
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white leading-[1.02] uppercase">
              Music Mixing, Branding & Creative Craft
            </h2>
            <p className="text-sm sm:text-base text-purple-100/85 leading-relaxed">
              {artist.bio}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <span className="text-[11px] font-rainflow-condensed uppercase tracking-widest text-pink-300 block">
                  ORIGIN
                </span>
                <span className="text-sm font-bold text-white">{artist.origin}</span>
              </div>
              <div>
                <span className="text-[11px] font-rainflow-condensed uppercase tracking-widest text-pink-300 block">
                  BASE LOCATION
                </span>
                <span className="text-sm font-bold text-white">{artist.baseLocation}</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('about-me')}
                className="cursor-pointer rainflow-btn-primary px-7 py-3.5 font-rainflow-condensed text-xs sm:text-sm font-bold uppercase tracking-[0.18em] inline-flex items-center gap-2"
              >
                <span>READ FULL BIOGRAPHY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

          {/* Right Large Visual Photo */}
          <ScrollReveal delayMs={100} className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative p-3 sm:p-4">
              <div
                aria-hidden="true"
                className="absolute inset-4 translate-x-3 translate-y-3 border-[5px] border-[#ec1d64] pointer-events-none"
              />
              <div className="relative z-10 overflow-hidden bg-[#16072b] border border-white/15 shadow-[0_24px_60px_rgba(4,1,14,0.92)]">
                <img
                  src="/assets/aistudio/download_036376fa.jpg"
                  alt="DJ EMMA PRO Creative Portrait"
                  className="w-full h-auto max-h-[540px] object-cover object-top block"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* VISUAL SECTION THREE: FULL-WIDTH STAGE VISUAL & CREATIVE EMPIRE      */}
      {/* ==================================================================== */}
      <section className="relative w-full min-h-[460px] sm:min-h-[520px] flex items-center overflow-hidden border-y border-[#ec1d64]/40 bg-[#14052b]">
        {/* Full-Width Preserved DJ EMMA PRO Artwork Backdrop */}
        <img
          src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.07.01_AM_d9477edb.jpeg"
          alt="DJ EMMA PRO Official Stage Visual"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0e041f]/95 via-[#17062e]/85 to-[#0e041f]/75"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <span className="inline-block text-xs font-rainflow-condensed font-bold uppercase tracking-[0.26em] text-[#ec1d64]">
              03 · FULL-SCALE ENTERTAINMENT & DROPS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white uppercase leading-[0.98]">
              DJ Drops, Marathon Nonstops & Event Bookings
            </h2>
            <p className="text-sm sm:text-base text-purple-100/85 max-w-2xl leading-relaxed">
              From electrifying club performances and continuous marathon nonstop party sessions to custom studio DJ drops and graphic branding artwork tailored for artists, events, and brands across East Africa.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('nonstops')}
                className="cursor-pointer gold-btn px-7 py-3.5 font-rainflow-condensed text-xs sm:text-sm font-bold uppercase tracking-[0.18em]"
              >
                EXPLORE NONSTOP MIXES
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="cursor-pointer rainflow-btn-primary px-7 py-3.5 font-rainflow-condensed text-xs sm:text-sm font-bold uppercase tracking-[0.18em]"
              >
                CONTACT FOR BOOKING
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-48 h-48 sm:w-60 sm:h-60 p-3 bg-[#0e041f]/80 border-2 border-[#ec1d64]/65 shadow-[0_0_40px_rgba(236,29,100,0.35)]">
              <img
                src="/assets/aistudio/Glossy_DJ_Emma_Pro_Emblem__1__be0e7f62.png"
                alt="DJ EMMA PRO Official Emblem"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <AdSenseBannerSlot slotName="DJ EMMA PRO · Official Partner Network" />

      {/* ==================================================================== */}
      {/* SECTION 4: LATEST NEWS                                               */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ec1d64]/35 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.24em] text-[#ec1d64]">
                OFFICIAL ANNOUNCEMENTS & TOUR DISPATCH
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                LATEST NEWS
              </h2>
            </div>

            <button
              onClick={() => onNavigate('news')}
              className="cursor-pointer self-start sm:self-auto inline-flex items-center gap-1.5 font-rainflow-condensed text-xs font-bold uppercase tracking-[0.18em] text-[#ff4f8d] hover:text-white transition"
            >
              <span>VIEW ALL NEWS ({publishedNews.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>

        {/* Moving Breaking News Ticker */}
        {publishedNews.length > 0 && (
          <div
            className="news-ticker-wrapper relative bg-[#16072b] border border-[#ec1d64]/40 overflow-hidden flex items-center"
            aria-label="Latest news ticker"
          >
            <div className="relative z-10 px-4 py-2 bg-[#ec1d64] text-white font-rainflow-condensed font-bold text-xs uppercase tracking-[0.18em] flex items-center gap-1.5 shrink-0">
              <Zap className="w-3.5 h-3.5" />
              <span>LATEST NEWS</span>
            </div>

            <div className="flex-1 overflow-hidden py-2">
              <div className="news-ticker-track">
                {[...publishedNews, ...publishedNews].map((item, idx) => (
                  <button
                    key={`${item.id}-${idx}`}
                    onClick={() => setSelectedArticle(item)}
                    className="cursor-pointer inline-flex items-center gap-2.5 px-5 text-xs sm:text-sm text-purple-100 hover:text-pink-300 transition whitespace-nowrap"
                  >
                    <span className="text-[11px] font-mono text-pink-300 font-bold">
                      {formatDate(item.createdAt)}
                    </span>
                    <span className="font-bold text-white">{item.title}</span>
                    <span className="text-purple-200/70 max-w-xs truncate hidden sm:inline">
                      — {item.content}
                    </span>
                    <span className="text-[#ec1d64] pl-2" aria-hidden="true">◆</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isLoadingContent && publishedNews.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((sk) => (
              <div key={sk} className="h-80 bg-[#16072b] border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : publishedNews.length === 0 ? (
          <div className="bg-[#16072b] border border-white/10 p-10 text-center space-y-2">
            <Newspaper className="w-10 h-10 text-[#ec1d64]/60 mx-auto" />
            <h3 className="text-base font-bold text-white">No News Updates Published Yet</h3>
            <p className="text-xs text-purple-200/70 max-w-md mx-auto">
              New announcements from DJ EMMA PRO will appear here automatically once published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedNews.map((post) => {
              const isLiked = isItemLikedByVisitor('dj_emma_liked_news', post.id);
              return (
                <article
                  key={post.id}
                  className="group bg-[#16072b] border border-[#ec1d64]/25 hover:border-[#ec1d64] transition flex flex-col justify-between overflow-hidden shadow-xl"
                >
                  <div>
                    <div
                      onClick={() => setSelectedArticle(post)}
                      className="relative aspect-[16/10] w-full overflow-hidden bg-[#0e041f] cursor-pointer"
                    >
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover img-smooth-zoom"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2d0c54] to-[#0e041f] flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-[#ec1d64]/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#16072b] via-transparent to-transparent pointer-events-none" />
                    </div>

                    <div className="p-6 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-pink-300 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#ec1d64]" />
                        <span>{formatDate(post.createdAt)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-purple-200/75">THE WAKANDA BOSS</span>
                      </div>

                      <h3
                        onClick={() => setSelectedArticle(post)}
                        className="font-bold text-lg sm:text-xl text-white group-hover:text-pink-300 transition leading-snug cursor-pointer"
                      >
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed line-clamp-3">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => setSelectedArticle(post)}
                      className="cursor-pointer inline-flex items-center gap-1.5 font-rainflow-condensed font-bold uppercase tracking-[0.16em] text-[#ff4f8d] hover:text-white transition"
                    >
                      <span>READ MORE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onLikeNews(post.id)}
                        className={`cursor-pointer flex items-center gap-1 transition ${
                          isLiked ? 'text-[#ec1d64] font-bold' : 'text-purple-200 hover:text-pink-300'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#ec1d64]' : ''}`} />
                        <span className="tabular-nums">{post.likesCount}</span>
                      </button>

                      <button
                        onClick={() => onOpenComments?.(post.id, 'news', post.title)}
                        className="cursor-pointer flex items-center gap-1 text-purple-200 hover:text-pink-300 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{commentCounts[post.id] || 0}</span>
                      </button>

                      <button
                        onClick={() => handleShareNews(post)}
                        className="cursor-pointer text-purple-200 hover:text-pink-300 transition"
                      >
                        {copiedPostId === post.id ? (
                          <span className="text-emerald-300 text-[11px] font-bold">Copied!</span>
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* SECTION 5: LIVE MIXES                                                */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ec1d64]/35 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.24em] text-[#ec1d64]">
                CLUB PERFORMANCES & RECORDED SESSIONS
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                LIVE MIXES
              </h2>
            </div>

            <button
              onClick={() => onNavigate('live-mixes')}
              className="cursor-pointer self-start sm:self-auto inline-flex items-center gap-1.5 font-rainflow-condensed text-xs font-bold uppercase tracking-[0.18em] text-[#ff4f8d] hover:text-white transition"
            >
              <span>ALL LIVE MIXES ({publishedLive.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>

        {isLoadingContent && publishedLive.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((sk) => (
              <div key={sk} className="h-80 bg-[#16072b] border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : publishedLive.length === 0 ? (
          <div className="bg-[#16072b] border border-white/10 p-10 text-center space-y-2">
            <Radio className="w-10 h-10 text-[#ec1d64]/60 mx-auto" />
            <h3 className="text-base font-bold text-white">No Live Mixes Published Yet</h3>
            <p className="text-xs text-purple-200/70 max-w-md mx-auto">
              Real live club sets by DJ EMMA PRO will appear here immediately after uploading.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedLive.map((mix) => (
              <MixCardRainflow
                key={mix.id}
                mix={mix}
                trackType="live"
                onLike={(id) => onLikeMix(id, 'live')}
                onOpenComments={onOpenComments}
                commentCount={commentCounts[mix.id] || 0}
              />
            ))}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* SECTION 6: NONSTOP MIXES                                             */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ec1d64]/35 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.24em] text-[#ec1d64]">
                UNINTERRUPTED MARATHON SESSIONS
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                NONSTOP MIXES
              </h2>
            </div>

            <button
              onClick={() => onNavigate('nonstops')}
              className="cursor-pointer self-start sm:self-auto inline-flex items-center gap-1.5 font-rainflow-condensed text-xs font-bold uppercase tracking-[0.18em] text-[#ff4f8d] hover:text-white transition"
            >
              <span>ALL NONSTOPS ({publishedNonstops.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>

        {isLoadingContent && publishedNonstops.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((sk) => (
              <div key={sk} className="h-80 bg-[#16072b] border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : publishedNonstops.length === 0 ? (
          <div className="bg-[#16072b] border border-white/10 p-10 text-center space-y-2">
            <Music className="w-10 h-10 text-[#ec1d64]/60 mx-auto" />
            <h3 className="text-base font-bold text-white">No Nonstop Mixes Published Yet</h3>
            <p className="text-xs text-purple-200/70 max-w-md mx-auto">
              Continuous nonstop mixes by DJ EMMA PRO will appear here immediately after uploading.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedNonstops.map((nonstop) => (
              <MixCardRainflow
                key={nonstop.id}
                mix={nonstop}
                trackType="nonstop"
                onLike={(id) => onLikeMix(id, 'nonstop')}
                onOpenComments={onOpenComments}
                commentCount={commentCounts[nonstop.id] || 0}
                showTracklist={true}
              />
            ))}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* SECTION 7: LATEST MIXTAPES (TRACKLIST / RELEASE CATALOG)             */}
      {/* ==================================================================== */}
      {latestMixtapes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ec1d64]/35 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.24em] text-[#ec1d64]">
                  COMPLETE RELEASES & DIRECT DOWNLOADS
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                  LATEST MIXTAPES
                </h2>
              </div>

              <span className="font-mono text-xs text-pink-200/80">
                {latestMixtapes.length} Published Releases
              </span>
            </div>
          </ScrollReveal>

          <div className="divide-y divide-white/10 bg-[#16072b] border border-[#ec1d64]/30">
            {latestMixtapes.map((item, idx) => {
              const isItemPlaying = currentTrack?.id === item.id && isPlaying;
              return (
                <div
                  key={`${item.releaseKind}-${item.id}`}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.03] transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="font-mono text-xs text-[#ec1d64] font-bold w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="w-12 h-12 shrink-0 overflow-hidden bg-[#0e041f] border border-white/15">
                      {item.coverUrl ? (
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Disc3 className="w-5 h-5 text-[#ec1d64]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-white truncate">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-purple-200/75">
                        <span className="text-pink-300 font-semibold uppercase">
                          {item.releaseKind === 'live' ? 'Live Mix' : 'Nonstop Mix'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.genre}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{item.duration}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{item.playsCount} plays</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => {
                        if (currentTrack?.id === item.id) {
                          togglePlay();
                        } else {
                          playTrack(item, item.releaseKind);
                        }
                      }}
                      className={`cursor-pointer px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
                        isItemPlaying
                          ? 'bg-[#ec1d64] text-white'
                          : 'bg-[#230b47] hover:bg-[#ec1d64] text-white border border-white/15'
                      }`}
                    >
                      {isItemPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-white" />
                          <span>PAUSE</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>PLAY</span>
                        </>
                      )}
                    </button>

                    {item.audioUrl && (
                      <a
                        href={`/.netlify/functions/download-audio?url=${encodeURIComponent(item.audioUrl)}&title=${encodeURIComponent(item.title)}`}
                        download={`${item.title.replace(/[^a-zA-Z0-9._-]/g, '_')}.mp3`}
                        className="px-4 py-2 bg-[#0e041f] hover:bg-[#ec1d64] text-pink-200 hover:text-white text-xs font-bold uppercase tracking-wider border border-[#ec1d64]/45 flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>DOWNLOAD</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Article Fullscreen Read More Modal */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#16072b] border-2 border-[#ec1d64] shadow-2xl overflow-hidden my-8"
          >
            <button
              onClick={() => setSelectedArticle(null)}
              aria-label="Close article modal"
              className="cursor-pointer absolute top-4 right-4 z-20 w-9 h-9 bg-black/80 hover:bg-[#ec1d64] text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedArticle.imageUrl && (
              <div className="w-full max-h-[400px] bg-[#0e041f] overflow-hidden">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-pink-300 font-semibold">
                <Calendar className="w-4 h-4 text-[#ec1d64]" />
                <span>{formatDate(selectedArticle.createdAt)}</span>
                <span aria-hidden="true">·</span>
                <span>DJ EMMA PRO · THE WAKANDA BOSS</span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                {selectedArticle.title}
              </h3>

              <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed whitespace-pre-line">
                {selectedArticle.content}
              </p>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onLikeNews(selectedArticle.id)}
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-[#230b47] hover:bg-[#ec1d64] text-white text-xs font-bold transition"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Like ({selectedArticle.likesCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      const target = selectedArticle;
                      setSelectedArticle(null);
                      onOpenComments?.(target.id, 'news', target.title);
                    }}
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-[#230b47] hover:bg-[#ec1d64] text-white text-xs font-bold transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Comments ({commentCounts[selectedArticle.id] || 0})</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="cursor-pointer px-4 py-1.5 border border-white/25 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

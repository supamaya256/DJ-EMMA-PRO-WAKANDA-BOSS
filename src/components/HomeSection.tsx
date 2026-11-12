import React, { useState } from 'react';
import { Play, Pause, Radio, Music, Disc3, Heart, ChevronRight, Newspaper, Share2, Check, Calendar, MessageSquare, Image as ImageIcon, X } from 'lucide-react';
import { LiveMix, NonstopMix, NewsPost, ArtistInfo, ActiveTab } from '../types';
import { useAudio } from '../context/AudioContext';
import { isItemLikedByVisitor } from '../lib/visitor';

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

  const publishedLive = liveMixes.filter((m) => m.isPublished);
  const publishedNonstops = nonstops.filter((n) => n.isPublished);
  const publishedNews = newsPosts.filter((p) => p.isPublished);

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
      return 'Recent';
    }
  };

  return (
    <div className="w-full text-white pb-24 pt-4 sm:pt-6 space-y-14">

      {/* SECTION 1: OFFICIAL ARTIST NEWS & ANNOUNCEMENTS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black chrome-text font-display uppercase tracking-wide">
                OFFICIAL NEWS & UPDATES
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Official announcements, event dates, and personal messages from DJ EMMA PRO
              </p>
            </div>
          </div>
        </div>

        {publishedNews.length === 0 ? (
          <div className="rounded-2xl glass-card border border-white/15 p-8 text-center space-y-2">
            <Newspaper className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white font-display">No News Posts Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Real announcements and messages from DJ EMMA PRO will be published here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedNews.map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl glass-card overflow-hidden border border-white/20 hover:border-amber-400/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Attached Picture if provided */}
                  {post.imageUrl && (
                    <div 
                      onClick={() => setPreviewImage(post.imageUrl || null)}
                      className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white border border-white/10 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>Tap to view full</span>
                      </span>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-amber-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatDate(post.createdAt)}</span>
                      <span>•</span>
                      <span>THE WAKANDA BOSS</span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition font-display leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                </div>

                {/* Footer Actions: Like, Comment & Share */}
                <div className="px-5 pb-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 gap-2">
                  <button
                    onClick={() => onLikeNews(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition active:scale-95 ${
                      isItemLikedByVisitor('dj_emma_liked_news', post.id)
                        ? 'bg-rose-500/25 text-rose-300 border-rose-400/50'
                        : 'bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border-white/10'
                    }`}
                    title={isItemLikedByVisitor('dj_emma_liked_news', post.id) ? 'Unlike post' : 'Like this post'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isItemLikedByVisitor('dj_emma_liked_news', post.id) ? 'fill-rose-500 text-rose-400' : 'fill-rose-500/30 text-rose-400'}`} />
                    <span className="font-bold text-white">{post.likesCount}</span>
                    <span className="text-[11px] text-slate-400 hidden xs:inline">
                      {isItemLikedByVisitor('dj_emma_liked_news', post.id) ? 'Liked' : 'Likes'}
                    </span>
                  </button>

                  <button
                    onClick={() => onOpenComments?.(post.id, 'news', post.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition text-xs cursor-pointer"
                    title="View and post comments"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Comments {commentCounts[post.id] ? `(${commentCounts[post.id]})` : ''}</span>
                  </button>

                  <button
                    onClick={() => handleShareNews(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition text-xs"
                    title="Share this post"
                  >
                    {copiedPostId === post.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 text-[11px]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden xs:inline">Share</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: LATEST LIVE MIXES */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black chrome-text font-display uppercase tracking-wide">
                LATEST LIVE MIXES
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Live sessions and party tapes mixed live by DJ EMMA PRO
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('live-mixes')}
            className="flex items-center gap-1 text-xs sm:text-sm text-cyan-300 hover:text-white font-bold transition group"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Live Mixes Cards Grid or Empty State */}
        {publishedLive.length === 0 ? (
          <div className="rounded-2xl glass-card border border-white/15 p-8 text-center space-y-2">
            <Radio className="w-10 h-10 text-slate-500 mx-auto" />
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
                  className="group rounded-2xl glass-card overflow-hidden border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
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
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/90 hover:bg-white text-slate-950 flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95"
                      title={isThisPlaying ? 'Pause' : 'Play mix'}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-6 h-6 fill-slate-950" />
                      ) : (
                        <Play className="w-6 h-6 fill-slate-950 ml-1" />
                      )}
                    </button>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/70 text-slate-200 border border-white/10">
                      {mix.duration}
                    </span>

                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 backdrop-blur-md">
                      {mix.genre}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition line-clamp-1 font-display">
                        {mix.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {mix.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Disc3 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                        {mix.playsCount} plays
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onOpenComments?.(mix.id, 'live', mix.title)}
                          className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                          title="Comments"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-[11px]">Comments {commentCounts[mix.id] ? `(${commentCounts[mix.id]})` : ''}</span>
                        </button>

                        <button
                          onClick={() => onLikeMix(mix.id, 'live')}
                          className="flex items-center gap-1 text-slate-300 hover:text-rose-400 transition"
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

      {/* SECTION 3: FEATURED NONSTOPS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black chrome-text font-display uppercase tracking-wide">
                FEATURED NONSTOPS
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Continuous marathon party sessions with seamless transitions
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('nonstops')}
            className="flex items-center gap-1 text-xs sm:text-sm text-purple-300 hover:text-white font-bold transition group"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {publishedNonstops.length === 0 ? (
          <div className="rounded-2xl glass-card border border-white/15 p-8 text-center space-y-2">
            <Music className="w-10 h-10 text-slate-500 mx-auto" />
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
                  className="group rounded-2xl glass-card overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
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
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/90 hover:bg-white text-slate-950 flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95"
                      title={isThisPlaying ? 'Pause' : 'Play nonstop'}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-6 h-6 fill-slate-950" />
                      ) : (
                        <Play className="w-6 h-6 fill-slate-950 ml-1" />
                      )}
                    </button>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/70 text-slate-200 border border-white/10">
                      {nonstop.duration}
                    </span>

                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/40 backdrop-blur-md">
                      NONSTOP • {nonstop.tracklist?.length || 0} TRACKS
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition line-clamp-1 font-display">
                        {nonstop.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {nonstop.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Disc3 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                        {nonstop.playsCount} plays
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onOpenComments?.(nonstop.id, 'nonstop', nonstop.title)}
                          className="flex items-center gap-1 text-slate-300 hover:text-purple-300 transition cursor-pointer"
                          title="Comments"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-[11px]">Comments {commentCounts[nonstop.id] ? `(${commentCounts[nonstop.id]})` : ''}</span>
                        </button>

                        <button
                          onClick={() => onLikeMix(nonstop.id, 'nonstop')}
                          className="flex items-center gap-1 text-slate-300 hover:text-rose-400 transition"
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

      {/* SECTION 4: ARTIST PROFILE HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="relative rounded-3xl glass-card border border-white/20 p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              THE WAKANDA BOSS EXPERIENCE
            </span>
            <h2 className="text-xl sm:text-3xl font-black chrome-text font-display uppercase">
              DJ EMMA PRO • BIOGRAPHY & SERVICES
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {artist.bio}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('about-me')}
                className="px-6 py-3 rounded-full bg-white text-slate-900 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-200 transition shadow-lg"
              >
                VIEW FULL ABOUT ME & SERVICES
              </button>
              <a
                href={`https://wa.me/${artist.bookingWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full glass-card hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/30 transition"
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
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Full Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/20"
          />
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Play, Pause, Search, Radio, Disc3, Heart, Calendar, PlusCircle, Share2, Check, MessageSquare } from 'lucide-react';
import { LiveMix } from '../types';
import { useAudio } from '../context/AudioContext';
import { isItemLikedByVisitor } from '../lib/visitor';

interface LiveMixesSectionProps {
  mixes: LiveMix[];
  isAdmin: boolean;
  onOpenUpload: () => void;
  onLikeMix: (id: string) => void;
  onOpenComments?: (id: string, type: 'live', title: string) => void;
}

export const LiveMixesSection: React.FC<LiveMixesSectionProps> = ({
  mixes,
  isAdmin,
  onOpenUpload,
  onLikeMix,
  onOpenComments,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const publishedMixes = mixes.filter((m) => m.isPublished);

  // Extract unique genres
  const genres = ['ALL', ...Array.from(new Set(publishedMixes.map((m) => m.genre || 'Afrobeats')))];

  const filteredMixes = publishedMixes.filter((mix) => {
    const matchesSearch =
      mix.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mix.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mix.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'ALL' || mix.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleShare = (mix: LiveMix) => {
    navigator.clipboard?.writeText(window.location.origin + '?mix=' + mix.id);
    setCopiedId(mix.id);
    setTimeout(() => setCopiedId(null), 2000);
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
    <div className="w-full text-white pb-28 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl glass-card border border-white/25 p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
              <span>OFFICIAL LIVE SETS & CLUB ANTHEMS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black chrome-text font-display uppercase tracking-tight">
              LIVE MIXES
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Stream live club performances, stage mixes, and high-energy party tapes recorded live by DJ EMMA PRO – THE WAKANDA BOSS.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenUpload}
              className="self-start md:self-center px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-105 transition cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>UPLOAD NEW LIVE MIX</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        {/* Genre Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedGenre === g
                  ? 'glass-nav-active text-white border border-cyan-400/50 shadow-md'
                  : 'glass-card text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search live mixes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full glass-card border border-white/20 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Mixes List / Grid */}
      {filteredMixes.length === 0 ? (
        <div className="rounded-2xl glass-card border border-white/15 p-12 text-center space-y-3">
          <Radio className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-display">
            {publishedMixes.length === 0 ? 'No Live Mixes Published Yet' : 'No Live Mixes Match Your Search'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {publishedMixes.length === 0
              ? 'Real live club sets, festival sessions, and DJ tapes will appear here as soon as they are uploaded.'
              : 'Try clearing your search query or selecting ALL genres.'}
          </p>
          {isAdmin && publishedMixes.length === 0 && (
            <button
              onClick={onOpenUpload}
              className="mt-2 px-5 py-2.5 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:scale-105 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>UPLOAD FIRST LIVE MIX</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMixes.map((mix) => {
            const isThisPlaying = currentTrack?.id === mix.id && isPlaying;
            return (
              <div
                key={mix.id}
                className="group rounded-2xl glass-card overflow-hidden border border-white/20 hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
              >
                {/* Artwork Top */}
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={mix.coverUrl}
                      alt={mix.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Central Play Trigger */}
                    <button
                      onClick={() => {
                        if (currentTrack?.id === mix.id) {
                          togglePlay();
                        } else {
                          playTrack(mix, 'live');
                        }
                      }}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/95 hover:bg-white text-slate-950 flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer"
                      title={isThisPlaying ? 'Pause' : 'Play live mix'}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-6 h-6 fill-slate-950" />
                      ) : (
                        <Play className="w-6 h-6 fill-slate-950 ml-1" />
                      )}
                    </button>

                    {/* Genre Tag */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 backdrop-blur-md">
                      {mix.genre}
                    </span>

                    {/* Duration */}
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/80 text-white border border-white/10">
                      {mix.duration}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{formatDate(mix.createdAt)}</span>
                      <span>•</span>
                      <span>DJ EMMA PRO</span>
                    </div>

                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition line-clamp-1 font-display">
                      {mix.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {mix.description}
                    </p>
                  </div>
                </div>

                {/* Footer Controls: Comments, Likes, Plays, Share */}
                <div className="px-5 pb-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Disc3 className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="font-mono text-slate-300">{mix.playsCount} plays</span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => onOpenComments?.(mix.id, 'live', mix.title)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-cyan-300 border border-white/10 transition text-xs cursor-pointer"
                      title="View & post comments"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[11px]">Comments</span>
                    </button>

                    <button
                      onClick={() => onLikeMix(mix.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition active:scale-95 cursor-pointer ${
                        isItemLikedByVisitor('dj_emma_liked_live', mix.id)
                          ? 'bg-rose-500/25 text-rose-300 border-rose-400/50'
                          : 'bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border-white/10'
                      }`}
                      title={isItemLikedByVisitor('dj_emma_liked_live', mix.id) ? 'Unlike mix' : 'Like this mix'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isItemLikedByVisitor('dj_emma_liked_live', mix.id) ? 'fill-rose-500 text-rose-400' : 'fill-rose-500/30 text-rose-400'}`} />
                      <span className="font-bold text-white">{mix.likesCount}</span>
                    </button>

                    <button
                      onClick={() => handleShare(mix)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                      title="Share mix"
                    >
                      {copiedId === mix.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

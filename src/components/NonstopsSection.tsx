import React, { useState } from 'react';
import { Play, Pause, Search, Music, Disc3, Heart, Calendar, PlusCircle, ListMusic, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { NonstopMix } from '../types';
import { useAudio } from '../context/AudioContext';
import { isItemLikedByVisitor } from '../lib/visitor';

interface NonstopsSectionProps {
  nonstops: NonstopMix[];
  isAdmin: boolean;
  onOpenUpload: () => void;
  onLikeNonstop: (id: string) => void;
  onOpenComments?: (id: string, type: 'nonstop', title: string) => void;
}

export const NonstopsSection: React.FC<NonstopsSectionProps> = ({
  nonstops,
  isAdmin,
  onOpenUpload,
  onLikeNonstop,
  onOpenComments,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTracklistId, setExpandedTracklistId] = useState<string | null>(null);

  const publishedNonstops = nonstops.filter((n) => n.isPublished);

  const filtered = publishedNonstops.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
      {/* Banner */}
      <div className="relative rounded-3xl glass-card border border-white/25 p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
              <Music className="w-3.5 h-3.5" />
              <span>UNINTERRUPTED PARTY SESSIONS • EXCLUSIVE NONSTOPS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black chrome-text font-display uppercase tracking-tight">
              NONSTOP MIXES
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Continuous, high-octane nonstop mixes curated with track-by-track transitions by DJ EMMA PRO. Separate collection dedicated strictly to marathon party sessions.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenUpload}
              className="self-start md:self-center px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 transition cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>UPLOAD NEW NONSTOP</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-slate-300">
            Total Sessions: {publishedNonstops.length}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            100% Non-Stop
          </span>
        </div>

        <div className="relative min-w-[260px] sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search nonstop mixes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full glass-card border border-white/20 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Nonstops List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl glass-card border border-white/15 p-12 text-center space-y-3">
          <Music className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-display">
            {publishedNonstops.length === 0 ? 'No Nonstops Published Yet' : 'No Nonstops Match Your Search'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {publishedNonstops.length === 0
              ? 'Real nonstop mixes and marathon party sessions by DJ EMMA PRO will appear here as soon as they are uploaded.'
              : 'Check back soon or adjust your search filter.'}
          </p>
          {isAdmin && publishedNonstops.length === 0 && (
            <button
              onClick={onOpenUpload}
              className="mt-2 px-5 py-2.5 rounded-full bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:scale-105 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>UPLOAD FIRST NONSTOP</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((nonstop) => {
            const isThisPlaying = currentTrack?.id === nonstop.id && isPlaying;
            const isExpanded = expandedTracklistId === nonstop.id;

            return (
              <div
                key={nonstop.id}
                className="group rounded-2xl glass-card overflow-hidden border border-white/20 hover:border-purple-400/60 transition-all duration-300 hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Artwork & Play button */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={nonstop.coverUrl}
                      alt={nonstop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <button
                      onClick={() => {
                        if (currentTrack?.id === nonstop.id) {
                          togglePlay();
                        } else {
                          playTrack(nonstop, 'nonstop');
                        }
                      }}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/95 hover:bg-white text-slate-950 flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer"
                      title={isThisPlaying ? 'Pause' : 'Play nonstop'}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-6 h-6 fill-slate-950" />
                      ) : (
                        <Play className="w-6 h-6 fill-slate-950 ml-1" />
                      )}
                    </button>

                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/40 backdrop-blur-md">
                      {nonstop.genre}
                    </span>

                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/80 text-white border border-white/10">
                      {nonstop.duration}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>{formatDate(nonstop.createdAt)}</span>
                      <span>•</span>
                      <span>THE WAKANDA BOSS</span>
                    </div>

                    <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition line-clamp-1 font-display">
                      {nonstop.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {nonstop.description}
                    </p>

                    {/* Tracklist Toggle */}
                    {nonstop.tracklist && nonstop.tracklist.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <button
                          onClick={() => setExpandedTracklistId(isExpanded ? null : nonstop.id)}
                          className="flex items-center justify-between w-full text-xs font-semibold text-purple-300 hover:text-white transition py-1 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <ListMusic className="w-4 h-4 text-purple-400" />
                            <span>Tracklist ({nonstop.tracklist.length} tracks)</span>
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 pl-2 space-y-1 text-[11px] text-slate-300 bg-black/30 p-2 rounded-lg border border-white/10 max-h-36 overflow-y-auto">
                            {nonstop.tracklist.map((tr, index) => (
                              <div key={index} className="truncate">
                                {tr}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-5 pb-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Disc3 className="w-4 h-4 text-purple-400 animate-spin" />
                    <span className="font-mono text-slate-300">{nonstop.playsCount} plays</span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => onOpenComments?.(nonstop.id, 'nonstop', nonstop.title)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-purple-300 border border-white/10 transition text-xs cursor-pointer"
                      title="View & post comments"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[11px]">Comments</span>
                    </button>

                    <button
                      onClick={() => onLikeNonstop(nonstop.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition active:scale-95 cursor-pointer ${
                        isItemLikedByVisitor('dj_emma_liked_nonstops', nonstop.id)
                          ? 'bg-rose-500/25 text-rose-300 border-rose-400/50'
                          : 'bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border-white/10'
                      }`}
                      title={isItemLikedByVisitor('dj_emma_liked_nonstops', nonstop.id) ? 'Unlike nonstop' : 'Like this nonstop'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isItemLikedByVisitor('dj_emma_liked_nonstops', nonstop.id) ? 'fill-rose-500 text-rose-400' : 'fill-rose-500/30 text-rose-400'}`} />
                      <span className="font-bold text-white">{nonstop.likesCount}</span>
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

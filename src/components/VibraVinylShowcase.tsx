import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Disc3,
  Heart,
  MessageSquare,
  ListMusic,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { NonstopMix } from '../types';
import { useAudio } from '../context/AudioContext';
import { isItemLikedByVisitor } from '../lib/visitor';

interface VibraVinylShowcaseProps {
  nonstops: NonstopMix[];
  onLikeNonstop: (id: string) => void;
  onOpenComments?: (id: string, type: 'live' | 'nonstop', title: string) => void;
  commentCounts?: Record<string, number>;
}

export const VibraVinylShowcase: React.FC<VibraVinylShowcaseProps> = ({
  nonstops,
  onLikeNonstop,
  onOpenComments,
  commentCounts = {},
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [selectedId, setSelectedId] = useState<string>(nonstops[0]?.id || '');
  const [showTracklist, setShowTracklist] = useState<boolean>(false);
  const [imgBroken, setImgBroken] = useState<Record<string, boolean>>({});

  // Sync selection if a nonstop starts playing or list updates
  useEffect(() => {
    if (
      currentTrack &&
      currentTrack.type === 'nonstop' &&
      nonstops.some((n) => n.id === currentTrack.id)
    ) {
      setSelectedId(currentTrack.id);
    } else if (!nonstops.some((n) => n.id === selectedId) && nonstops[0]) {
      setSelectedId(nonstops[0].id);
    }
  }, [currentTrack, nonstops, selectedId]);

  useEffect(() => {
    setShowTracklist(false);
  }, [selectedId]);

  if (nonstops.length === 0) return null;

  const activeNonstop = nonstops.find((n) => n.id === selectedId) || nonstops[0];
  const isSelectedPlaying = currentTrack?.id === activeNonstop.id && isPlaying;
  const isLiked = isItemLikedByVisitor('dj_emma_liked_nonstops', activeNonstop.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      {/* LEFT: VIBRA SIGNATURE SQUARE ALBUM SLEEVE + PEEKING VINYL RECORD */}
      <div className="lg:col-span-6 flex items-center justify-center py-2">
        <div className="relative flex items-center max-w-[440px] w-full pr-12 sm:pr-20">
          {/* Square Album Sleeve in Foreground */}
          <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 shrink-0 overflow-hidden bg-[#0a0a0e] border border-amber-400/45 shadow-[0_24px_55px_rgba(0,0,0,0.92)] group">
            {imgBroken[activeNonstop.id] || !activeNonstop.coverUrl ? (
              <div className="w-full h-full bg-gradient-to-br from-[#19150c] via-[#0c0c10] to-[#050507] flex flex-col items-center justify-center p-6 text-center">
                <Disc3 className="w-16 h-16 text-amber-400 mb-3" />
                <span className="font-vibra-display text-lg uppercase text-amber-200">
                  {activeNonstop.title}
                </span>
              </div>
            ) : (
              <img
                src={activeNonstop.coverUrl}
                alt={activeNonstop.title}
                referrerPolicy="no-referrer"
                onError={() =>
                  setImgBroken((prev) => ({ ...prev, [activeNonstop.id]: true }))
                }
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

            {/* Play/Pause Center Overlay Button */}
            <button
              onClick={() => {
                if (currentTrack?.id === activeNonstop.id) {
                  togglePlay();
                } else {
                  playTrack(activeNonstop, 'nonstop');
                }
              }}
              aria-label={isSelectedPlaying ? `Pause ${activeNonstop.title}` : `Play ${activeNonstop.title}`}
              className={`cursor-pointer absolute inset-0 m-auto w-14 h-14 rounded-full gold-btn flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 ${
                isSelectedPlaying ? 'ring-4 ring-amber-300/55' : ''
              }`}
            >
              {isSelectedPlaying ? (
                <Pause className="w-6 h-6 fill-black" />
              ) : (
                <Play className="w-6 h-6 fill-black ml-0.5" />
              )}
            </button>

            <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[10px] font-mono tabular-nums font-bold bg-black/85 text-amber-300 border border-amber-400/40">
              {activeNonstop.duration}
            </span>
          </div>

          {/* Grooved Obsidian & Metallic Gold Vinyl Record Disc Peeking Out */}
          <div
            aria-hidden="true"
            className={`relative z-0 -ml-28 sm:-ml-36 w-56 h-56 sm:w-72 sm:h-72 rounded-full vinyl-disc-grooves shrink-0 flex items-center justify-center transition-transform duration-500 ${
              isSelectedPlaying ? 'animate-vinyl-spin translate-x-3' : ''
            }`}
          >
            {/* Outer Gold Pin-stripe Ring */}
            <div className="absolute inset-4 rounded-full border border-amber-400/20 pointer-events-none" />
            <div className="absolute inset-10 rounded-full border border-amber-300/10 pointer-events-none" />

            {/* Vinyl Center Label with Album Cover */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400/70 shadow-inner bg-[#09090d]">
              {activeNonstop.coverUrl && !imgBroken[activeNonstop.id] ? (
                <img
                  src={activeNonstop.coverUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-500/20" />
              )}
              <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-[#050507] border border-amber-300/80" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: VIBRA EDITORIAL DETAILS + NUMBERED NONSTOP SESSIONS */}
      <div className="lg:col-span-6 space-y-5">
        <div className="space-y-2">
          <span className="block font-vibra-script text-xl text-amber-300">
            continuous edition · {activeNonstop.genre}
          </span>
          <h3 className="font-vibra-display text-2xl sm:text-4xl font-bold uppercase tracking-wide text-white leading-tight">
            {activeNonstop.title}
          </h3>
          {activeNonstop.description && (
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl whitespace-pre-line">
              {activeNonstop.description}
            </p>
          )}
        </div>

        {/* Active Nonstop Metrics & Interaction Strip */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 pb-3 border-b border-amber-500/20">
          <span className="flex items-center gap-1.5 font-mono tabular-nums text-amber-300">
            <Disc3 className={`w-4 h-4 ${isSelectedPlaying ? 'text-amber-300 animate-spin' : 'text-amber-500/80'}`} />
            {activeNonstop.playsCount} plays
          </span>

          <button
            onClick={() => onOpenComments?.(activeNonstop.id, 'nonstop', activeNonstop.title)}
            className="cursor-pointer flex items-center gap-1.5 text-neutral-300 hover:text-amber-300 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Comments {commentCounts[activeNonstop.id] ? `(${commentCounts[activeNonstop.id]})` : ''}
            </span>
          </button>

          <button
            onClick={() => onLikeNonstop(activeNonstop.id)}
            className={`cursor-pointer flex items-center gap-1.5 transition ${
              isLiked ? 'text-amber-300 font-bold' : 'text-neutral-300 hover:text-amber-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-amber-400 text-amber-400' : 'text-amber-400'}`} />
            <span className="tabular-nums">{activeNonstop.likesCount}</span>
          </button>

          {activeNonstop.tracklist && activeNonstop.tracklist.length > 0 && (
            <button
              onClick={() => setShowTracklist((prev) => !prev)}
              className="cursor-pointer flex items-center gap-1 text-amber-300 hover:text-amber-200 transition ml-auto"
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Tracklist ({activeNonstop.tracklist.length})</span>
              {showTracklist ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Optional Embedded Tracklist Drawer */}
        {showTracklist && activeNonstop.tracklist && activeNonstop.tracklist.length > 0 && (
          <div className="p-3 bg-[#0a0a0e] border border-amber-500/25 max-h-36 overflow-y-auto space-y-1 text-xs text-neutral-300">
            {activeNonstop.tracklist.map((tr, i) => (
              <div key={i} className="truncate">
                {tr}
              </div>
            ))}
          </div>
        )}

        {/* VIBRA NUMBERED SESSION ROWS (Switch or Play Any Published Nonstop) */}
        <div className="divide-y divide-white/[0.07]" aria-label="Published Nonstop Sessions">
          {nonstops.map((item, idx) => {
            const isItemSelected = item.id === activeNonstop.id;
            const isItemPlaying = currentTrack?.id === item.id && isPlaying;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`group flex items-center justify-between gap-4 py-3 px-2.5 cursor-pointer transition-colors ${
                  isItemSelected
                    ? 'bg-amber-400/[0.08] text-amber-300'
                    : 'hover:bg-white/[0.03] text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono tabular-nums text-xs text-amber-400/80 w-5 shrink-0">
                    {idx + 1}.
                  </span>
                  <span
                    className={`font-vibra-display text-xs sm:text-sm uppercase tracking-wider truncate ${
                      isItemSelected ? 'text-amber-300 font-bold' : 'text-white group-hover:text-amber-200'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono tabular-nums text-[11px] text-neutral-400">
                    {item.duration}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(item.id);
                      if (currentTrack?.id === item.id) {
                        togglePlay();
                      } else {
                        playTrack(item, 'nonstop');
                      }
                    }}
                    aria-label={isItemPlaying ? `Pause ${item.title}` : `Play ${item.title}`}
                    className="cursor-pointer w-7 h-7 flex items-center justify-center text-amber-300 hover:text-black hover:bg-amber-400 rounded-full transition"
                  >
                    {isItemPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

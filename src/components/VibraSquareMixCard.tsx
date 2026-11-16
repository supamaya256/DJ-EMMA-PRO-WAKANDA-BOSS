import React, { useState } from 'react';
import { Play, Pause, Disc3, Heart, MessageSquare, Share2, Check } from 'lucide-react';
import { LiveMix, NonstopMix } from '../types';
import { useAudio } from '../context/AudioContext';
import { isItemLikedByVisitor } from '../lib/visitor';

type MixItem = LiveMix | NonstopMix;

interface VibraSquareMixCardProps {
  mix: MixItem;
  trackType: 'live' | 'nonstop';
  onLike: (id: string) => void;
  onOpenComments?: (id: string, type: 'live' | 'nonstop', title: string) => void;
  commentCount?: number;
  staggerOffset?: boolean;
}

export const VibraSquareMixCard: React.FC<VibraSquareMixCardProps> = ({
  mix,
  trackType,
  onLike,
  onOpenComments,
  commentCount = 0,
  staggerOffset = false,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [copied, setCopied] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);

  const isThisPlaying = currentTrack?.id === mix.id && isPlaying;
  const likedStorageKey = trackType === 'live' ? 'dj_emma_liked_live' : 'dj_emma_liked_nonstops';
  const isLiked = isItemLikedByVisitor(likedStorageKey, mix.id);

  const handleShare = () => {
    const param = trackType === 'live' ? '?mix=' : '?nonstop=';
    const url = window.location.origin + param + mix.id;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className={`group flex flex-col transition-transform duration-500 ${
        staggerOffset ? 'lg:translate-y-8' : ''
      }`}
    >
      {/* VIBRA SIGNATURE: SQUARE ARTWORK + VERTICAL RIGHT-EDGE TYPOGRAPHY */}
      <div className="flex items-stretch gap-2.5 sm:gap-3">
        {/* Square Cover Frame */}
        <div
          className={`relative flex-1 aspect-square overflow-hidden bg-[#0b0b0f] border transition-all duration-300 shadow-[0_18px_40px_rgba(0,0,0,0.85)] ${
            isThisPlaying
              ? 'border-amber-400 shadow-[0_18px_45px_rgba(0,0,0,0.9),0_0_26px_rgba(212,175,55,0.35)]'
              : 'border-amber-500/25 group-hover:border-amber-400/75'
          }`}
        >
          {imgBroken || !mix.coverUrl ? (
            <div className="w-full h-full bg-gradient-to-br from-[#18150d] via-[#0b0b0f] to-[#050507] flex flex-col items-center justify-center p-4 text-center">
              <Disc3 className="w-12 h-12 text-amber-400/80 mb-2" />
              <span className="font-vibra-display text-sm uppercase tracking-wider text-amber-200 line-clamp-2">
                {mix.title}
              </span>
            </div>
          ) : (
            <img
              src={mix.coverUrl}
              alt={mix.title}
              referrerPolicy="no-referrer"
              onError={() => setImgBroken(true)}
              className="w-full h-full object-cover img-smooth-zoom"
            />
          )}

          {/* Measured Contrast Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none" />

          {/* Central Metallic-Gold Play / Pause Trigger */}
          <button
            onClick={() => {
              if (currentTrack?.id === mix.id) {
                togglePlay();
              } else {
                playTrack(mix, trackType);
              }
            }}
            aria-label={isThisPlaying ? `Pause ${mix.title}` : `Play ${mix.title}`}
            className={`cursor-pointer absolute inset-0 m-auto w-13 h-13 rounded-full gold-btn flex items-center justify-center shadow-2xl transition-all duration-200 ${
              isThisPlaying
                ? 'opacity-100 scale-100 ring-4 ring-amber-300/40'
                : 'opacity-90 sm:opacity-0 sm:group-hover:opacity-100 scale-95 group-hover:scale-100'
            }`}
          >
            {isThisPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>

          {/* Active Equalizer Indicator while Playing */}
          {isThisPlaying && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md">
              <div className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 h-2.5 bg-black eq-bar-1" />
                <span className="w-0.5 h-2.5 bg-black eq-bar-2" />
                <span className="w-0.5 h-2.5 bg-black eq-bar-3" />
              </div>
              <span>PLAYING</span>
            </div>
          )}

          {/* Clean Duration Corner Tag */}
          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-mono tabular-nums font-bold bg-black/80 text-amber-300 border border-amber-400/35">
            {mix.duration}
          </span>
        </div>

        {/* VIBRA VERTICAL ROTATED SIDE LABEL */}
        <div className="w-6 sm:w-7 flex flex-col items-center justify-end pb-1 shrink-0 select-none">
          <div className="vibra-vertical-label flex items-center gap-1.5 max-h-56 overflow-hidden">
            <span className="font-vibra-script text-[11px] text-amber-300/80 whitespace-nowrap">
              {mix.genre}
            </span>
            <span className="font-vibra-display text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-white group-hover:text-amber-300 transition-colors whitespace-nowrap truncate max-w-[160px]">
              {mix.title}
            </span>
          </div>
          <span className="text-[9px] text-amber-400 mt-1.5 leading-none" aria-hidden="true">
            ▾
          </span>
        </div>
      </div>

      {/* CLEAN EDITORIAL METADATA & ACTIONS DIRECTLY UNDER CARD */}
      <div className="mt-3.5 pr-8 space-y-2">
        <div>
          <h3 className="font-vibra-display text-base font-bold uppercase tracking-wide text-white group-hover:text-amber-300 transition truncate">
            {mix.title}
          </h3>
          {mix.description && (
            <p className="text-xs text-neutral-400 line-clamp-2 mt-0.5 leading-relaxed">
              {mix.description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-amber-500/15 flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5 font-mono tabular-nums text-[11px] text-amber-300/90">
            <Disc3 className={`w-3.5 h-3.5 ${isThisPlaying ? 'text-amber-300 animate-spin' : 'text-amber-500/80'}`} />
            {mix.playsCount} plays
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenComments?.(mix.id, trackType, mix.title)}
              className="cursor-pointer flex items-center gap-1 text-[11px] text-neutral-300 hover:text-amber-300 transition"
              title="Comments"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>{commentCount > 0 ? commentCount : 'Comment'}</span>
            </button>

            <button
              onClick={() => onLike(mix.id)}
              className={`cursor-pointer flex items-center gap-1 text-[11px] transition ${
                isLiked ? 'text-amber-300 font-bold' : 'text-neutral-300 hover:text-amber-300'
              }`}
              title={isLiked ? 'Unlike mix' : 'Like mix'}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isLiked ? 'fill-amber-400 text-amber-400' : 'text-amber-400/75'
                }`}
              />
              <span className="tabular-nums">{mix.likesCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="cursor-pointer text-neutral-400 hover:text-amber-300 transition"
              title="Share mix link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

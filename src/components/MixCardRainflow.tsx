import React, { useState } from 'react';
import {
  Play,
  Pause,
  Download,
  Heart,
  MessageSquare,
  Share2,
  Check,
  Disc3,
  ListMusic,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { LiveMix, NonstopMix } from '../types';
import { useAudio } from '../context/AudioContext';
import { isItemLikedByVisitor } from '../lib/visitor';

type MixItem = LiveMix | NonstopMix;

interface MixCardRainflowProps {
  mix: MixItem;
  trackType: 'live' | 'nonstop';
  onLike: (id: string) => void;
  onOpenComments?: (id: string, type: 'live' | 'nonstop', title: string) => void;
  commentCount?: number;
  showTracklist?: boolean;
}

export const MixCardRainflow: React.FC<MixCardRainflowProps> = ({
  mix,
  trackType,
  onLike,
  onOpenComments,
  commentCount = 0,
  showTracklist = false,
}) => {
  const { currentTrack, isPlaying, currentTime, duration, playTrack, togglePlay } = useAudio();
  const [copied, setCopied] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);
  const [isTracklistOpen, setIsTracklistOpen] = useState(false);

  const isCurrent = currentTrack?.id === mix.id;
  const isThisPlaying = isCurrent && isPlaying;
  const likedStorageKey = trackType === 'live' ? 'dj_emma_liked_live' : 'dj_emma_liked_nonstops';
  const isLiked = isItemLikedByVisitor(likedStorageKey, mix.id);

  const tracklist =
    showTracklist && 'tracklist' in mix && Array.isArray(mix.tracklist) ? mix.tracklist : [];

  const progressPct =
    isCurrent && duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handlePlayToggle = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(mix, trackType);
    }
  };

  const handleShare = () => {
    const param = trackType === 'live' ? '?mix=' : '?nonstop=';
    const url = window.location.origin + param + mix.id;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
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
    <article
      className={`group flex flex-col bg-[#16072b] border transition-all duration-300 overflow-hidden shadow-[0_18px_42px_rgba(4,1,14,0.85)] ${
        isThisPlaying
          ? 'border-[#ec1d64] shadow-[0_18px_48px_rgba(236,29,100,0.3)]'
          : 'border-[#ec1d64]/25 hover:border-[#ec1d64]/75'
      }`}
    >
      {/* Square Cover Visual Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0e041f]">
        {imgBroken || !mix.coverUrl ? (
          <div className="w-full h-full bg-gradient-to-br from-[#2d0c54] via-[#17062e] to-[#0e041f] flex flex-col items-center justify-center p-4 text-center">
            <Disc3 className="w-12 h-12 text-[#ec1d64] mb-2" />
            <span className="font-bold text-sm uppercase tracking-wide text-white line-clamp-2">
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

        <div className="absolute inset-0 bg-gradient-to-t from-[#120426] via-black/25 to-transparent opacity-85 pointer-events-none" />

        {/* Clean Duration Tag */}
        <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[11px] font-mono tabular-nums font-bold bg-black/80 text-pink-200 border border-[#ec1d64]/45">
          {mix.duration}
        </span>

        {/* Active Inline Play Trigger Overlay */}
        <button
          onClick={handlePlayToggle}
          aria-label={isThisPlaying ? `Pause ${mix.title}` : `Play ${mix.title}`}
          className={`cursor-pointer absolute bottom-3 left-3 px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
            isThisPlaying
              ? 'bg-[#ec1d64] text-white shadow-[0_0_20px_rgba(236,29,100,0.65)]'
              : 'bg-[#1c0833]/95 hover:bg-[#ec1d64] text-white border border-[#ec1d64]/60'
          }`}
        >
          {isThisPlaying ? (
            <>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-white eq-bar-1" />
                <span className="w-0.5 h-3 bg-white eq-bar-2" />
                <span className="w-0.5 h-3 bg-white eq-bar-3" />
              </div>
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>LISTEN</span>
            </>
          )}
        </button>
      </div>

      {/* Subtle Slim Inline Progress Strip ONLY while active */}
      {isCurrent && (
        <div className="w-full h-[3px] bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#00d4ff] via-[#8b5cf6] to-[#ec1d64] transition-[width] duration-200"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Content & Direct Download / Interactions */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-pink-300">
            <span>{mix.genre}</span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span className="text-purple-200/70">{formatDate(mix.createdAt)}</span>
          </div>

          <h3 className="font-bold text-lg text-white group-hover:text-pink-300 transition leading-snug line-clamp-2">
            {mix.title}
          </h3>

          {mix.description && (
            <p className="text-xs text-purple-100/75 leading-relaxed line-clamp-2">
              {mix.description}
            </p>
          )}
        </div>

        {/* Optional Expandable Tracklist for Nonstops */}
        {tracklist.length > 0 && (
          <div className="border-t border-white/10 pt-2.5">
            <button
              onClick={() => setIsTracklistOpen((prev) => !prev)}
              className="cursor-pointer flex items-center justify-between w-full text-xs font-semibold text-pink-300 hover:text-white transition"
            >
              <span className="flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5 text-[#ec1d64]" />
                <span>Tracklist ({tracklist.length})</span>
              </span>
              {isTracklistOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {isTracklistOpen && (
              <div className="mt-2 p-2.5 bg-black/40 border border-white/10 max-h-28 overflow-y-auto space-y-1 text-[11px] text-purple-100/80">
                {tracklist.map((tr, i) => (
                  <div key={i} className="truncate">
                    {tr}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer: Real Download + Plays + Like + Comment + Share */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 text-purple-200/80">
            <span className="font-mono tabular-nums text-[11px] text-pink-200">
              {mix.playsCount} plays
            </span>

            <button
              onClick={() => onLike(mix.id)}
              className={`cursor-pointer flex items-center gap-1 transition ${
                isLiked ? 'text-[#ff4f8d] font-bold' : 'text-purple-200 hover:text-pink-300'
              }`}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#ec1d64] text-[#ec1d64]' : ''}`} />
              <span className="tabular-nums">{mix.likesCount}</span>
            </button>

            <button
              onClick={() => onOpenComments?.(mix.id, trackType, mix.title)}
              className="cursor-pointer flex items-center gap-1 text-purple-200 hover:text-pink-300 transition"
              title="Comments"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="tabular-nums">{commentCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="cursor-pointer text-purple-200 hover:text-pink-300 transition"
              title="Share link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {mix.audioUrl && (
            <a
              href={`/.netlify/functions/download-audio?url=${encodeURIComponent(mix.audioUrl)}&title=${encodeURIComponent(mix.title)}`}
              download={`${mix.title.replace(/[^a-zA-Z0-9._-]/g, '_')}.mp3`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#230b47] hover:bg-[#ec1d64] text-white text-[11px] font-bold uppercase tracking-wider border border-[#ec1d64]/45 transition"
              title={`Download ${mix.title}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

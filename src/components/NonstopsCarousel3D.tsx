import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  Music,
  Radio,
  Disc3,
  Heart,
  Calendar,
  ListMusic,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Share2,
  Check,
  X,
} from 'lucide-react';
import { LiveMix, NonstopMix } from '../types';
import { useAudio } from '../context/AudioContext';
import { isItemLikedByVisitor } from '../lib/visitor';

type CarouselMixItem = LiveMix | NonstopMix;

interface NonstopsCarousel3DProps {
  nonstops?: NonstopMix[];
  items?: CarouselMixItem[];
  trackType?: 'live' | 'nonstop';
  onLikeNonstop?: (id: string) => void;
  onLikeItem?: (id: string) => void;
  onOpenComments?: (id: string, type: 'live' | 'nonstop', title: string) => void;
  commentCounts?: Record<string, number>;
  showTracklistInFocus?: boolean;
  showShareInFocus?: boolean;
}

export const NonstopsCarousel3D: React.FC<NonstopsCarousel3DProps> = ({
  nonstops,
  items,
  trackType = 'nonstop',
  onLikeNonstop,
  onLikeItem,
  onOpenComments,
  commentCounts = {},
  showTracklistInFocus = true,
  showShareInFocus,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const resolvedItems: CarouselMixItem[] = items ?? nonstops ?? [];
  const handleLike = onLikeItem ?? onLikeNonstop ?? (() => {});
  const likedStorageKey = trackType === 'live' ? 'dj_emma_liked_live' : 'dj_emma_liked_nonstops';
  const enableShare = showShareInFocus ?? trackType === 'live';

  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const angleRef = useRef<number>(0);
  const targetSnapAngleRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<number | null>(null);

  const [stageWidth, setStageWidth] = useState<number>(1024);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExpandedTracklist, setIsExpandedTracklist] = useState<boolean>(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [frontIndex, setFrontIndex] = useState<number>(0);

  const count = resolvedItems.length;
  const activeId = selectedId || hoveredId;
  const activeItem = activeId ? resolvedItems.find((n) => n.id === activeId) || null : null;

  // Reset broken/invalid selection cleanly if filtered items change
  useEffect(() => {
    if (selectedId && !resolvedItems.some((n) => n.id === selectedId)) {
      setSelectedId(null);
    }
    if (hoveredId && !resolvedItems.some((n) => n.id === hoveredId)) {
      setHoveredId(null);
    }
    setIsExpandedTracklist(false);
  }, [resolvedItems, selectedId, hoveredId]);

  useEffect(() => {
    setIsExpandedTracklist(false);
  }, [activeId]);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Measure responsive stage width cleanly with ResizeObserver
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateWidth = () => {
      if (el) setStageWidth(el.clientWidth || window.innerWidth);
    };
    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateWidth);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Observe viewport visibility: rotate ONLY when scrolled into view, pause when outside viewport
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsInView(entry.isIntersecting);
          if (!entry.isIntersecting) {
            setHoveredId(null);
            setSelectedId(null);
          }
        }
      },
      { threshold: 0.14 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Click/tap outside stage closes locked mobile/click selection cleanly
  useEffect(() => {
    if (!selectedId) return;
    const handleOutsidePointerDown = (e: PointerEvent) => {
      if (stageRef.current && !stageRef.current.contains(e.target as Node)) {
        setSelectedId(null);
        setHoveredId(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedId(null);
        setHoveredId(null);
      }
    };
    document.addEventListener('pointerdown', handleOutsidePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId]);

  // Responsive card sizing & 3D orbit geometry to guarantee zero overlap across desktop & mobile
  const isMobile = stageWidth < 640;
  const isTablet = stageWidth >= 640 && stageWidth < 1024;
  const cardWidth = isMobile
    ? Math.min(168, Math.max(132, Math.floor(stageWidth * 0.42)))
    : isTablet
      ? 206
      : 242;
  const stageHeight = isMobile ? 370 : isTablet ? 410 : 445;

  const rx = count <= 1 ? 0 : Math.max(76, (stageWidth - cardWidth) * 0.44);
  const ry = count <= 1 ? 0 : isMobile ? 30 : isTablet ? 44 : 56;
  const minScale = count > 7 ? 0.56 : 0.66;

  // Apply GPU-composited transforms directly onto card DOM elements (0 React re-renders per frame)
  const layoutCards = useCallback(
    (baseAngle: number) => {
      if (count === 0) return;

      let closestIdx = 0;
      let highestCos = -2;

      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const theta = count === 1 ? 0 : baseAngle + (i * Math.PI * 2) / count;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);

        if (cosT > highestCos) {
          highestCos = cosT;
          closestIdx = i;
        }

        const normDepth = (cosT + 1) * 0.5;
        const x = sinT * rx;
        const y = cosT * ry;
        const scale = count === 1 ? 1 : minScale + (1 - minScale) * normDepth;
        const rotateY = count === 1 ? 0 : -sinT * (isMobile ? 15 : 23);
        const baseOpacity = count === 1 ? 1 : 0.72 + 0.28 * normDepth;
        const finalOpacity = activeItem ? baseOpacity * 0.42 : baseOpacity;
        const zIndex = 10 + Math.round(normDepth * 40);

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) perspective(1000px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = finalOpacity.toFixed(3);
        el.style.zIndex = String(zIndex);
      }

      setFrontIndex((prev) => (prev !== closestIdx ? closestIdx : prev));
    },
    [count, rx, ry, minScale, isMobile, activeItem]
  );

  // Smoothly align background orbit toward an explicitly selected/stepped album (hover pauses cleanly in-place)
  useEffect(() => {
    if (!selectedId || count <= 1) {
      targetSnapAngleRef.current = null;
      return;
    }
    const idx = resolvedItems.findIndex((n) => n.id === selectedId);
    if (idx < 0) return;

    const desiredAngle = -((idx * Math.PI * 2) / count);
    const twoPi = Math.PI * 2;
    let diff = (desiredAngle - angleRef.current) % twoPi;
    if (diff > Math.PI) diff -= twoPi;
    if (diff < -Math.PI) diff += twoPi;
    targetSnapAngleRef.current = angleRef.current + diff;
  }, [selectedId, count, resolvedItems]);

  // Lightweight 60fps requestAnimationFrame loop (active ONLY when in viewport & unpaused or snapping)
  useEffect(() => {
    if (count === 0) return;

    layoutCards(angleRef.current);

    let rafId = 0;
    let lastTime = performance.now();
    const angularSpeed = (Math.PI * 2) / 21000;

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      const isPausedForUser = Boolean(activeId);

      if (isPausedForUser && targetSnapAngleRef.current !== null && !prefersReducedMotion) {
        const diff = targetSnapAngleRef.current - angleRef.current;
        if (Math.abs(diff) > 0.002) {
          angleRef.current += diff * Math.min(1, dt * 0.01);
          layoutCards(angleRef.current);
          rafId = window.requestAnimationFrame(tick);
        } else {
          angleRef.current = targetSnapAngleRef.current;
          targetSnapAngleRef.current = null;
          layoutCards(angleRef.current);
        }
        return;
      }

      if (!isInView || prefersReducedMotion || document.hidden || count <= 1 || isPausedForUser) {
        return;
      }

      angleRef.current += angularSpeed * dt;
      layoutCards(angleRef.current);
      rafId = window.requestAnimationFrame(tick);
    };

    const shouldRunLoop =
      (isInView && !prefersReducedMotion && count > 1 && !activeId) ||
      (Boolean(selectedId) && targetSnapAngleRef.current !== null && !prefersReducedMotion);

    if (shouldRunLoop) {
      rafId = window.requestAnimationFrame(tick);
    }

    const handleVisibility = () => {
      if (!document.hidden && isInView && !activeId && !prefersReducedMotion && count > 1) {
        lastTime = performance.now();
        window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(tick);
      } else if (document.hidden) {
        window.cancelAnimationFrame(rafId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [count, isInView, prefersReducedMotion, activeId, selectedId, layoutCards]);

  const cancelLeaveTimer = () => {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const scheduleClearHover = () => {
    cancelLeaveTimer();
    leaveTimerRef.current = window.setTimeout(() => {
      setHoveredId(null);
    }, 150);
  };

  useEffect(() => {
    return () => cancelLeaveTimer();
  }, []);

  const handleStep = (direction: -1 | 1) => {
    if (count === 0) return;
    const currentIdx = activeItem
      ? resolvedItems.findIndex((n) => n.id === activeItem.id)
      : frontIndex;
    const nextIdx = (currentIdx + direction + count) % count;
    const nextItem = resolvedItems[nextIdx];
    if (nextItem) {
      setSelectedId(nextItem.id);
      setHoveredId(null);
    }
  };

  const handleShare = (item: CarouselMixItem) => {
    const param = trackType === 'live' ? '?mix=' : '?nonstop=';
    const url = window.location.origin + param + item.id;
    navigator.clipboard?.writeText(url);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(null), 2000);
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

  if (count === 0) return null;

  const activeTracklist =
    activeItem && 'tracklist' in activeItem && Array.isArray(activeItem.tracklist)
      ? activeItem.tracklist
      : [];

  return (
    <div className="space-y-4">
      {/* 3D CIRCULAR STAGE */}
      <div
        ref={stageRef}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') {
            cancelLeaveTimer();
            setHoveredId(null);
            setSelectedId(null);
          }
        }}
        style={{ height: `${stageHeight}px` }}
        className="relative w-full rounded-3xl royal-glass-card electric-blue-glow border-2 border-amber-400/45 overflow-hidden select-none flex items-center justify-center"
        aria-label={trackType === 'live' ? '3D Live Mixes circular carousel' : '3D Nonstops circular carousel'}
      >
        {/* Subtle radial spotlight backdrop in royal-blue & gold */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 54%, rgba(56, 189, 248, 0.16) 0%, rgba(245, 158, 11, 0.08) 38%, rgba(4, 8, 22, 0.65) 75%)',
          }}
        />

        {/* Decorative subtle orbital ring guide */}
        {count > 1 && (
          <div
            aria-hidden="true"
            style={{
              width: `${Math.max(180, rx * 2 + cardWidth * 0.45)}px`,
              height: `${Math.max(60, ry * 2.1)}px`,
            }}
            className="absolute pointer-events-none rounded-full border border-sky-400/20 shadow-[0_0_30px_rgba(56,189,248,0.12)]"
          />
        )}

        {/* ALL MIX ALBUM COVERS POSITIONED AROUND 3D ORBIT */}
        <div className="relative w-full h-full flex items-center justify-center">
          {resolvedItems.map((item, index) => {
            const isThisPlaying = currentTrack?.id === item.id && isPlaying;
            const isFront = index === frontIndex && !activeItem;
            const isImgBroken = Boolean(brokenImages[item.id]);

            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') {
                    cancelLeaveTimer();
                    setHoveredId(item.id);
                  }
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === 'mouse') {
                    scheduleClearHover();
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  cancelLeaveTimer();
                  setSelectedId(item.id);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(item.id);
                  }
                }}
                aria-label={`Select ${trackType === 'live' ? 'live mix' : 'nonstop'} ${item.title}`}
                style={{ width: `${cardWidth}px` }}
                className={`absolute rounded-2xl overflow-hidden cursor-pointer transition-[border-color,box-shadow,opacity] duration-200 will-change-transform bg-[#060d22] border ${
                  isThisPlaying
                    ? 'border-sky-400 shadow-[0_0_26px_rgba(56,189,248,0.5),0_0_16px_rgba(245,158,11,0.35)]'
                    : isFront
                      ? 'border-amber-400/85 shadow-[0_14px_34px_rgba(0,0,0,0.85),0_0_22px_rgba(245,158,11,0.28)]'
                      : 'border-amber-400/35 shadow-[0_12px_28px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* Album Artwork */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#040816]">
                  {isImgBroken || !item.coverUrl ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#0c1d4c] via-[#060c20] to-amber-900/40 flex flex-col items-center justify-center p-3 text-center">
                      <Disc3 className="w-8 h-8 text-amber-300 mb-1" />
                      <span className="text-[11px] font-bold text-amber-200 line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      loading="eager"
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

                  {isThisPlaying && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-sky-500/95 text-slate-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow">
                      <div className="flex items-end gap-0.5 h-2.5">
                        <span className="w-0.5 h-2.5 bg-slate-950 eq-bar-1" />
                        <span className="w-0.5 h-2.5 bg-slate-950 eq-bar-2" />
                        <span className="w-0.5 h-2.5 bg-slate-950 eq-bar-3" />
                      </div>
                      <span>PLAYING</span>
                    </div>
                  )}

                  <span className="absolute bottom-1.5 right-2 text-[10px] font-mono font-bold text-amber-300 bg-black/75 px-1.5 py-0.5 rounded">
                    {item.duration}
                  </span>
                </div>

                {/* Compact Cover Footer */}
                <div className="px-3 py-2 bg-gradient-to-b from-[#091536] to-[#050a1a] border-t border-white/10">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 mt-0.5 font-mono">
                    <span className="text-sky-300 truncate max-w-[55%]">{item.genre}</span>
                    <span className="text-amber-300">{item.playsCount} plays</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ENLARGED FOREGROUND DISPLAY CARD (On Hover, Touch, or Select) */}
        {activeItem && (
          <div
            onPointerEnter={() => cancelLeaveTimer()}
            onPointerLeave={(e) => {
              if (e.pointerType === 'mouse') {
                scheduleClearHover();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="animate-carousel-focus-in absolute z-[60] inset-x-3 sm:inset-x-auto w-auto sm:w-full max-w-md max-h-[92%] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#0b193d]/98 via-[#07112b]/98 to-[#040917]/98 backdrop-blur-xl border-2 border-amber-400/85 shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_38px_rgba(56,189,248,0.35)]"
          >
            {/* Enlarged Album Artwork & Original Play Controls */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#040816]">
              {brokenImages[activeItem.id] || !activeItem.coverUrl ? (
                <div className="w-full h-full bg-gradient-to-br from-[#0c1d4c] via-[#060c20] to-amber-900/40 flex flex-col items-center justify-center p-4">
                  <Disc3 className="w-12 h-12 text-amber-300 mb-2" />
                  <span className="text-sm font-bold text-amber-200">{activeItem.title}</span>
                </div>
              ) : (
                <img
                  src={activeItem.coverUrl}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Existing Play / Pause Button (Never Autoplays) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentTrack?.id === activeItem.id) {
                    togglePlay();
                  } else {
                    playTrack(activeItem, trackType);
                  }
                }}
                className={`absolute inset-0 m-auto w-14 h-14 rounded-full gold-btn flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer ${
                  currentTrack?.id === activeItem.id && isPlaying ? 'ring-4 ring-sky-400/70' : ''
                }`}
                title={
                  currentTrack?.id === activeItem.id && isPlaying
                    ? `Pause ${trackType === 'live' ? 'mix' : 'nonstop'}`
                    : `Play ${trackType === 'live' ? 'mix' : 'nonstop'}`
                }
              >
                {currentTrack?.id === activeItem.id && isPlaying ? (
                  <Pause className="w-6 h-6 fill-slate-950" />
                ) : (
                  <Play className="w-6 h-6 fill-slate-950 ml-1" />
                )}
              </button>

              {/* Genre Tag */}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950/85 text-sky-200 border border-sky-400/40 backdrop-blur-md">
                {activeItem.genre}
              </span>

              {/* Return to Carousel Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(null);
                  setHoveredId(null);
                }}
                aria-label="Return album to carousel"
                title="Return to carousel"
                className="cursor-pointer absolute top-3 right-3 w-8 h-8 rounded-full bg-black/75 hover:bg-amber-400 text-white hover:text-slate-950 border border-white/25 flex items-center justify-center transition shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Duration */}
              <span className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/80 text-amber-300 border border-amber-400/40">
                {activeItem.duration}
              </span>
            </div>

            {/* Normal Enlarged Body Content */}
            <div className="p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>{formatDate(activeItem.createdAt)}</span>
                <span>·</span>
                <span className="text-amber-300 font-semibold">
                  {trackType === 'live' ? 'DJ EMMA PRO' : 'THE WAKANDA BOSS'}
                </span>
              </div>

              <h3 className="font-bold text-base sm:text-lg text-white font-display leading-snug">
                {activeItem.title}
              </h3>

              {activeItem.description && (
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line line-clamp-3">
                  {activeItem.description}
                </p>
              )}

              {/* Tracklist Toggle (when available) */}
              {showTracklistInFocus && activeTracklist.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpandedTracklist((prev) => !prev);
                    }}
                    className="flex items-center justify-between w-full text-xs font-semibold text-sky-300 hover:text-amber-300 transition py-1 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <ListMusic className="w-4 h-4 text-sky-400" />
                      <span>Tracklist ({activeTracklist.length} tracks)</span>
                    </span>
                    {isExpandedTracklist ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isExpandedTracklist && (
                    <div className="mt-1.5 pl-2 space-y-1 text-[11px] text-slate-300 bg-black/40 p-2 rounded-lg border border-white/10 max-h-28 overflow-y-auto">
                      {activeTracklist.map((tr, trIdx) => (
                        <div key={trIdx} className="truncate">
                          {tr}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Footer Controls: Plays, Comments, Likes, Optional Share */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 gap-2">
                <div className="flex items-center gap-1.5 font-mono text-amber-300">
                  <Disc3
                    className={`w-4 h-4 ${
                      currentTrack?.id === activeItem.id && isPlaying
                        ? 'text-sky-400 animate-spin'
                        : 'text-amber-400'
                    }`}
                  />
                  <span>{activeItem.playsCount} plays</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenComments?.(activeItem.id, trackType, activeItem.title);
                    }}
                    className="cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-200 hover:text-sky-300 border border-white/10 transition text-xs"
                    title="View & post comments"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[11px]">
                      Comments{' '}
                      {commentCounts[activeItem.id]
                        ? `(${commentCounts[activeItem.id]})`
                        : ''}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(activeItem.id);
                    }}
                    className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition active:scale-95 ${
                      isItemLikedByVisitor(likedStorageKey, activeItem.id)
                        ? 'bg-rose-500/25 text-rose-300 border-rose-400/50'
                        : 'bg-white/5 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border-white/10'
                    }`}
                    title={
                      isItemLikedByVisitor(likedStorageKey, activeItem.id)
                        ? 'Unlike'
                        : 'Like'
                    }
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isItemLikedByVisitor(likedStorageKey, activeItem.id)
                          ? 'fill-rose-500 text-rose-400'
                          : 'fill-rose-500/30 text-rose-400'
                      }`}
                    />
                    <span className="font-bold text-white">{activeItem.likesCount}</span>
                  </button>

                  {enableShare && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(activeItem);
                      }}
                      className="cursor-pointer p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
                      title="Share mix"
                    >
                      {copiedId === activeItem.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CLEAN INTERACTIVE CAROUSEL CONTROLS & ALBUM DOTS */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          {trackType === 'live' ? (
            <Radio className="w-4 h-4 text-sky-400 shrink-0" />
          ) : (
            <Music className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span>
            {count}{' '}
            {trackType === 'live'
              ? count === 1
                ? 'Live Mix'
                : 'Live Mixes'
              : count === 1
                ? 'Nonstop Session'
                : 'Nonstop Sessions'}
          </span>
          <span aria-hidden="true" className="text-amber-400">·</span>
          <span className="text-slate-400">
            {activeItem
              ? 'Paused on selected album'
              : 'Hover or tap any album cover to open player'}
          </span>
        </div>

        {count > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStep(-1)}
              aria-label={`Previous ${trackType === 'live' ? 'live mix' : 'nonstop'} album`}
              className="cursor-pointer w-8 h-8 rounded-full bg-white/5 hover:bg-sky-500/20 text-sky-300 border border-sky-400/35 flex items-center justify-center transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label={trackType === 'live' ? 'Live mix album selector' : 'Nonstop album selector'}
            >
              {resolvedItems.map((n, idx) => {
                const isActive = activeItem ? activeItem.id === n.id : idx === frontIndex;
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      setSelectedId(n.id);
                      setHoveredId(null);
                    }}
                    title={n.title}
                    aria-label={`Open ${n.title}`}
                    className={`cursor-pointer h-2 rounded-full transition-all ${
                      isActive
                        ? 'w-6 bg-gradient-to-r from-sky-400 to-amber-400 shadow-[0_0_10px_rgba(56,189,248,0.65)]'
                        : 'w-2 bg-white/25 hover:bg-amber-300/70'
                    }`}
                  />
                );
              })}
            </div>

            <button
              onClick={() => handleStep(1)}
              aria-label={`Next ${trackType === 'live' ? 'live mix' : 'nonstop'} album`}
              className="cursor-pointer w-8 h-8 rounded-full bg-white/5 hover:bg-sky-500/20 text-sky-300 border border-sky-400/35 flex items-center justify-center transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Music2, Radio, Download, X } from 'lucide-react';

export const GlobalAudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    closePlayer,
  } = useAudio();

  // If no track is selected or user closed the player, do not render anything
  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const h = Math.floor(m / 60);
    if (h > 0) {
      const remM = m % 60;
      return `${h}:${remM < 10 ? '0' : ''}${remM}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleSkip = (seconds: number) => {
    seek(Math.max(0, Math.min(duration || 0, currentTime + seconds)));
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <aside 
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#12141a]/95 backdrop-blur-xl border-t border-white/20 shadow-[0_-8px_32px_rgba(0,0,0,0.9)] select-none animate-in slide-in-from-bottom-2 duration-200"
      aria-label="DJ EMMA PRO Floating Audio Player"
    >
      {/* Top Slim Scrub / Progress Bar */}
      <div className="relative w-full h-1 sm:h-1.5 bg-white/10 hover:h-2 transition-all cursor-pointer overflow-hidden group">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 via-blue-400 to-amber-400 shadow-[0_0_12px_rgba(56,189,248,0.85)]"
          style={{ width: `${progressPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeekChange}
          aria-label="Seek track position"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Compact Main Player Content Row */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* LEFT: Compact Song Cover & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial max-w-[45%] sm:max-w-xs md:max-w-sm">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden shrink-0 border border-white/30 shadow-md bg-slate-900">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-0.5 sm:w-1 bg-sky-400 eq-bar-1 h-3.5" />
                  <span className="w-0.5 sm:w-1 bg-amber-400 eq-bar-2 h-3.5" />
                  <span className="w-0.5 sm:w-1 bg-sky-300 eq-bar-3 h-3.5" />
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {currentTrack.type === 'live' ? (
                  <>
                    <Radio className="w-2.5 h-2.5 mr-1 text-red-400 animate-pulse" />
                    LIVE
                  </>
                ) : (
                  <>
                    <Music2 className="w-2.5 h-2.5 mr-1 text-purple-300" />
                    NONSTOP
                  </>
                )}
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline truncate">
                {currentTrack.genre}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-sm mt-0.5" title={currentTrack.title}>
              {currentTrack.title}
            </h4>
          </div>
        </div>

        {/* CENTER: Compact Play/Pause & Skip Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => handleSkip(-10)}
            title="Rewind 10 seconds"
            className="p-1 sm:p-1.5 text-slate-300 hover:text-white transition active:scale-90 cursor-pointer"
            aria-label="Rewind 10 seconds"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-amber-300 to-yellow-500 text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition border cursor-pointer ${
              isPlaying ? 'border-sky-300 ring-2 ring-sky-400/50' : 'border-white/60'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-slate-950" />
            ) : (
              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            )}
          </button>

          <button
            onClick={() => handleSkip(10)}
            title="Forward 10 seconds"
            className="p-1 sm:p-1.5 text-slate-300 hover:text-white transition active:scale-90 cursor-pointer"
            aria-label="Forward 10 seconds"
          >
            <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Time Counter */}
          <div className="text-[10px] sm:text-xs text-slate-300 font-mono hidden xs:flex items-center gap-1 ml-1 sm:ml-2">
            <span className="text-white font-semibold">{formatTime(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span>{formatTime(duration || 0)}</span>
          </div>
        </div>

        {/* RIGHT: Volume Slider, Download & Functional Close (X) Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Volume Control on Desktop */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="text-slate-300 hover:text-white p-1 transition cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume slider"
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Download Mix Link */}
          {currentTrack.audioUrl && (
            <a
              href={`/.netlify/functions/download-audio?url=${encodeURIComponent(currentTrack.audioUrl)}&title=${encodeURIComponent(currentTrack.title)}`}
              download={`${currentTrack.title.replace(/[^a-zA-Z0-9._-]/g, '_')}.mp3`}
              title="Download Mix"
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition border border-white/10"
              aria-label="Download audio mix"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Functional Close (X) Button */}
          <button
            onClick={closePlayer}
            title="Close audio player and stop playback"
            aria-label="Close audio player"
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 flex items-center justify-center transition border border-white/10 hover:border-rose-400/30 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
};

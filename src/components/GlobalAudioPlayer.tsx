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
    pauseTrack,
  } = useAudio();

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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-auto">
      <div className="max-w-6xl mx-auto rounded-2xl glass-nav-bar p-3 sm:p-4 text-white shadow-2xl border border-white/20 relative backdrop-blur-xl">
        {/* Top Slim Progress Bar */}
        <div className="relative w-full h-1.5 bg-white/10 rounded-full mb-3 cursor-pointer overflow-hidden group">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-white shadow-[0_0_10px_#38bdf8]"
            style={{ width: `${progressPercent}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekChange}
            aria-label="Audio progress seek bar"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 max-w-[40%] sm:max-w-xs">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-white/30 shadow-md">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-4">
                    <span className="w-1 bg-cyan-400 animate-pulse h-2" />
                    <span className="w-1 bg-sky-300 animate-pulse h-4" />
                    <span className="w-1 bg-cyan-400 animate-pulse h-3" />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentTrack.type === 'live' ? (
                    <>
                      <Radio className="w-2.5 h-2.5 mr-1 animate-pulse text-red-400" /> LIVE MIX
                    </>
                  ) : (
                    <>
                      <Music2 className="w-2.5 h-2.5 mr-1 text-cyan-300" /> NONSTOP
                    </>
                  )}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate drop-shadow">
                {currentTrack.title}
              </h4>
              <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                DJ EMMA PRO • {currentTrack.genre}
              </p>
            </div>
          </div>

          {/* Central Controls */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => handleSkip(-10)}
                title="Rewind 10 seconds"
                className="text-slate-300 hover:text-white p-1 transition"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-white to-slate-200 text-slate-900 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition border border-white/60"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-slate-900" />
                ) : (
                  <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                )}
              </button>

              <button
                onClick={() => handleSkip(10)}
                title="Forward 10 seconds"
                className="text-slate-300 hover:text-white p-1 transition"
              >
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="text-[10px] sm:text-xs text-slate-300 font-mono flex items-center gap-1">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Right Volume & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-slate-300 hover:text-white p-1 transition"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="Volume control"
                className="w-16 lg:w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {currentTrack.audioUrl && (
              <a
                href={currentTrack.audioUrl}
                download
                target="_blank"
                rel="noreferrer"
                title="Download Mix"
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition border border-white/20"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={pauseTrack}
              title="Pause playback"
              className="text-slate-400 hover:text-white p-1 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { LiveMix, NonstopMix } from '../types';

export type CurrentTrack = (LiveMix | NonstopMix) & {
  type: 'live' | 'nonstop';
};

interface AudioContextType {
  currentTrack: CurrentTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (track: LiveMix | NonstopMix, type: 'live' | 'nonstop') => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: any) => {
      console.warn('Audio playback error (can happen if URL is invalid or blocked):', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const playTrack = async (track: LiveMix | NonstopMix, type: 'live' | 'nonstop') => {
    if (!audioRef.current) return;
    const trackWithMeta: CurrentTrack = { ...track, type };
    setCurrentTrack(trackWithMeta);

    try {
      audioRef.current.src = track.audioUrl;
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);

      // Trigger play count API in background
      const endpoint = type === 'live' ? `/api/mixes/${track.id}/play` : `/api/nonstops/${track.id}/play`;
      fetch(endpoint, { method: 'POST' }).catch(() => {});
    } catch (err) {
      console.warn('Audio autoplay prevented or file loading issue:', err);
      setIsPlaying(false);
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = async () => {
    if (audioRef.current && currentTrack) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Playback error:', err);
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clamped;
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playTrack,
        pauseTrack,
        resumeTrack,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

import React, { useState } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartClick = () => {
    setIsTransitioning(true);

    // Optional subtle futuristic chime
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Audio context might be restricted, proceed smoothly
    }

    // Smooth transition into Image 2
    setTimeout(() => {
      onStart();
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 w-full h-full bg-[#000824] flex items-center justify-center overflow-hidden transition-all duration-500 select-none z-50 ${
        isTransitioning ? 'opacity-0 scale-102 filter blur-sm pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 
        Container matching the exact 1672:941 (16:9) aspect ratio of Image 1.
        Preserves original proportions on phones, tablets, and desktop computers.
      */}
      <div className="relative w-full max-w-[1672px] aspect-[1672/941] max-h-screen">
        {/* Original pure Image 1 - UNCHANGED, NO DUPLICATE TEXT */}
        <img
          src="/assets/aistudio/file_00000000577482118275a24f7cbcec0a_37ac2a88.png"
          alt="DJ EMMA PRO - Start Screen"
          className="w-full h-full object-contain block pointer-events-none"
        />

        {/* 
          Transparent Clickable Button Overlay:
          Accurately positioned over the existing START button in the image:
          Horizontal: 19.5% to 80.5% (width 61%)
          Vertical: 70.0% to 94.5% (height 24.5%)
        */}
        <button
          onClick={handleStartClick}
          disabled={isTransitioning}
          className="absolute cursor-pointer rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400/50 hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
          style={{
            left: '19.5%',
            top: '70.0%',
            width: '61.0%',
            height: '24.5%',
          }}
          aria-label="START"
          title="START"
        />
      </div>
    </div>
  );
};

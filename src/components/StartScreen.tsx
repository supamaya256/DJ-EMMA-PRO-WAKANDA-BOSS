import React, { useState } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const SUPABASE_WELCOME_AUDIO_URL =
  'https://ruyediepdsvycrxniplt.supabase.co/storage/v1/object/public/DJ%20EMMA%20PRO/WELCOME.mp3';

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // PLAY WELCOMING VOICE AUDIO:
    // When anyone taps START, immediately play the welcoming voice from Supabase Storage
    try {
      const welcomeAudio = new Audio(SUPABASE_WELCOME_AUDIO_URL);
      welcomeAudio.volume = 1.0;

      // Automatic seamless fallback to local/proxy endpoint if Supabase bucket is private
      welcomeAudio.onerror = () => {
        console.warn('Direct Supabase welcome audio unreachable, switching to proxy fallback');
        welcomeAudio.src = '/api/welcome-audio';
        welcomeAudio.play().catch(() => {});
      };

      const playPromise = welcomeAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback error, trying proxy endpoint:', err);
          welcomeAudio.src = '/api/welcome-audio';
          welcomeAudio.play().catch(() => {});
        });
      }

      // Keep reference alive across page transitions so it plays into the main website
      (window as any).__djEmmaWelcomeVoice = welcomeAudio;
    } catch (err) {
      console.warn('Could not initialize welcome audio:', err);
    }

    // Smooth transition into Image 2 main website dashboard
    setTimeout(() => {
      onStart();
    }, 450);
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
          title="START - Tap to enter and play welcoming voice"
        />
      </div>
    </div>
  );
};

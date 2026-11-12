import React from 'react';

export const MainDashboardHeader: React.FC = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pt-3 sm:pt-5 pb-2 select-none overflow-hidden">
      {/* 
        PREMIUM HERO BANNER:
        Uses the exact uploaded DJ EMMA PRO portrait and blue-and-gold graphic banner.
        Preserves his entire head, hairstyle, 3D gold chrome lettering, and royal blue light rays.
        Never cropped, distorted, or recreated.
      */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-400/50 shadow-[0_10px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(245,158,11,0.25)] bg-[#070d1f]">
        <img
          src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.07.01_AM_d9477edb.jpeg"
          alt="DJ EMMA PRO - The Wakanda Boss"
          className="w-full h-auto object-contain block pointer-events-none"
        />

        {/* Subtle royal blue and gold bottom ambient glow line */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
      </div>
    </div>
  );
};

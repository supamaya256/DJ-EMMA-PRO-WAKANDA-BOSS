import React from 'react';
import { ActiveTab } from '../types';

interface MainDashboardHeaderProps {
  onNavigate?: (tab: ActiveTab) => void;
  tagline?: string;
}

export const MainDashboardHeader: React.FC<MainDashboardHeaderProps> = ({
  onNavigate,
  tagline = 'Ugandan DJ and creative professional from Serere District in the Teso Region, based in Kampala. Delivering electrifying club mixes, nonstop party tapes, graphic design, and signature DJ drops.',
}) => {
  return (
    <section
      className="relative w-full overflow-hidden rainflow-hero-sky pt-8 sm:pt-12 lg:pt-14 pb-0 select-none"
      aria-label="DJ EMMA PRO Official Hero"
    >
      {/* Atmospheric Concert Light Flares */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/3 w-[520px] h-[520px] rounded-full pointer-events-none blur-[110px] opacity-40"
        style={{ background: 'radial-gradient(circle, #ec1d64 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-1/4 w-[480px] h-[420px] rounded-full pointer-events-none blur-[120px] opacity-35"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
      />

      {/* Signature DJ Rainflow Neon-Magenta Frame Geometry + Artist Cutout */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-end gap-8 pt-6 lg:pt-10">
          {/* DJ Rainflow Thick Neon Magenta Geometric Outline Spanning Behind Left Content & Artist */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-0 right-0 top-14 sm:top-20 bottom-0 border-t-[7px] border-l-[7px] border-r-[7px] border-[#ec1d64] shadow-[0_0_38px_rgba(236,29,100,0.45),inset_0_0_24px_rgba(236,29,100,0.16)] pointer-events-none"
          />

          {/* LEFT: Editorial Typography Directly Matching DJ Rainflow Reference */}
          <div className="lg:col-span-6 relative z-20 px-2 sm:px-8 lg:pl-12 pb-12 sm:pb-16 lg:pb-20 pt-8 sm:pt-14 text-left space-y-4">
            {/* Pink / White Location & Identity Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-rainflow-condensed tracking-[0.18em] uppercase">
              <span className="text-[#ec1d64] font-bold">THE WAKANDA BOSS</span>
              <span className="text-white/90 font-semibold">· SERERE TO KAMPALA, UGANDA</span>
            </div>

            {/* Contrast Pair: Light Extended Intro + Massive Bold Display Headline */}
            <div className="space-y-1">
              <p className="font-display font-light text-2xl sm:text-4xl lg:text-[2.65rem] text-white/95 leading-tight tracking-tight">
                Ugandan DJ & Creative Professional
              </p>
              <h1 className="font-display font-black text-5xl sm:text-7xl xl:text-[5.25rem] text-white leading-[0.94] tracking-tight uppercase">
                DJ EMMA PRO
              </h1>
            </div>

            {/* Concise Artist Summary */}
            <p className="text-xs sm:text-sm text-purple-100/85 max-w-lg leading-relaxed pt-1">
              {tagline}
            </p>

            {/* DJ Rainflow Sharp Rectangular Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate?.('live-mixes')}
                className="cursor-pointer rainflow-btn-primary px-7 py-3.5 font-rainflow-condensed text-xs sm:text-sm font-bold uppercase tracking-[0.2em]"
              >
                LIVE MIXES
              </button>

              <button
                onClick={() => onNavigate?.('nonstops')}
                className="cursor-pointer gold-btn px-7 py-3.5 font-rainflow-condensed text-xs sm:text-sm font-bold uppercase tracking-[0.2em]"
              >
                NONSTOP MIXES
              </button>

              <button
                onClick={() => onNavigate?.('contact')}
                className="cursor-pointer px-6 py-3.5 bg-transparent hover:bg-white/10 text-white font-rainflow-condensed text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border border-white/30 transition"
              >
                BOOK NOW
              </button>
            </div>
          </div>

          {/* RIGHT: Large Prominent Uploaded DJ EMMA PRO Portrait (Unmodified Face & Cutout Silhouette) */}
          <div className="lg:col-span-6 relative z-20 flex justify-center lg:justify-end items-end">
            <div className="relative w-full max-w-[440px] sm:max-w-[500px] lg:max-w-[540px] flex justify-center items-end">
              {/* Atmospheric Backlight Behind Portrait */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-55 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(236, 29, 100, 0.55) 0%, rgba(56, 189, 248, 0.3) 50%, transparent 75%)',
                }}
              />
              <img
                src="/assets/aistudio/Serious_Young_Man_in_Thrasher_Shirt_717e5736.png"
                alt="DJ EMMA PRO - The Wakanda Boss"
                className="relative z-10 w-full h-auto max-h-[540px] sm:max-h-[610px] object-contain object-bottom drop-shadow-[0_18px_42px_rgba(0,0,0,0.85)] pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Fade Seam */}
      <div className="relative z-30 h-2 w-full bg-gradient-to-r from-[#0e041f] via-[#ec1d64] to-[#0e041f]" />
    </section>
  );
};

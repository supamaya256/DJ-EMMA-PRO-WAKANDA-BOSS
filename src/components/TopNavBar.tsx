import React from 'react';
import { Home, Play, Music, User, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';

interface TopNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isAdmin?: boolean;
  onOpenAdmin: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  onTabChange,
  isAdmin = false,
  onOpenAdmin,
}) => {
  const handleNavClick = (tab: ActiveTab) => {
    onTabChange(tab);
    // Smooth scroll into content area if scrolling through sections
    setTimeout(() => {
      const sectionEl = document.getElementById('dashboard-content-area');
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#13161c]/95 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.85)] transition-all">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 flex items-center justify-between gap-1 sm:gap-3">
        
        {/* LEFT: Brand Identity & DJ Portrait */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-1.5 sm:gap-2.5 group focus:outline-none shrink-0 cursor-pointer text-left"
          aria-label="DJ EMMA PRO Home"
          title="DJ EMMA PRO - The Wakanda Boss"
        >
          {/* Circular Metallic Profile Badge matching Image 2 */}
          <div className="relative w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden ring-1.5 sm:ring-2 ring-white/70 shadow-[0_0_12px_rgba(255,255,255,0.4)] group-hover:ring-white transition-all bg-[#1a1c23] shrink-0">
            <img
              src="/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png"
              alt="DJ EMMA PRO"
              className="w-[280%] h-[280%] max-w-none object-cover absolute -top-[25%] -left-[45%] pointer-events-none"
            />
          </div>

          {/* 3D Metallic Chrome Logo Text */}
          <div className="flex flex-col text-left leading-none">
            <span className="font-display font-black text-[11px] xs:text-xs sm:text-sm md:text-base tracking-tight sm:tracking-wider chrome-text whitespace-nowrap group-hover:brightness-110 transition">
              DJ EMMA<span className="hidden xs:inline"> PRO</span>
            </span>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-slate-300 tracking-widest uppercase opacity-75 whitespace-nowrap hidden lg:inline mt-0.5">
              THE WAKANDA BOSS
            </span>
          </div>
        </button>

        {/* CENTER / RIGHT: Sole Navigation Menu */}
        <nav
          className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0 py-0.5"
          aria-label="Main Navigation"
        >
          {/* 1. HOME BUTTON */}
          <button
            onClick={() => handleNavClick('home')}
            className={`cursor-pointer px-1.5 xs:px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all duration-300 whitespace-nowrap shrink-0 ${
              activeTab === 'home'
                ? 'glass-nav-active border border-white/70 text-white shadow-[0_0_15px_rgba(255,255,255,0.45)] font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 border border-transparent'
            }`}
            title="HOME"
          >
            <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0 text-white" />
            <span>HOME</span>
          </button>

          {/* 2. LIVE MIXES BUTTON */}
          <button
            onClick={() => handleNavClick('live-mixes')}
            className={`cursor-pointer px-1.5 xs:px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all duration-300 whitespace-nowrap shrink-0 ${
              activeTab === 'live-mixes'
                ? 'glass-nav-active border border-cyan-400/80 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.45)] font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 border border-transparent'
            }`}
            title="LIVE MIXES"
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0 fill-current text-cyan-400" />
            <span><span className="hidden sm:inline">LIVE </span>MIXES</span>
          </button>

          {/* 3. NONSTOPS BUTTON */}
          <button
            onClick={() => handleNavClick('nonstops')}
            className={`cursor-pointer px-1.5 xs:px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all duration-300 whitespace-nowrap shrink-0 ${
              activeTab === 'nonstops'
                ? 'glass-nav-active border border-purple-400/80 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.45)] font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 border border-transparent'
            }`}
            title="NONSTOPS"
          >
            <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0 text-purple-400" />
            <span>NONSTOPS</span>
          </button>

          {/* 4. ABOUT ME BUTTON */}
          <button
            onClick={() => handleNavClick('about-me')}
            className={`cursor-pointer px-1.5 xs:px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all duration-300 whitespace-nowrap shrink-0 ${
              activeTab === 'about-me'
                ? 'glass-nav-active border border-sky-400/80 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.45)] font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 border border-transparent'
            }`}
            title="ABOUT ME"
          >
            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0 text-sky-400" />
            <span><span className="hidden sm:inline">ABOUT </span>ME</span>
          </button>

          {/* Divider on larger screens */}
          <div className="h-4 w-px bg-white/20 hidden md:block shrink-0" />

          {/* 5. ADMIN / DJ ACCESS BUTTON */}
          <button
            onClick={onOpenAdmin}
            className={`cursor-pointer px-1.5 xs:px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold tracking-wider flex items-center gap-1 transition-all duration-300 whitespace-nowrap shrink-0 ${
              activeTab === 'admin'
                ? 'glass-nav-active border border-amber-400/80 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)] font-black'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 active:bg-amber-500/20 border border-amber-500/30'
            }`}
            title={isAdmin ? 'Admin Dashboard (Active)' : 'Admin Login'}
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="hidden md:inline">{isAdmin ? 'ADMIN' : 'LOGIN'}</span>
          </button>
        </nav>

      </div>
    </header>
  );
};

import React from 'react';
import { ActiveTab } from '../types';

interface MainDashboardHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAdminLogin: () => void;
}

export const MainDashboardHeader: React.FC<MainDashboardHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAdminLogin,
}) => {
  // Discreet triple-click or double-click counter on brand badge for DJ Admin Login
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<any>(null);

  const handleBrandClick = () => {
    onTabChange('home');
    clickCountRef.current += 1;
    clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdminLogin();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 700);
    }
  };

  const handleNavigate = (tab: ActiveTab) => {
    onTabChange(tab);
    // Smooth scroll down to the content section below the dashboard
    setTimeout(() => {
      const sectionEl = document.getElementById('dashboard-content-area');
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="relative w-full max-w-[1672px] mx-auto select-none">
      {/* 
        Container with exact 1672:941 aspect ratio matching Image 2.
        Preserves original proportions and ensures transparent button overlays
        remain 100% pixel-aligned on all screen sizes.
      */}
      <div className="relative w-full aspect-[1672/941] overflow-hidden shadow-2xl bg-[#2b2e35]">
        {/* Original pure Image 2 - UNCHANGED, NO DUPLICATE HEADINGS OR MENUS */}
        <img
          src="/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png"
          alt="DJ EMMA PRO - Main Dashboard"
          className="w-full h-full object-contain block pointer-events-none"
        />

        {/* 
          TRANSPARENT CLICKABLE HTML OVERLAYS:
          Positioned accurately over existing navigation words in the picture.
        */}

        {/* 1. Left Brand / Avatar Badge */}
        <button
          onClick={handleBrandClick}
          className="absolute cursor-pointer rounded-full bg-transparent hover:bg-white/[0.04] active:bg-white/[0.08] focus:outline-none transition-colors"
          style={{
            left: '1.2%',
            top: '1.2%',
            width: '32.0%',
            height: '11.0%',
          }}
          aria-label="DJ EMMA PRO Home"
          title="DJ EMMA PRO (Click 3x for Admin)"
        />

        {/* 2. "HOME" Word Overlay */}
        <button
          onClick={() => handleNavigate('home')}
          className={`absolute cursor-pointer rounded-full bg-transparent focus:outline-none transition-all duration-300 ${
            activeTab === 'home'
              ? 'ring-2 ring-white/40 bg-white/[0.05]'
              : 'hover:bg-white/[0.06] active:bg-white/[0.1]'
          }`}
          style={{
            left: '34.5%',
            top: '1.2%',
            width: '13.8%',
            height: '11.0%',
          }}
          aria-label="HOME"
          title="HOME"
        />

        {/* 3. "LIVE MIXES" Words Overlay */}
        <button
          onClick={() => handleNavigate('live-mixes')}
          className={`absolute cursor-pointer rounded-full bg-transparent focus:outline-none transition-all duration-300 ${
            activeTab === 'live-mixes'
              ? 'ring-2 ring-cyan-400/50 bg-cyan-400/[0.08]'
              : 'hover:bg-white/[0.06] active:bg-white/[0.1]'
          }`}
          style={{
            left: '49.5%',
            top: '1.2%',
            width: '14.5%',
            height: '11.0%',
          }}
          aria-label="LIVE MIXES"
          title="LIVE MIXES"
        />

        {/* 4. "NONSTOPS" Word Overlay */}
        <button
          onClick={() => handleNavigate('nonstops')}
          className={`absolute cursor-pointer rounded-full bg-transparent focus:outline-none transition-all duration-300 ${
            activeTab === 'nonstops'
              ? 'ring-2 ring-purple-400/50 bg-purple-400/[0.08]'
              : 'hover:bg-white/[0.06] active:bg-white/[0.1]'
          }`}
          style={{
            left: '65.0%',
            top: '1.2%',
            width: '15.0%',
            height: '11.0%',
          }}
          aria-label="NONSTOPS"
          title="NONSTOPS"
        />

        {/* 5. "ABOUT ME" Words Overlay */}
        <button
          onClick={() => handleNavigate('about-me')}
          className={`absolute cursor-pointer rounded-full bg-transparent focus:outline-none transition-all duration-300 ${
            activeTab === 'about-me'
              ? 'ring-2 ring-sky-400/50 bg-sky-400/[0.08]'
              : 'hover:bg-white/[0.06] active:bg-white/[0.1]'
          }`}
          style={{
            left: '81.0%',
            top: '1.2%',
            width: '16.0%',
            height: '11.0%',
          }}
          aria-label="ABOUT ME"
          title="ABOUT ME"
        />
      </div>
    </div>
  );
};

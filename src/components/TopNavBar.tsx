import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Instagram, Youtube, Facebook } from 'lucide-react';
import { ActiveTab, ArtistInfo } from '../types';

interface TopNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isAdmin?: boolean;
  onOpenAdmin: () => void;
  socialLinks?: ArtistInfo['socialLinks'];
}

const NAV_ITEMS: Array<{ id: ActiveTab; label: string }> = [
  { id: 'home', label: 'HOME' },
  { id: 'live-mixes', label: 'LIVE MIXES' },
  { id: 'nonstops', label: 'NONSTOP MIXES' },
  { id: 'news', label: 'NEWS' },
  { id: 'about-me', label: 'ABOUT ME' },
  { id: 'gallery', label: 'GALLERY' },
  { id: 'contact', label: 'CONTACT' },
];

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  onTabChange,
  isAdmin = false,
  onOpenAdmin,
  socialLinks,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: ActiveTab) => {
    setMobileMenuOpen(false);
    onTabChange(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full royal-nav-bar transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* LEFT: DJ Rainflow-Inspired Cyan-Purple-Magenta Monogram Brand Lockup */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex flex-col items-start leading-none focus:outline-none shrink-0 cursor-pointer group whitespace-nowrap"
          aria-label="DJ EMMA PRO Home"
        >
          <span className="font-display font-black text-2xl sm:text-3xl tracking-tight rainflow-logo-gradient group-hover:brightness-110 transition">
            DJ E
          </span>
          <span className="font-rainflow-condensed text-[9px] sm:text-[10px] tracking-[0.34em] text-purple-200/85 uppercase mt-0.5">
            EMMA PRO
          </span>
        </button>

        {/* CENTER: Clean Single-Line Navigation Menu (All 7 Requested Pages) */}
        <nav
          className="hidden lg:flex items-center gap-6 xl:gap-8"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`cursor-pointer py-2 font-rainflow-condensed text-xs xl:text-[13px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'royal-nav-active'
                    : 'text-white/90 hover:text-[#ff4785] border-b-2 border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Square Dark-Purple Social Buttons + Admin Login */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5">
            {socialLinks?.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="DJ EMMA PRO Instagram"
                className="w-9 h-9 bg-[#1b0833] hover:bg-[#ec1d64] text-white/90 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {socialLinks?.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="DJ EMMA PRO Facebook"
                className="w-9 h-9 bg-[#1b0833] hover:bg-[#ec1d64] text-white/90 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {socialLinks?.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="DJ EMMA PRO YouTube"
                className="w-9 h-9 bg-[#1b0833] hover:bg-[#ec1d64] text-white/90 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
          </div>

          <button
            onClick={onOpenAdmin}
            className={`cursor-pointer h-9 px-3 font-rainflow-condensed text-xs font-bold uppercase tracking-[0.14em] flex items-center gap-1.5 transition whitespace-nowrap shrink-0 border ${
              activeTab === 'admin'
                ? 'bg-[#ec1d64] text-white border-[#ff4f8d]'
                : 'bg-[#1b0833] hover:bg-[#ec1d64] text-pink-200 hover:text-white border-[#ec1d64]/45'
            }`}
            title={isAdmin ? 'Admin Dashboard (Active)' : 'Admin Login'}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">{isAdmin ? 'ADMIN' : 'LOGIN'}</span>
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden cursor-pointer w-9 h-9 bg-[#1b0833] border border-[#ec1d64]/45 text-white flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          className="lg:hidden bg-[#120426] border-t border-[#ec1d64]/30 px-4 py-4 flex flex-col gap-1"
          aria-label="Mobile Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`cursor-pointer w-full text-left px-3 py-2.5 font-rainflow-condensed text-sm uppercase tracking-[0.16em] transition ${
                  isActive
                    ? 'bg-[#ec1d64] text-white font-bold'
                    : 'text-purple-100 hover:bg-white/5 hover:text-pink-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};

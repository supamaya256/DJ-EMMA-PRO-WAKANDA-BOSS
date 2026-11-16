import React from 'react';
import { ShieldCheck, Instagram, Youtube, Facebook } from 'lucide-react';
import { ActiveTab, ArtistInfo } from '../types';
import { SnapchatIcon, TelegramIcon, resolveSocialLinks } from './SocialIcons';

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
  const socials = resolveSocialLinks(socialLinks);

  const handleNavClick = (tab: ActiveTab) => {
    onTabChange(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full royal-nav-bar transition-all">
      {/* Primary Brand + Desktop Nav + Socials/Login Row */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-10 h-14 sm:h-16 lg:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* LEFT: DJ Rainflow-Inspired Cyan-Purple-Magenta Monogram Brand Lockup */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex flex-col items-start leading-none focus:outline-none shrink-0 cursor-pointer group whitespace-nowrap"
          aria-label="DJ EMMA PRO Home"
        >
          <span className="font-display font-black text-lg sm:text-2xl lg:text-3xl tracking-tight rainflow-logo-gradient group-hover:brightness-110 transition">
            DJ E
          </span>
          <span className="font-rainflow-condensed text-[8px] sm:text-[10px] tracking-[0.28em] sm:tracking-[0.34em] text-purple-200/85 uppercase mt-0.5">
            EMMA PRO
          </span>
        </button>

        {/* DESKTOP CENTER: Clean Single-Line Navigation Menu (All 7 Requested Pages) */}
        <nav
          className="hidden lg:flex items-center gap-5 xl:gap-8"
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
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="DJ EMMA PRO Facebook"
                title="Facebook"
                className="w-7 h-7 sm:w-9 sm:h-9 bg-[#1b0833] hover:bg-[#ec1d64] text-white/90 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="DJ EMMA PRO Instagram"
                title="Instagram"
                className="w-7 h-7 sm:w-9 sm:h-9 bg-[#1b0833] hover:bg-[#ec1d64] text-white/90 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {socials.youtube && (
              <a
                href={socials.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="DJ EMMA PRO YouTube"
                title="YouTube"
                className="w-7 h-7 sm:w-9 sm:h-9 bg-[#1b0833] hover:bg-[#ec1d64] text-white/90 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {socials.snapchat && (
              <a
                href={socials.snapchat}
                target="_blank"
                rel="noreferrer"
                aria-label="DJ EMMA PRO Snapchat"
                title="Snapchat (emmapro257687)"
                className="w-7 h-7 sm:w-9 sm:h-9 bg-[#1b0833] hover:bg-[#ec1d64] text-white/90 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <SnapchatIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {socials.telegram && (
              <a
                href={socials.telegram}
                target="_blank"
                rel="noreferrer"
                aria-label="DJ EMMA PRO Telegram"
                title="Telegram (t.me/wakandadeejays)"
                className="w-7 h-7 sm:w-9 sm:h-9 bg-[#1b0833] hover:bg-[#ec1d64] text-white/90 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <TelegramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
          </div>

          <button
            onClick={onOpenAdmin}
            className={`cursor-pointer h-7 sm:h-9 px-2 sm:px-3 font-rainflow-condensed text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] flex items-center gap-1 sm:gap-1.5 transition whitespace-nowrap shrink-0 border ${
              activeTab === 'admin'
                ? 'bg-[#ec1d64] text-white border-[#ff4f8d]'
                : 'bg-[#1b0833] hover:bg-[#ec1d64] text-pink-200 hover:text-white border-[#ec1d64]/45'
            }`}
            title={isAdmin ? 'Admin Dashboard (Active)' : 'Admin Login'}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{isAdmin ? 'ADMIN' : 'LOGIN'}</span>
          </button>
        </div>
      </div>

      {/* PHONE & TABLET: Always-Visible Top Navigation Bar (All 7 Links Visible Without Hamburger or Clipping) */}
      <nav
        className="lg:hidden w-full bg-[#120426]/95 border-t border-[#ec1d64]/25 px-2.5 sm:px-4 py-1.5"
        aria-label="Mobile Navigation"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-3.5 sm:gap-x-5 gap-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`cursor-pointer py-1 px-0.5 font-rainflow-condensed text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'royal-nav-active'
                    : 'text-purple-100/90 hover:text-[#ff4785] border-b-2 border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

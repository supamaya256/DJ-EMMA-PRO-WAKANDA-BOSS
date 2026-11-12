import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdSenseBannerSlotProps {
  slotName?: string;
  format?: 'leaderboard' | 'responsive' | 'rectangle';
  className?: string;
}

export const AdSenseBannerSlot: React.FC<AdSenseBannerSlotProps> = ({
  slotName = 'DJ Emma Pro Sponsored Partner',
  format = 'responsive',
  className = '',
}) => {
  return (
    <div className={`w-full max-w-7xl mx-auto my-6 px-4 ${className}`}>
      <div className="relative rounded-2xl overflow-hidden royal-glass-card border border-amber-400/30 p-4 sm:p-6 text-center space-y-2.5">
        
        {/* Ad Disclosure Label (Mandatory for Google AdSense Publisher Compliance) */}
        <div className="flex items-center justify-between text-[10px] text-amber-400/80 font-bold uppercase tracking-widest border-b border-white/10 pb-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>ADVERTISEMENT • SPONSORED CONTENT</span>
          </span>
          <span className="text-slate-400 font-mono text-[9px]">Google AdSense Ready</span>
        </div>

        {/* Ad Slot Container */}
        <div className="min-h-[90px] sm:min-h-[110px] flex flex-col items-center justify-center p-4 rounded-xl bg-[#060b19]/60 border border-dashed border-amber-400/20 text-slate-300 space-y-1">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
            {slotName}
          </span>
          <p className="text-[11px] text-slate-400 max-w-md">
            Support DJ EMMA PRO – High-quality curated entertainment, Afrobeats event tickets, and certified audio gear promotions.
          </p>
          <span className="text-[10px] text-amber-300/70 font-mono">
            Clean, family-friendly display advertising compliant with Google Publisher Policies
          </span>
        </div>

        <div className="text-[9px] text-slate-500 text-right">
          Ads served by Google or verified sponsors • <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Ad Choices</a>
        </div>
      </div>
    </div>
  );
};

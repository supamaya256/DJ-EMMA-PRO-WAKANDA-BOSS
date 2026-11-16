import React from 'react';

interface AdSenseBannerSlotProps {
  slotName?: string;
}

export const AdSenseBannerSlot: React.FC<AdSenseBannerSlotProps> = ({
  slotName = 'Sponsor Spotlight',
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 my-6">
      <div className="w-full min-h-[84px] rounded-sm bg-[#16072b]/85 border border-[#ec1d64]/20 flex flex-col items-center justify-center p-4 text-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-pink-300/65 font-semibold mb-1">
          ADVERTISEMENT · {slotName}
        </span>
        <div className="w-full max-w-3xl h-10 bg-black/25 border border-white/5 flex items-center justify-center text-xs text-purple-200/45 font-mono">
          Google AdSense Auto-Placement Ready
        </div>
      </div>
    </div>
  );
};

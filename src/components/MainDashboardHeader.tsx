import React from 'react';

export const MainDashboardHeader: React.FC = () => {
  return (
    <div className="relative w-full max-w-[1672px] mx-auto select-none overflow-hidden">
      {/* 
        HERO BANNER: PRESERVES ORIGINAL DJ EMMA PRO IMAGE, PHOTOGRAPH, 
        CHROME 3D LETTERING, BACKGROUND AND SILVER METALLIC WAVES.
        
        The duplicate lower navigation bar has been completely removed
        by cropping the top duplicate bar area, leaving only the real 
        upper sticky navigation bar as the sole menu on the website.
        No empty spaces are left behind.
      */}
      <div className="relative w-full aspect-[1672/815] overflow-hidden bg-[#24272e] shadow-2xl">
        <img
          src="/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png"
          alt="DJ EMMA PRO - The Wakanda Boss"
          className="w-full h-auto object-cover block pointer-events-none -mt-[12.8%]"
        />
      </div>
    </div>
  );
};

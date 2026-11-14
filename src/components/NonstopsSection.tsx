import React, { useState } from 'react';
import { Search, Music, PlusCircle } from 'lucide-react';
import { NonstopMix } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { NonstopsCarousel3D } from './NonstopsCarousel3D';

interface NonstopsSectionProps {
  nonstops: NonstopMix[];
  isAdmin: boolean;
  onOpenUpload: () => void;
  onLikeNonstop: (id: string) => void;
  onOpenComments?: (id: string, type: 'live' | 'nonstop', title: string) => void;
  commentCounts?: Record<string, number>;
}

export const NonstopsSection: React.FC<NonstopsSectionProps> = ({
  nonstops,
  isAdmin,
  onOpenUpload,
  onLikeNonstop,
  onOpenComments,
  commentCounts = {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const publishedNonstops = nonstops.filter((n) => n.isPublished);

  const filtered = publishedNonstops.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="w-full text-white pb-28 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Banner */}
      <ScrollReveal>
        <div className="relative rounded-3xl royal-glass-card electric-gold-shimmer electric-blue-glow border-2 border-amber-400/50 p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/40 text-xs font-bold uppercase tracking-wider">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>UNINTERRUPTED PARTY SESSIONS • EXCLUSIVE NONSTOPS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black gold-chrome-text font-display uppercase tracking-tight">
                NONSTOP MIXES
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
                Continuous, high-octane nonstop mixes curated with track-by-track transitions by DJ EMMA PRO. Separate collection dedicated strictly to marathon party sessions.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={onOpenUpload}
                className="self-start md:self-center px-6 py-3.5 rounded-full gold-btn font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                <span>UPLOAD NEW NONSTOP</span>
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="font-semibold text-amber-300">
            Total Sessions: {publishedNonstops.length}
          </span>
          <span aria-hidden="true" className="text-sky-400">·</span>
          <span className="text-sky-300 font-semibold">100% Non-Stop</span>
        </div>

        <div className="relative min-w-[260px] sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search nonstop mixes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full glass-card border border-white/20 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {/* 3D Interactive Circular Nonstops Gallery or Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl glass-card border border-white/15 p-12 text-center space-y-3">
          <Music className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-display">
            {publishedNonstops.length === 0 ? 'No Nonstops Published Yet' : 'No Nonstops Match Your Search'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {publishedNonstops.length === 0
              ? 'Real nonstop mixes and marathon party sessions by DJ EMMA PRO will appear here as soon as they are uploaded.'
              : 'Check back soon or adjust your search filter.'}
          </p>
          {isAdmin && publishedNonstops.length === 0 && (
            <button
              onClick={onOpenUpload}
              className="mt-2 px-5 py-2.5 rounded-full gold-btn text-slate-950 font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:scale-105 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>UPLOAD FIRST NONSTOP</span>
            </button>
          )}
        </div>
      ) : (
        <NonstopsCarousel3D
          nonstops={filtered}
          onLikeNonstop={onLikeNonstop}
          onOpenComments={onOpenComments}
          commentCounts={commentCounts}
          showTracklistInFocus={true}
        />
      )}
    </div>
  );
};

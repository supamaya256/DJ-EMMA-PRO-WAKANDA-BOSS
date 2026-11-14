import React, { useState } from 'react';
import { Search, Radio, PlusCircle } from 'lucide-react';
import { LiveMix } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { NonstopsCarousel3D } from './NonstopsCarousel3D';

interface LiveMixesSectionProps {
  mixes: LiveMix[];
  isAdmin: boolean;
  onOpenUpload: () => void;
  onLikeMix: (id: string) => void;
  onOpenComments?: (id: string, type: 'live' | 'nonstop', title: string) => void;
  commentCounts?: Record<string, number>;
}

export const LiveMixesSection: React.FC<LiveMixesSectionProps> = ({
  mixes,
  isAdmin,
  onOpenUpload,
  onLikeMix,
  onOpenComments,
  commentCounts = {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');

  const publishedMixes = mixes.filter((m) => m.isPublished);

  // Extract unique genres
  const genres = ['ALL', ...Array.from(new Set(publishedMixes.map((m) => m.genre || 'Afrobeats')))];

  const filteredMixes = publishedMixes.filter((mix) => {
    const matchesSearch =
      mix.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mix.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mix.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'ALL' || mix.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="w-full text-white pb-28 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <ScrollReveal>
        <div className="relative rounded-3xl royal-glass-card electric-gold-shimmer electric-blue-glow border-2 border-amber-400/50 p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/40 text-xs font-bold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFICIAL LIVE SETS & CLUB ANTHEMS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black gold-chrome-text font-display uppercase tracking-tight">
                LIVE MIXES
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
                Stream live club performances, stage mixes, and high-energy party tapes recorded live by DJ EMMA PRO – THE WAKANDA BOSS.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={onOpenUpload}
                className="self-start md:self-center px-6 py-3.5 rounded-full gold-btn font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                <span>UPLOAD NEW LIVE MIX</span>
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        {/* Genre Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedGenre === g
                  ? 'royal-nav-active border border-amber-400/80 font-black shadow-md'
                  : 'royal-glass-card text-slate-300 hover:text-white border border-white/10 hover:border-amber-400/40'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search live mixes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full glass-card border border-white/20 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {/* 3D Interactive Circular Live Mixes Gallery or Empty State */}
      {filteredMixes.length === 0 ? (
        <div className="rounded-2xl glass-card border border-white/15 p-12 text-center space-y-3">
          <Radio className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-display">
            {publishedMixes.length === 0 ? 'No Live Mixes Published Yet' : 'No Live Mixes Match Your Search'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {publishedMixes.length === 0
              ? 'Real live club sets, festival sessions, and DJ tapes will appear here as soon as they are uploaded.'
              : 'Try clearing your search query or selecting ALL genres.'}
          </p>
          {isAdmin && publishedMixes.length === 0 && (
            <button
              onClick={onOpenUpload}
              className="mt-2 px-5 py-2.5 rounded-full gold-btn text-slate-950 font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:scale-105 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>UPLOAD FIRST LIVE MIX</span>
            </button>
          )}
        </div>
      ) : (
        <NonstopsCarousel3D
          trackType="live"
          items={filteredMixes}
          onLikeItem={onLikeMix}
          onOpenComments={onOpenComments}
          commentCounts={commentCounts}
          showTracklistInFocus={false}
          showShareInFocus={true}
        />
      )}
    </div>
  );
};

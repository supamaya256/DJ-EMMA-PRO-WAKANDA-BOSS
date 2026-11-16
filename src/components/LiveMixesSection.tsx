import React, { useState } from 'react';
import { Search, Radio, PlusCircle } from 'lucide-react';
import { LiveMix } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { MixCardRainflow } from './MixCardRainflow';

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
    <div className="w-full text-white pb-24 pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="bg-[#16072b] border-l-4 border-[#ec1d64] border-y border-r border-white/10 p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.22em] text-[#ec1d64]">
                OFFICIAL LIVE SETS & CLUB ANTHEMS
              </span>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                LIVE MIXES
              </h1>
              <p className="text-purple-100/80 text-sm sm:text-base max-w-2xl">
                Stream and download live club performances, festival sets, and high-energy mixes recorded by DJ EMMA PRO – THE WAKANDA BOSS.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={onOpenUpload}
                className="self-start md:self-center px-6 py-3.5 gold-btn font-rainflow-condensed font-bold text-xs uppercase tracking-[0.18em] flex items-center gap-2 shadow-xl cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>UPLOAD NEW LIVE MIX</span>
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-2 font-rainflow-condensed text-xs font-bold uppercase tracking-[0.14em] whitespace-nowrap transition cursor-pointer ${
                selectedGenre === g
                  ? 'bg-[#ec1d64] text-white'
                  : 'bg-[#16072b] text-purple-200 hover:text-white border border-white/15 hover:border-[#ec1d64]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px] sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300" />
          <input
            type="text"
            placeholder="Search live mixes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#16072b] border border-[#ec1d64]/35 text-xs sm:text-sm text-white placeholder-purple-300/50 focus:outline-none focus:border-[#ec1d64]"
          />
        </div>
      </div>

      {/* Live Mixes Grid */}
      {filteredMixes.length === 0 ? (
        <div className="bg-[#16072b] border border-white/10 p-12 text-center space-y-3">
          <Radio className="w-12 h-12 text-[#ec1d64]/60 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            {publishedMixes.length === 0 ? 'No Live Mixes Published Yet' : 'No Live Mixes Match Your Search'}
          </h3>
          <p className="text-xs text-purple-200/75 max-w-md mx-auto">
            {publishedMixes.length === 0
              ? 'Real live club sets and DJ mixes will appear here as soon as they are uploaded.'
              : 'Try clearing your search query or selecting ALL genres.'}
          </p>
          {isAdmin && publishedMixes.length === 0 && (
            <button
              onClick={onOpenUpload}
              className="mt-2 px-5 py-2.5 gold-btn text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>UPLOAD FIRST LIVE MIX</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMixes.map((mix) => (
            <MixCardRainflow
              key={mix.id}
              mix={mix}
              trackType="live"
              onLike={onLikeMix}
              onOpenComments={onOpenComments}
              commentCount={commentCounts[mix.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

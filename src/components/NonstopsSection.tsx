import React, { useState } from 'react';
import { Search, Music, PlusCircle } from 'lucide-react';
import { NonstopMix } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { MixCardRainflow } from './MixCardRainflow';

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
    <div className="w-full text-white pb-24 pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="bg-[#16072b] border-l-4 border-[#ec1d64] border-y border-r border-white/10 p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.22em] text-[#ec1d64]">
                UNINTERRUPTED MARATHON PARTY SESSIONS
              </span>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                NONSTOP MIXES
              </h1>
              <p className="text-purple-100/80 text-sm sm:text-base max-w-2xl">
                Continuous nonstop mixes curated with seamless transitions and full tracklists by DJ EMMA PRO.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={onOpenUpload}
                className="self-start md:self-center px-6 py-3.5 gold-btn font-rainflow-condensed font-bold text-xs uppercase tracking-[0.18em] flex items-center gap-2 shadow-xl cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>UPLOAD NEW NONSTOP</span>
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-2 text-xs text-purple-200">
          <span className="font-semibold text-pink-300">
            Total Sessions: {publishedNonstops.length}
          </span>
          <span aria-hidden="true" className="text-[#ec1d64]">·</span>
          <span>100% Continuous Mixing</span>
        </div>

        <div className="relative min-w-[260px] sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300" />
          <input
            type="text"
            placeholder="Search nonstop mixes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#16072b] border border-[#ec1d64]/35 text-xs sm:text-sm text-white placeholder-purple-300/50 focus:outline-none focus:border-[#ec1d64]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#16072b] border border-white/10 p-12 text-center space-y-3">
          <Music className="w-12 h-12 text-[#ec1d64]/60 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            {publishedNonstops.length === 0 ? 'No Nonstops Published Yet' : 'No Nonstops Match Your Search'}
          </h3>
          <p className="text-xs text-purple-200/75 max-w-md mx-auto">
            {publishedNonstops.length === 0
              ? 'Real nonstop mixes by DJ EMMA PRO will appear here as soon as they are uploaded.'
              : 'Check back soon or adjust your search filter.'}
          </p>
          {isAdmin && publishedNonstops.length === 0 && (
            <button
              onClick={onOpenUpload}
              className="mt-2 px-5 py-2.5 gold-btn text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>UPLOAD FIRST NONSTOP</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <MixCardRainflow
              key={item.id}
              mix={item}
              trackType="nonstop"
              onLike={onLikeNonstop}
              onOpenComments={onOpenComments}
              commentCount={commentCounts[item.id] || 0}
              showTracklist={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Newspaper,
  Calendar,
  Heart,
  MessageSquare,
  Share2,
  ArrowRight,
  X,
  Image as ImageIcon,
  Zap,
  Search,
} from 'lucide-react';
import { NewsPost } from '../types';
import { isItemLikedByVisitor } from '../lib/visitor';
import { ScrollReveal } from './ScrollReveal';

interface NewsSectionProps {
  newsPosts: NewsPost[];
  onLikeNews: (id: string) => void;
  onOpenComments?: (id: string, type: 'news' | 'live' | 'nonstop', title: string) => void;
  commentCounts?: Record<string, number>;
  isLoadingContent?: boolean;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  newsPosts,
  onLikeNews,
  onOpenComments,
  commentCounts = {},
  isLoadingContent = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const publishedNews = newsPosts.filter((p) => p.isPublished);
  const filteredNews = publishedNews.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (post: NewsPost) => {
    const url = window.location.origin + '?news=' + post.id;
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.content.slice(0, 100), url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setCopiedId(post.id);
      window.setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="w-full text-white pb-24 pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Banner */}
      <ScrollReveal>
        <div className="relative bg-[#16072b] border-l-4 border-[#ec1d64] border-y border-r border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.22em] text-[#ec1d64]">
                OFFICIAL ANNOUNCEMENTS & TOUR UPDATES
              </span>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                LATEST NEWS
              </h1>
              <p className="text-sm text-purple-100/80 max-w-2xl">
                Official announcements, upcoming performances, releases, and entertainment news from DJ EMMA PRO – THE WAKANDA BOSS.
              </p>
            </div>

            <div className="relative min-w-[260px] sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300" />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0e041f] border border-[#ec1d64]/35 text-xs sm:text-sm text-white placeholder-purple-300/50 focus:outline-none focus:border-[#ec1d64]"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Moving Live Ticker */}
      {publishedNews.length > 0 && (
        <div className="news-ticker-wrapper relative bg-[#16072b] border border-[#ec1d64]/40 overflow-hidden flex items-center">
          <div className="relative z-10 px-4 py-2.5 bg-[#ec1d64] text-white font-rainflow-condensed font-bold text-xs uppercase tracking-[0.18em] flex items-center gap-1.5 shrink-0">
            <Zap className="w-3.5 h-3.5" />
            <span>BREAKING UPDATES</span>
          </div>
          <div className="flex-1 overflow-hidden py-2">
            <div className="news-ticker-track">
              {[...publishedNews, ...publishedNews].map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => setSelectedPost(item)}
                  className="cursor-pointer inline-flex items-center gap-2.5 px-5 text-xs sm:text-sm text-purple-100 hover:text-pink-300 transition whitespace-nowrap"
                >
                  <span className="text-[11px] font-mono text-pink-300 font-bold">
                    {formatDate(item.createdAt)}
                  </span>
                  <span className="font-bold text-white">{item.title}</span>
                  <span className="text-[#ec1d64] pl-2" aria-hidden="true">◆</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {isLoadingContent && publishedNews.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-96 bg-[#16072b] border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="bg-[#16072b] border border-white/10 p-12 text-center space-y-2">
          <Newspaper className="w-10 h-10 text-[#ec1d64]/60 mx-auto" />
          <h3 className="text-lg font-bold text-white">No News Articles Found</h3>
          <p className="text-xs text-purple-200/70">
            New updates published by DJ EMMA PRO will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((post) => {
            const isLiked = isItemLikedByVisitor('dj_emma_liked_news', post.id);
            return (
              <article
                key={post.id}
                className="group bg-[#16072b] border border-[#ec1d64]/25 hover:border-[#ec1d64] transition flex flex-col justify-between overflow-hidden shadow-xl"
              >
                <div>
                  <div
                    onClick={() => setSelectedPost(post)}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-[#0e041f] cursor-pointer"
                  >
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover img-smooth-zoom"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#2d0c54] to-[#0e041f] flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-[#ec1d64]/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16072b] via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-pink-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-[#ec1d64]" />
                      <span>{formatDate(post.createdAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-purple-200/70">THE WAKANDA BOSS</span>
                    </div>

                    <h2
                      onClick={() => setSelectedPost(post)}
                      className="font-bold text-xl text-white group-hover:text-pink-300 transition leading-snug cursor-pointer"
                    >
                      {post.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-rainflow-condensed font-bold uppercase tracking-[0.16em] text-[#ff4f8d] hover:text-white transition"
                  >
                    <span>READ MORE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => onLikeNews(post.id)}
                      className={`cursor-pointer flex items-center gap-1 transition ${
                        isLiked ? 'text-[#ec1d64] font-bold' : 'text-purple-200 hover:text-pink-300'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#ec1d64]' : ''}`} />
                      <span className="tabular-nums">{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() => onOpenComments?.(post.id, 'news', post.title)}
                      className="cursor-pointer flex items-center gap-1 text-purple-200 hover:text-pink-300 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{commentCounts[post.id] || 0}</span>
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      className="cursor-pointer text-purple-200 hover:text-pink-300 transition"
                    >
                      {copiedId === post.id ? (
                        <span className="text-emerald-300 text-[11px] font-bold">Copied!</span>
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Full Article Reader Modal */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#16072b] border-2 border-[#ec1d64] shadow-2xl overflow-hidden my-8"
          >
            <button
              onClick={() => setSelectedPost(null)}
              aria-label="Close article"
              className="cursor-pointer absolute top-4 right-4 z-20 w-9 h-9 bg-black/80 hover:bg-[#ec1d64] text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedPost.imageUrl && (
              <div className="w-full max-h-[420px] bg-[#0e041f] overflow-hidden">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-pink-300 font-semibold">
                <Calendar className="w-4 h-4 text-[#ec1d64]" />
                <span>{formatDate(selectedPost.createdAt)}</span>
                <span aria-hidden="true">·</span>
                <span>DJ EMMA PRO · THE WAKANDA BOSS</span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                {selectedPost.title}
              </h2>

              <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </p>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onLikeNews(selectedPost.id)}
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-[#230b47] hover:bg-[#ec1d64] text-white text-xs font-bold transition"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Like ({selectedPost.likesCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      const target = selectedPost;
                      setSelectedPost(null);
                      onOpenComments?.(target.id, 'news', target.title);
                    }}
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-[#230b47] hover:bg-[#ec1d64] text-white text-xs font-bold transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Comments ({commentCounts[selectedPost.id] || 0})</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="cursor-pointer px-4 py-1.5 border border-white/25 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Camera, X, ZoomIn } from 'lucide-react';
import { LiveMix, NonstopMix, NewsPost } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: 'portraits' | 'branding' | 'releases';
  caption: string;
}

interface GallerySectionProps {
  liveMixes: LiveMix[];
  nonstops: NonstopMix[];
  newsPosts: NewsPost[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  liveMixes,
  nonstops,
  newsPosts,
}) => {
  const [filter, setFilter] = useState<'all' | 'portraits' | 'branding' | 'releases'>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const staticPhotos: GalleryItem[] = [
    {
      id: 'portrait-wakanda',
      src: '/assets/aistudio/1000355629_1467eab5.png',
      title: 'DJ EMMA PRO · Wakanda Edition',
      category: 'portraits',
      caption: 'Official artist studio portrait in the signature Wakanda Boss tee & shades.',
    },
    {
      id: 'portrait-sunglasses',
      src: '/assets/aistudio/download_036376fa.jpg',
      title: 'DJ EMMA PRO · Studio Session',
      category: 'portraits',
      caption: 'DJ EMMA PRO – Ugandan DJ & Creative Professional.',
    },
    {
      id: 'portrait-editorial',
      src: '/assets/aistudio/Serious_Young_Man_in_Thrasher_Shirt_717e5736.png',
      title: 'DJ EMMA PRO · Official Feature Portrait',
      category: 'portraits',
      caption: 'Main promotional portrait from Kampala, Uganda.',
    },
    {
      id: 'banner-main',
      src: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.07.01_AM_d9477edb.jpeg',
      title: 'DJ EMMA PRO · Official Stage Visual',
      category: 'branding',
      caption: 'Widescreen stage backdrop and promotional artwork.',
    },
    {
      id: 'emblem-official',
      src: '/assets/aistudio/Glossy_DJ_Emma_Pro_Emblem__1__be0e7f62.png',
      title: 'DJ EMMA PRO · Official Emblem',
      category: 'branding',
      caption: 'Official emblem and graphic design mark by DJ EMMA PRO.',
    },
    {
      id: 'portrait-stage',
      src: '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
      title: 'Serere to Kampala Artist Showcase',
      category: 'branding',
      caption: 'Visual branding and career showcase from Serere District to Kampala.',
    },
  ];

  const releaseVisuals: GalleryItem[] = [
    ...liveMixes
      .filter((m) => m.isPublished && m.coverUrl)
      .map((m) => ({
        id: `live-${m.id}`,
        src: m.coverUrl,
        title: m.title,
        category: 'releases' as const,
        caption: `Live Mix · ${m.genre}`,
      })),
    ...nonstops
      .filter((n) => n.isPublished && n.coverUrl)
      .map((n) => ({
        id: `nonstop-${n.id}`,
        src: n.coverUrl,
        title: n.title,
        category: 'releases' as const,
        caption: `Nonstop Mix · ${n.genre}`,
      })),
    ...newsPosts
      .filter((p) => p.isPublished && p.imageUrl)
      .map((p) => ({
        id: `news-${p.id}`,
        src: p.imageUrl!,
        title: p.title,
        category: 'releases' as const,
        caption: 'Official News Visual',
      })),
  ];

  const allItems = [...staticPhotos, ...releaseVisuals];
  const visibleItems =
    filter === 'all' ? allItems : allItems.filter((item) => item.category === filter);

  return (
    <div className="w-full text-white pb-24 pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <ScrollReveal>
        <div className="bg-[#16072b] border-l-4 border-[#ec1d64] border-y border-r border-white/10 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.22em] text-[#ec1d64]">
              PHOTOGRAPHS & CREATIVE ARTWORK
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
              OFFICIAL GALLERY
            </h1>
            <p className="text-sm text-purple-100/80 max-w-2xl">
              Authentic studio photography, official DJ EMMA PRO branding, and published cover artwork.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'ALL PHOTOS' },
              { id: 'portraits', label: 'PORTRAITS' },
              { id: 'branding', label: 'ARTWORK' },
              { id: 'releases', label: 'MIX COVERS & NEWS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`cursor-pointer px-4 py-2 font-rainflow-condensed text-xs font-bold uppercase tracking-[0.14em] transition ${
                  filter === tab.id
                    ? 'bg-[#ec1d64] text-white'
                    : 'bg-[#0e041f] text-purple-200 border border-white/15 hover:border-[#ec1d64]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {visibleItems.length === 0 ? (
        <div className="bg-[#16072b] border border-white/10 p-12 text-center space-y-2">
          <Camera className="w-10 h-10 text-[#ec1d64]/60 mx-auto" />
          <p className="text-sm text-purple-200/75">No visuals in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group cursor-pointer text-left bg-[#16072b] border border-[#ec1d64]/25 hover:border-[#ec1d64] overflow-hidden shadow-xl transition"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0e041f]">
                <img
                  src={item.src}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain sm:object-cover object-top img-smooth-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120426] via-transparent to-transparent opacity-75 pointer-events-none" />
                <span className="absolute top-3 right-3 w-8 h-8 bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <ZoomIn className="w-4 h-4 text-[#ec1d64]" />
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm text-white group-hover:text-pink-300 transition truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-purple-200/70 line-clamp-1">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4"
        >
          <button
            onClick={() => setLightboxItem(null)}
            aria-label="Close lightbox"
            className="cursor-pointer absolute top-4 right-4 w-10 h-10 bg-white/15 hover:bg-[#ec1d64] text-white flex items-center justify-center transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxItem.src}
            alt={lightboxItem.title}
            className="max-w-full max-h-[80vh] object-contain border-2 border-[#ec1d64]/60 shadow-2xl"
          />
          <div className="mt-4 text-center max-w-xl">
            <h4 className="font-bold text-base text-white">{lightboxItem.title}</h4>
            <p className="text-xs text-purple-200/80 mt-1">{lightboxItem.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
};

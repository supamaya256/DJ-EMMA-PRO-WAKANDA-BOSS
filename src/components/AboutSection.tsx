import React, { useState } from 'react';
import { ArtistInfo } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Disc,
  Radio,
  Palette,
  Headphones,
  Instagram,
  Youtube,
  Facebook,
  X,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface AboutSectionProps {
  artist: ArtistInfo;
  isAdmin: boolean;
  onOpenEditArtist: () => void;
}

const PORTRAIT_GALLERY = [
  {
    src: '/assets/aistudio/1000355629_1467eab5.png',
    caption: 'DJ EMMA PRO · Wakanda Edition Portrait',
  },
  {
    src: '/assets/aistudio/download_036376fa.jpg',
    caption: 'DJ EMMA PRO · Official Studio Look',
  },
  {
    src: '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
    caption: 'DJ EMMA PRO · Serere to Kampala Showcase',
  },
  {
    src: '/assets/aistudio/Glossy_DJ_Emma_Pro_Emblem__1__be0e7f62.png',
    caption: 'DJ EMMA PRO · Official Creative Emblem',
  },
];

export const AboutSection: React.FC<AboutSectionProps> = ({
  artist,
  isAdmin,
  onOpenEditArtist,
}) => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const getServiceIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('drop') || lower.includes('intro')) return Radio;
    if (lower.includes('design') || lower.includes('brand')) return Palette;
    if (lower.includes('mix') || lower.includes('master')) return Headphones;
    return Disc;
  };

  return (
    <div className="w-full text-white pb-24 pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Main Artist Profile & Biography Hero */}
      <ScrollReveal>
        <section className="relative bg-[#16072b] border border-[#ec1d64]/40 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Personal Portrait Column */}
            <div className="lg:col-span-5 flex flex-col items-center space-y-4">
              <div className="relative w-full max-w-sm border-[5px] border-[#ec1d64] bg-[#0e041f] p-2 shadow-2xl">
                <img
                  src="/assets/aistudio/1000355629_1467eab5.png"
                  alt="DJ EMMA PRO - The Wakanda Boss"
                  className="w-full h-auto object-cover"
                />
                <div className="p-3 bg-[#120426] border-t border-white/10 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] tracking-widest text-[#ec1d64] font-bold uppercase block">
                      EASTERN UGANDA ROOTS
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white uppercase">
                      SERERE ➔ KAMPALA
                    </span>
                  </div>
                  <span className="text-xs font-mono text-pink-300">UGANDA</span>
                </div>
              </div>
            </div>

            {/* Right Biography, Roots & Career */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.24em] text-[#ec1d64]">
                  OFFICIAL ARTIST BIOGRAPHY
                </span>
                {isAdmin && (
                  <button
                    onClick={onOpenEditArtist}
                    className="cursor-pointer px-4 py-1.5 bg-[#ec1d64] hover:bg-[#ff2e78] text-xs font-bold uppercase tracking-wider text-white transition"
                  >
                    EDIT BIOGRAPHY & CONTACTS
                  </button>
                )}
              </div>

              <div>
                <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                  {artist.stageName}
                </h1>
                <p className="font-rainflow-condensed text-lg sm:text-xl font-bold tracking-[0.2em] text-pink-300 uppercase mt-1">
                  {artist.alias} · {artist.tagline}
                </p>
              </div>

              <div className="p-5 bg-[#0e041f] border border-white/10">
                <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed">
                  {artist.bio}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0e041f] border border-[#ec1d64]/30 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#ec1d64] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-pink-300 uppercase tracking-widest font-bold block">
                      ORIGIN
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {artist.origin}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#0e041f] border border-[#ec1d64]/30 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-pink-300 uppercase tracking-widest font-bold block">
                      CURRENT BASE
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {artist.baseLocation}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-pink-200 font-rainflow-condensed uppercase tracking-[0.14em]">
                <span>DJ Mixing</span>
                <span className="text-[#ec1d64]">·</span>
                <span>Music Entertainment</span>
                <span className="text-[#ec1d64]">·</span>
                <span>Graphic Design</span>
                <span className="text-[#ec1d64]">·</span>
                <span>Creative Branding</span>
                <span className="text-[#ec1d64]">·</span>
                <span>Professional DJ Drops</span>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* DJ Background, Music Career & Graphic Design Expertise */}
      <section className="space-y-8">
        <div className="space-y-2 border-b border-[#ec1d64]/35 pb-4">
          <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.24em] text-[#ec1d64]">
            CRAFT & CREATIVE SERVICES
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase">
            DJ Career & Creative Expertise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artist.services.map((service, index) => {
            const Icon = getServiceIcon(service.title);
            return (
              <ScrollReveal key={service.id || index} delayMs={index * 60}>
                <div className="h-full bg-[#16072b] border border-[#ec1d64]/25 hover:border-[#ec1d64] p-6 transition flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="w-11 h-11 bg-[#ec1d64] text-white flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white font-display">
                      {service.title}
                    </h3>
                    <p className="text-xs text-purple-100/80 mt-2 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                  <span className="pt-4 mt-4 border-t border-white/10 text-[11px] font-rainflow-condensed uppercase tracking-wider text-pink-300 font-bold">
                    Available for Booking
                  </span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Photographs & Personal Gallery */}
      <section className="space-y-8">
        <div className="space-y-2 border-b border-[#ec1d64]/35 pb-4">
          <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.24em] text-[#ec1d64]">
            OFFICIAL VISUAL ARCHIVE
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase">
            Photographs & Branding Gallery
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PORTRAIT_GALLERY.map((photo) => (
            <button
              key={photo.src}
              onClick={() => setPreviewSrc(photo.src)}
              className="group cursor-pointer text-left bg-[#16072b] border border-[#ec1d64]/25 hover:border-[#ec1d64] overflow-hidden shadow-xl transition"
            >
              <div className="aspect-[4/4] w-full overflow-hidden bg-[#0e041f]">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-contain sm:object-cover object-top img-smooth-zoom"
                />
              </div>
              <div className="p-3.5 text-xs font-semibold text-purple-100 group-hover:text-pink-300 transition truncate">
                {photo.caption}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Social Media Links & Booking Contact Details */}
      <section className="bg-[#16072b] border border-[#ec1d64]/35 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.24em] text-[#ec1d64]">
            BOOKINGS & SOCIAL CHANNELS
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
            Connect with DJ EMMA PRO
          </h2>
          <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed">
            Follow on social platforms for live updates or contact directly for club sets, concerts, custom drops, and creative design projects.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {artist.socialLinks.instagram && (
              <a
                href={artist.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#0e041f] hover:bg-[#ec1d64] border border-white/15 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            )}
            {artist.socialLinks.youtube && (
              <a
                href={artist.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#0e041f] hover:bg-[#ec1d64] border border-white/15 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </a>
            )}
            {artist.socialLinks.facebook && (
              <a
                href={artist.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#0e041f] hover:bg-[#ec1d64] border border-white/15 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
            )}
            {artist.socialLinks.tiktok && (
              <a
                href={artist.socialLinks.tiktok}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#0e041f] hover:bg-[#ec1d64] border border-white/15 text-xs font-bold uppercase tracking-wider transition"
              >
                TikTok
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <a
            href={`https://wa.me/${artist.bookingWhatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="p-4 bg-[#0e041f] border border-emerald-400/35 hover:border-emerald-400 transition space-y-1"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] text-purple-200/70 uppercase block">WhatsApp</span>
            <span className="font-bold text-white block truncate">{artist.bookingWhatsapp}</span>
          </a>

          <a
            href={`tel:${artist.phone}`}
            className="p-4 bg-[#0e041f] border border-[#ec1d64]/35 hover:border-[#ec1d64] transition space-y-1"
          >
            <Phone className="w-5 h-5 text-[#ec1d64]" />
            <span className="text-[10px] text-purple-200/70 uppercase block">Phone</span>
            <span className="font-bold text-white block truncate">{artist.phone}</span>
          </a>

          <a
            href={`mailto:${artist.email}`}
            className="p-4 bg-[#0e041f] border border-white/15 hover:border-[#ec1d64] transition space-y-1"
          >
            <Mail className="w-5 h-5 text-pink-300" />
            <span className="text-[10px] text-purple-200/70 uppercase block">Email</span>
            <span className="font-bold text-white block truncate">{artist.email}</span>
          </a>
        </div>
      </section>

      {previewSrc && (
        <div
          onClick={() => setPreviewSrc(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            onClick={() => setPreviewSrc(null)}
            aria-label="Close photo preview"
            className="cursor-pointer absolute top-4 right-4 w-10 h-10 bg-white/15 hover:bg-[#ec1d64] text-white flex items-center justify-center transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewSrc}
            alt="DJ EMMA PRO Photo"
            className="max-w-full max-h-[88vh] object-contain border-2 border-[#ec1d64]/60 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

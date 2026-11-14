import React, { useState } from 'react';
import { ArtistInfo } from '../types';
import { MapPin, Phone, Mail, MessageSquare, Sparkles, Disc, Radio, Palette, Headphones, Send, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface AboutSectionProps {
  artist: ArtistInfo;
  isAdmin: boolean;
  onOpenEditArtist: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  artist,
  isAdmin,
  onOpenEditArtist,
}) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEventDate, setInquiryEventDate] = useState('');
  const [inquiryService, setInquiryService] = useState('DJ Booking for Event/Club');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello DJ EMMA PRO (THE WAKANDA BOSS)!\n\nI would like to inquire about a booking / creative service:\n- Name: ${inquiryName}\n- Contact: ${inquiryPhone}\n- Service: ${inquiryService}\n- Event Date: ${inquiryEventDate || 'TBD'}\n- Message: ${inquiryMessage}`
    );
    const cleanNumber = artist.bookingWhatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
    setSentSuccess(true);
  };

  const getServiceIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('drop') || lower.includes('intro')) return Radio;
    if (lower.includes('design') || lower.includes('brand')) return Palette;
    if (lower.includes('mix') || lower.includes('master')) return Headphones;
    return Disc;
  };

  return (
    <div className="w-full text-white pb-32 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Top Hero Card with Original Portraits & Verified Details */}
      <ScrollReveal>
        <section className="relative rounded-3xl royal-glass-card electric-gold-shimmer electric-blue-glow p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Original Portraits Gallery */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden royal-glass-card p-2 border-2 border-amber-400/40 shadow-[0_15px_45px_rgba(0,0,0,0.85)]">
              {/* Preserved Original Portrait without cropping */}
              <img
                src="/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png"
                alt="DJ EMMA PRO - The Wakanda Boss"
                className="w-full h-auto object-cover rounded-xl"
              />
              
              <div className="absolute bottom-4 left-4 right-4 rounded-xl royal-nav-bar p-3 border border-amber-400/40 backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] tracking-widest text-amber-300 font-bold uppercase block">
                    EASTERN UGANDA ROOTS
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                    SERERE ➔ KAMPALA
                  </h4>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
              </div>
            </div>

            {/* Second Portrait Thumbnail */}
            <div className="mt-4 flex items-center gap-3 p-2.5 rounded-xl royal-glass-card border border-amber-400/25 w-full max-w-sm">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-amber-400/40 shadow-sm">
                <img
                  src="/assets/aistudio/file_00000000577482118275a24f7cbcec0a_37ac2a88.png"
                  alt="DJ Emma Pro live portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-amber-300 block">STAGE IDENTITY</span>
                <span className="text-slate-300 text-[11px]">The Wakanda Boss • Nonstop Party Energy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Biography & Profile */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFICIAL ARTIST BIOGRAPHY</span>
              </div>

              {isAdmin && (
                <button
                  onClick={onOpenEditArtist}
                  className="px-4 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold text-amber-300 border border-amber-400/50 transition cursor-pointer"
                >
                  EDIT BIOGRAPHY & CONTACTS
                </button>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl font-black gold-chrome-text font-display uppercase tracking-tight">
                {artist.stageName}
              </h1>
              <h2 className="text-lg sm:text-xl font-bold tracking-widest text-amber-200/90 uppercase font-display">
                {artist.alias}
              </h2>
            </div>

            {/* Core Verified Bio */}
            <div className="p-5 rounded-2xl royal-glass-card border border-amber-400/20 space-y-3">
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {artist.bio}
              </p>
            </div>

            {/* Geographical & Origin Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl royal-glass-card border border-amber-400/20 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-amber-300/80 uppercase tracking-widest font-bold block">
                    ORIGIN
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {artist.origin}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl royal-glass-card border border-amber-400/20 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-amber-300/80 uppercase tracking-widest font-bold block">
                    CURRENT BASE
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {artist.baseLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-amber-200 border border-amber-400/30">
                DJ Mixing
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-amber-200 border border-amber-400/30">
                Music Entertainment
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-amber-200 border border-amber-400/30">
                Graphic Design
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-amber-200 border border-amber-400/30">
                Creative Branding
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-amber-200 border border-amber-400/30">
                Professional DJ Drops
              </span>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* SECTION 2: CREATIVE SERVICES */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/15 text-amber-300 border border-amber-400/40">
            CREATIVE EXCELLENCE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold gold-chrome-text font-display uppercase">
            SERVICES & EXPERTISE
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Beyond the turntables, DJ EMMA PRO provides end-to-end creative and audio solutions across Uganda and East Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artist.services.map((service, index) => {
            const Icon = getServiceIcon(service.title);
            return (
              <ScrollReveal key={service.id || index} delayMs={index * 70}>
                <div
                  className="group h-full rounded-2xl royal-glass-card card-3d-hover p-6 border border-amber-400/20 hover:border-amber-400/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-300 to-sky-400 text-slate-950 flex items-center justify-center font-bold mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition font-display">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>Available for booking</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: PROFESSIONAL BOOKING & CONTACT */}
      <ScrollReveal>
        <section className="relative rounded-3xl royal-glass-card electric-blue-glow p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/15 text-amber-300 border border-amber-400/40">
                GET IN TOUCH
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold gold-chrome-text font-display uppercase mt-2">
                BOOK DJ EMMA PRO
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Reach out for club sets, concerts, private events, custom drops, or graphic branding projects.
              </p>
            </div>

            <div className="space-y-4">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${artist.bookingWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl royal-glass-card border border-emerald-400/30 hover:border-emerald-400/60 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/40 group-hover:scale-105 transition">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    WHATSAPP BOOKING
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                    {artist.bookingWhatsapp}
                  </span>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${artist.phone}`}
                className="flex items-center gap-4 p-4 rounded-2xl royal-glass-card border border-amber-400/25 hover:border-amber-400/60 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/40 group-hover:scale-105 transition">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    DIRECT CALL
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                    {artist.phone}
                  </span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${artist.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl royal-glass-card border border-blue-400/25 hover:border-blue-400/60 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/40 group-hover:scale-105 transition">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    OFFICIAL EMAIL
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                    {artist.email}
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Interactive Booking Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl royal-glass-card border border-amber-400/30 bg-[#060a16]/80">
              <h3 className="text-lg sm:text-xl font-bold gold-chrome-text font-display uppercase mb-4">
                SEND BOOKING / INQUIRY MESSAGE
              </h3>

              {sentSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-base">Inquiry Prepared!</h4>
                  <p className="text-xs text-slate-300">
                    Your message has been formatted and redirected to WhatsApp for instant confirmation with DJ Emma Pro.
                  </p>
                  <button
                    onClick={() => setSentSuccess(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold gold-btn text-slate-950 transition cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 block">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="e.g. John Okello"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#091124] border border-amber-400/25 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 block">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="e.g. +256 700 000000"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#091124] border border-amber-400/25 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 block">
                        Service Requested
                      </label>
                      <select
                        value={inquiryService}
                        onChange={(e) => setInquiryService(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#091124] border border-amber-400/25 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                      >
                        <option>Live Club & Concert DJ Mixing</option>
                        <option>Custom Professional DJ Drops & Intros</option>
                        <option>Graphic Design & Creative Branding</option>
                        <option>Mixtape Production & Audio Mastering</option>
                        <option>Private Parties & Wedding Entertainment</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 block">
                        Event Date (If Applicable)
                      </label>
                      <input
                        type="date"
                        value={inquiryEventDate}
                        onChange={(e) => setInquiryEventDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#091124] border border-amber-400/25 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Message / Special Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Tell us about the venue, crowd, specific DJ drops needed..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#091124] border border-amber-400/25 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full gold-btn text-slate-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-amber-500/30"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND INQUIRY VIA WHATSAPP</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>
    </div>
  );
};

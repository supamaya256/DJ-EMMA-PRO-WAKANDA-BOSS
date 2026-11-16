import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
} from 'lucide-react';
import { ArtistInfo } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ContactSectionProps {
  artist: ArtistInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ artist }) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEventDate, setInquiryEventDate] = useState('');
  const [inquiryService, setInquiryService] = useState('Live Club & Concert DJ Mixing');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello DJ EMMA PRO (THE WAKANDA BOSS)!\n\nI would like to inquire about a booking / creative service:\n- Name: ${inquiryName}\n- Contact: ${inquiryPhone}\n- Service: ${inquiryService}\n- Event Date: ${inquiryEventDate || 'TBD'}\n- Message: ${inquiryMessage}`
    );
    const cleanNumber = artist.bookingWhatsapp.replace(/[^0-9]/g, '');
    const anchor = document.createElement('a');
    anchor.href = `https://wa.me/${cleanNumber}?text=${text}`;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
    setSentSuccess(true);
  };

  return (
    <div className="w-full text-white pb-24 pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <ScrollReveal>
        <div className="bg-[#16072b] border-l-4 border-[#ec1d64] border-y border-r border-white/10 p-6 sm:p-10 shadow-2xl">
          <span className="text-xs font-rainflow-condensed font-bold uppercase tracking-[0.22em] text-[#ec1d64]">
            OFFICIAL BOOKINGS & CREATIVE SERVICES
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight mt-1">
            CONTACT DJ EMMA PRO
          </h1>
          <p className="text-sm text-purple-100/80 max-w-2xl mt-2">
            Direct booking and creative requests for live club sets, events, custom DJ drops, mixtape production, and graphic branding.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Authentic Direct Channels & Socials */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-[#16072b] border border-[#ec1d64]/25 space-y-4">
            <h2 className="font-display font-bold text-lg uppercase text-white">
              Direct Contact Channels
            </h2>

            <a
              href={`https://wa.me/${artist.bookingWhatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-4 bg-[#0e041f] border border-emerald-400/35 hover:border-emerald-400 transition group"
            >
              <div className="w-11 h-11 bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-purple-200/70 font-bold block">
                  WHATSAPP BOOKING
                </span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                  {artist.bookingWhatsapp}
                </span>
              </div>
            </a>

            <a
              href={`tel:${artist.phone}`}
              className="flex items-center gap-4 p-4 bg-[#0e041f] border border-[#ec1d64]/35 hover:border-[#ec1d64] transition group"
            >
              <div className="w-11 h-11 bg-[#ec1d64]/20 text-pink-300 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-purple-200/70 font-bold block">
                  DIRECT CALL
                </span>
                <span className="text-sm font-bold text-white group-hover:text-pink-300 transition">
                  {artist.phone}
                </span>
              </div>
            </a>

            <a
              href={`mailto:${artist.email}`}
              className="flex items-center gap-4 p-4 bg-[#0e041f] border border-white/15 hover:border-[#ec1d64] transition group"
            >
              <div className="w-11 h-11 bg-purple-500/20 text-purple-200 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-purple-200/70 font-bold block">
                  OFFICIAL EMAIL
                </span>
                <span className="text-sm font-bold text-white group-hover:text-pink-300 transition">
                  {artist.email}
                </span>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 bg-[#0e041f] border border-white/10">
              <div className="w-11 h-11 bg-white/5 text-[#ec1d64] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-purple-200/70 font-bold block">
                  BASED IN
                </span>
                <span className="text-sm font-semibold text-white">
                  {artist.baseLocation} · Roots in {artist.origin}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {artist.socialLinks.instagram && (
                <a
                  href={artist.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-[#1b0833] hover:bg-[#ec1d64] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10 transition"
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
                  className="px-3.5 py-2 bg-[#1b0833] hover:bg-[#ec1d64] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10 transition"
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
                  className="px-3.5 py-2 bg-[#1b0833] hover:bg-[#ec1d64] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10 transition"
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
                  className="px-3.5 py-2 bg-[#1b0833] hover:bg-[#ec1d64] text-xs font-bold uppercase tracking-wider border border-white/10 transition"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Validated Booking Form */}
        <div className="lg:col-span-7 bg-[#16072b] border border-[#ec1d64]/35 p-6 sm:p-8 shadow-2xl">
          <h2 className="font-display font-bold text-xl uppercase text-white mb-5">
            Send a Booking or Inquiry Message
          </h2>

          {sentSuccess ? (
            <div className="p-8 bg-emerald-500/10 border border-emerald-400/35 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-base text-white">Inquiry Prepared</h3>
              <p className="text-xs text-purple-100/80">
                Your booking message has been prepared for WhatsApp delivery directly to DJ EMMA PRO.
              </p>
              <button
                onClick={() => setSentSuccess(false)}
                className="cursor-pointer gold-btn px-5 py-2.5 text-xs uppercase tracking-wider"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-purple-200 mb-1.5 block">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. John Okello"
                    className="w-full px-4 py-2.5 bg-[#0e041f] border border-[#ec1d64]/30 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-[#ec1d64]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-purple-200 mb-1.5 block">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="e.g. +256 700 000000"
                    className="w-full px-4 py-2.5 bg-[#0e041f] border border-[#ec1d64]/30 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-[#ec1d64]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-purple-200 mb-1.5 block">
                    Service Requested
                  </label>
                  <select
                    value={inquiryService}
                    onChange={(e) => setInquiryService(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0e041f] border border-[#ec1d64]/30 text-sm text-white focus:outline-none focus:border-[#ec1d64]"
                  >
                    <option>Live Club & Concert DJ Mixing</option>
                    <option>Custom Professional DJ Drops & Intros</option>
                    <option>Graphic Design & Creative Branding</option>
                    <option>Mixtape Production & Audio Mastering</option>
                    <option>Private Parties & Wedding Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-purple-200 mb-1.5 block">
                    Event Date (If Applicable)
                  </label>
                  <input
                    type="date"
                    value={inquiryEventDate}
                    onChange={(e) => setInquiryEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0e041f] border border-[#ec1d64]/30 text-sm text-white focus:outline-none focus:border-[#ec1d64]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-purple-200 mb-1.5 block">
                  Message / Requirements
                </label>
                <textarea
                  rows={4}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Share venue details, date, custom drop script, or graphic project brief..."
                  className="w-full px-4 py-2.5 bg-[#0e041f] border border-[#ec1d64]/30 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-[#ec1d64]"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full py-3.5 gold-btn font-rainflow-condensed text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>SEND INQUIRY VIA WHATSAPP</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

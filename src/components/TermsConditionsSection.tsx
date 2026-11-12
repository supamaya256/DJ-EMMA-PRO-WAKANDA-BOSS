import React from 'react';
import { FileText, ArrowLeft, ShieldCheck, Music, AlertTriangle, Scale, Copyright, Mail, CheckCircle2 } from 'lucide-react';

interface TermsConditionsSectionProps {
  onBackToHome: () => void;
}

export const TermsConditionsSection: React.FC<TermsConditionsSectionProps> = ({ onBackToHome }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-amber-400/30">
        <button
          onClick={onBackToHome}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full royal-glass-card text-amber-300 hover:text-white hover:border-amber-400 text-xs font-bold transition shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO HOME</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-amber-400">
            TERMS OF SERVICE • ARTIST PROTECTION AGREEMENT
          </span>
          <p className="text-xs text-slate-400">Effective Date: November 12, 2026</p>
        </div>
      </div>

      {/* Hero Title Card */}
      <div className="relative p-6 sm:p-10 rounded-3xl royal-glass-card border-2 border-amber-400/50 shadow-[0_10px_50px_rgba(0,0,0,0.85)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shadow-lg">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-amber-400 uppercase">
              DJ EMMA PRO — THE WAKANDA BOSS
            </span>
            <h1 className="text-2xl sm:text-4xl font-black gold-chrome-text font-display uppercase tracking-tight">
              TERMS & CONDITIONS
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          These Terms and Conditions constitute a legally binding agreement between you and <strong className="text-white">DJ EMMA PRO</strong> governing your access to and use of our music streaming platform, news portal, live mixes, and creative audio services. By visiting or streaming music from this website, you confirm your unconditional acceptance of these terms.
        </p>
      </div>

      {/* Terms Body */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        {/* 1. Acceptable Website Usage */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">1. Acceptable Website Usage</h2>
          </div>
          <p>
            You agree to use DJ EMMA PRO solely for lawful, personal, non-commercial entertainment, music discovery, and promotional engagement. You agree not to disrupt website operations, compromise server stability, or interfere with other visitors' listening experience.
          </p>
        </section>

        {/* 2. Music Uploads & Artist Ownership Rights */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-4 border border-amber-400/40">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Music className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">2. Music Uploads & Artist Ownership Rights (Core Principle)</h2>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-semibold">
            STRICT ARTIST PROTECTION: Artists, producers, and rights holders retain 100% full legal ownership, copyright, and publishing rights to their original musical compositions, master sound recordings, DJ mixes, and cover artwork.
          </div>
          <p>
            By submitting, uploading, or licensing music to DJ EMMA PRO, the contributing artist grants DJ EMMA PRO only a non-exclusive, worldwide, royalty-free, revocable license to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Host, transcode, store, and digitally stream the audio files to website visitors.</li>
            <li>Display promotional cover artwork, track titles, and artist biographies.</li>
            <li>Promote the artist's brand across DJ EMMA PRO social channels, playlists, and event sets.</li>
          </ul>
          <p>
            Artists may request the removal or modification of their uploaded tracks at any time by contacting our music operations desk.
          </p>
        </section>

        {/* 3. Copyright Protection & Takedown Procedures (DMCA) */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Copyright className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">3. Copyright Protection & DMCA Takedown Procedure</h2>
          </div>
          <p>
            DJ EMMA PRO respects the intellectual property rights of recording artists, songwriters, and record labels worldwide. If you are a copyright owner or an agent thereof and believe that any audio mix, song, or cover art infringes your copyright, please submit an expedited takedown notice containing:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Identification of the copyrighted sound recording or composition claimed to be infringed.</li>
            <li>The exact URL or mix title on our website where the infringing material is located.</li>
            <li>Your full legal name, physical or digital signature, email address, and phone number.</li>
            <li>A statement of good faith belief that the disputed use is unauthorized by the copyright owner, agent, or the law.</li>
          </ul>
          <p>
            Send all infringement notices directly to our designated copyright agent at <a href="mailto:supamaya256@gmail.com" className="text-amber-300 underline font-bold">supamaya256@gmail.com</a>. Upon receipt, infringing material will be expeditiously removed within 24–48 hours.
          </p>
        </section>

        {/* 4. Streaming, Downloads & Personal Listening */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">4. Streaming & Music Downloads</h2>
          </div>
          <p>
            Streamed mixes and permitted promotional audio downloads are provided strictly for your personal, non-commercial listening pleasure. You may not re-upload our mixtapes, signature DJ drops, or compiled audio packages to paid commercial platforms, streaming DSPs, or subscription resale marketplaces without explicit written authorization from DJ EMMA PRO.
          </p>
        </section>

        {/* 5. User Comments, Likes & Community Conduct */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">5. Visitor Comments & Community Standards</h2>
          </div>
          <p>
            Visitors are welcomed to post reactions, hype, and reviews on news articles and mixtapes. All comments are subject to community moderation. We strictly prohibit:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>Hate speech, tribalism, racism, harassment, or threats of violence.</li>
            <li>Spam, commercial advertising links, affiliate schemes, or phishing URLs.</li>
            <li>Defamatory or obscene language targeted at artists or community members.</li>
          </ul>
          <p>
            We reserve the right to delete, edit, or reject comments that violate these guidelines without prior notice.
          </p>
        </section>

        {/* 6. Prohibited Activities */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">6. Strictly Prohibited Activities</h2>
          </div>
          <p>
            Users are explicitly prohibited from engaging in:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>Automated scraping, crawling, or systematic data extraction from our database or audio CDN.</li>
            <li>Generating artificial stream counts, bot clicks, or automated page impressions.</li>
            <li>Attempting to bypass Supabase Row Level Security (RLS) policies or exploit administrative APIs.</li>
            <li>Reverse engineering or tampering with the client-side audio player or streaming pipeline.</li>
          </ul>
        </section>

        {/* 7. Third-Party Integrations & Google AdSense */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Scale className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">7. Third-Party Services & Google AdSense</h2>
          </div>
          <p>
            This website integrates third-party technologies including Google AdSense advertising, Supabase Cloud authentication, and content delivery networks. DJ EMMA PRO is not responsible for the content, privacy policies, or practices of external third-party services.
          </p>
        </section>

        {/* 8. Limitation of Liability & Contact */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3 border border-amber-400/40">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Mail className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">8. Legal Notices & Contact</h2>
          </div>
          <p>
            For legal inquiries, copyright claims, or licensing permissions, reach out directly:
          </p>
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1 font-mono text-xs">
            <p><span className="text-amber-400 font-bold">Platform:</span> DJ EMMA PRO — THE WAKANDA BOSS</p>
            <p><span className="text-amber-400 font-bold">Email:</span> <a href="mailto:supamaya256@gmail.com" className="text-amber-300 underline">supamaya256@gmail.com</a></p>
            <p><span className="text-amber-400 font-bold">Jurisdiction:</span> Kampala / Serere District, Republic of Uganda</p>
          </div>
        </section>

      </div>

      {/* Bottom Back Button */}
      <div className="text-center pt-4">
        <button
          onClick={onBackToHome}
          className="cursor-pointer px-8 py-3 rounded-full gold-btn text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO HOME PAGE</span>
        </button>
      </div>

    </div>
  );
};

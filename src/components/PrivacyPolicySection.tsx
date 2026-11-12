import React from 'react';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2, Cookie, Database, Mail, ExternalLink, Users, AlertCircle } from 'lucide-react';

interface PrivacyPolicySectionProps {
  onBackToHome: () => void;
}

export const PrivacyPolicySection: React.FC<PrivacyPolicySectionProps> = ({ onBackToHome }) => {
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
            LEGAL COMPLIANCE • GOOGLE ADSENSE READY
          </span>
          <p className="text-xs text-slate-400">Effective Date: November 12, 2026</p>
        </div>
      </div>

      {/* Hero Title Card */}
      <div className="relative p-6 sm:p-10 rounded-3xl royal-glass-card border-2 border-amber-400/50 shadow-[0_10px_50px_rgba(0,0,0,0.85)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-amber-400 uppercase">
              DJ EMMA PRO — THE WAKANDA BOSS
            </span>
            <h1 className="text-2xl sm:text-4xl font-black gold-chrome-text font-display uppercase tracking-tight">
              PRIVACY POLICY
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Welcome to the official website of <strong className="text-white">DJ EMMA PRO – THE WAKANDA BOSS</strong> (<span className="text-amber-300">djemmapro.com</span>). Your privacy, transparency, and data sovereignty are paramount to us. This Privacy Policy details our comprehensive standards for data protection, Supabase cloud security, cookie usage, advertising disclosures, and your statutory rights under global data privacy frameworks (including GDPR, CCPA/CPRA, and the Uganda Data Protection and Privacy Act).
        </p>
      </div>

      {/* Policy Sections Accordion/Cards */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        {/* 1. Information Collected from Visitors */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">1. Information We Collect from Visitors</h2>
          </div>
          <p>
            When you browse, listen to live mixes, stream nonstops, post comments, or interact with DJ EMMA PRO, we may process:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong className="text-white">Voluntary User Input:</strong> Display names and commentary submitted through public comment forms, feedback, or booking inquiries.</li>
            <li><strong className="text-white">Device & Technical Identifiers:</strong> Randomly generated pseudonymous client identifiers (<code className="text-amber-300 text-xs font-mono">visitorId</code>) stored in your local browser storage to prevent fraudulent duplicate voting, spam, and track like states across page visits without requiring personal account creation.</li>
            <li><strong className="text-white">Usage & Telemetry:</strong> Anonymized stream play counts, audio scrub preferences, and browser user agent for responsive layout rendering.</li>
          </ul>
        </section>

        {/* 2. User Registration, Authentication & Supabase Storage */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">2. User Registration, Authentication & Supabase Cloud Security</h2>
          </div>
          <p>
            Public visitors can enjoy all music, news, and comments freely without registering an account. Administrative access to upload music, manage news, and update artist profiles is restricted to verified administrators:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong className="text-white">Supabase Cloud PostgreSQL:</strong> Content is securely stored in Supabase Cloud with Row Level Security (RLS) policies enforcing zero-trust access control.</li>
            <li><strong className="text-white">JWT Token Architecture:</strong> Authenticated sessions use cryptographically signed JSON Web Tokens (JWT) verified via PostgreSQL Security Definer functions.</li>
            <li><strong className="text-white">Zero Password Exposure:</strong> Secret keys and administrative database passwords are never exposed in client-side code or browser network traffic.</li>
          </ul>
        </section>

        {/* 3. Music Uploads, Audio Files & Artist Profiles */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Database className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">3. Music Uploads, Audio Files & Artist Profiles</h2>
          </div>
          <p>
            Original audio mixes, nonstop mixtapes, and cover artwork are hosted across high-performance Supabase Storage Buckets (<code className="text-amber-300 text-xs font-mono">audio-files</code>, <code className="text-amber-300 text-xs font-mono">artwork-images</code>, <code className="text-amber-300 text-xs font-mono">news-images</code>). Artists retain 100% full intellectual property ownership of their master sound recordings and original creative works.
          </p>
        </section>

        {/* 4. Likes, Follows, Comments & Community Interaction */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">4. Likes, Comments & Community Interactions</h2>
          </div>
          <p>
            When you click like on a mix or news article, your vote is recorded atomically via Supabase database functions (<code className="text-amber-300 text-xs font-mono">toggle_post_like</code>, <code className="text-amber-300 text-xs font-mono">toggle_mix_like</code>) to keep aggregate counters accurate in real time. Comments submitted to the website are publicly viewable by visitors. We moderate abusive, defamatory, or unlawful submissions.
          </p>
        </section>

        {/* 5. Cookies, Tracking & Google AdSense Advertising */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-4 border border-amber-400/40">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Cookie className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">5. Cookies, Google AdSense & Advertising Disclosures</h2>
          </div>
          <p>
            Our website uses cookies and similar tracking technologies to ensure flawless audio playback and support free access through legitimate, family-friendly advertising via <strong className="text-white">Google AdSense</strong>.
          </p>
          <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-500/30 space-y-2 text-xs">
            <h3 className="font-bold text-amber-300 uppercase">Google AdSense & Third-Party Vendor Cookies:</h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites across the Internet.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline font-bold inline-flex items-center gap-1 hover:text-white">Google Ads Settings <ExternalLink className="w-3 h-3" /></a>.</li>
              <li>To learn how Google manages data in advertising products, review <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline font-bold inline-flex items-center gap-1 hover:text-white">How Google Uses Information from Sites or Apps That Use Our Services <ExternalLink className="w-3 h-3" /></a>.</li>
            </ul>
          </div>
          <p>
            Depending on your jurisdiction (such as the European Economic Area or UK), non-personalized ads or consent-managed ads will be displayed in compliance with the Google EU User Consent Policy and IAB TCF framework.
          </p>
        </section>

        {/* 6. Data Retention, User Rights & Deletion Requests */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">6. Data Retention, Your Rights & Deletion Requests</h2>
          </div>
          <p>
            We do not sell, rent, or monetize your personal information to third-party data brokers. You retain absolute rights under data protection laws to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Request access to any personal data associated with your interaction.</li>
            <li>Request immediate deletion or redaction of comments you have published.</li>
            <li>Clear cached visitor keys and cookie preferences at any time in your browser settings.</li>
          </ul>
        </section>

        {/* 7. Children's Privacy */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">7. Children's Privacy Protection (COPPA)</h2>
          </div>
          <p>
            Our website is tailored for music fans, nightlife enthusiasts, and general entertainment audiences. We do not knowingly collect personal identifiable information from children under the age of 13. If you believe a minor has submitted personal information, please notify us immediately for prompt deletion.
          </p>
        </section>

        {/* 8. Contact Information */}
        <section className="p-6 sm:p-8 rounded-2xl royal-glass-card space-y-3 border border-amber-400/40">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Mail className="w-5 h-5 text-amber-400" />
            <h2 className="gold-chrome-text font-display uppercase">8. Privacy Contact & Complaints</h2>
          </div>
          <p>
            For privacy inquiries, data deletion requests, or questions regarding our Google AdSense compliance, please contact our designated privacy officer:
          </p>
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1 font-mono text-xs">
            <p><span className="text-amber-400 font-bold">Artist / Platform:</span> DJ EMMA PRO — THE WAKANDA BOSS</p>
            <p><span className="text-amber-400 font-bold">Email:</span> <a href="mailto:supamaya256@gmail.com" className="text-amber-300 underline">supamaya256@gmail.com</a></p>
            <p><span className="text-amber-400 font-bold">WhatsApp / Booking:</span> +256 788 123 456</p>
            <p><span className="text-amber-400 font-bold">Headquarters:</span> Kampala & Serere District, Teso Region, Eastern Uganda</p>
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

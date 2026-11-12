import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Check, Settings2, ExternalLink } from 'lucide-react';
import { ActiveTab } from '../types';

interface CookieConsentBannerProps {
  onNavigateToPrivacy: () => void;
  isOpenPreferences?: boolean;
  onClosePreferences?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onNavigateToPrivacy,
  isOpenPreferences = false,
  onClosePreferences,
}) => {
  const [hasConsented, setHasConsented] = useState<boolean>(true); // default true until checked to prevent layout jump
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsCookies, setAnalyticsCookies] = useState(true);
  const [advertisingCookies, setAdvertisingCookies] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dj_emma_cookie_consent');
      if (!stored) {
        setHasConsented(false);
      } else {
        const parsed = JSON.parse(stored);
        setAnalyticsCookies(parsed.analytics ?? true);
        setAdvertisingCookies(parsed.advertising ?? true);
      }
    } catch {
      setHasConsented(false);
    }
  }, []);

  useEffect(() => {
    if (isOpenPreferences) {
      setShowPreferences(true);
    }
  }, [isOpenPreferences]);

  const saveConsent = (analytics: boolean, advertising: boolean) => {
    const preferences = {
      essential: true,
      analytics,
      advertising,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem('dj_emma_cookie_consent', JSON.stringify(preferences));
    } catch {}
    setAnalyticsCookies(analytics);
    setAdvertisingCookies(advertising);
    setHasConsented(true);
    setShowPreferences(false);
    onClosePreferences?.();
  };

  const handleAcceptAll = () => {
    saveConsent(true, true);
  };

  const handleDeclineNonEssential = () => {
    saveConsent(false, false);
  };

  // If user has consented and preferences modal is not explicitly open, render nothing
  if (hasConsented && !showPreferences) return null;

  return (
    <>
      {/* 1. Main Bottom Cookie Notification Banner */}
      {!hasConsented && !showPreferences && (
        <aside
          aria-label="Cookie and Privacy Consent"
          className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-gradient-to-t from-black via-[#060b1b]/98 to-[#0a1228]/95 backdrop-blur-2xl border-t border-amber-400/40 shadow-[0_-10px_40px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            
            <div className="flex items-start gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-wide text-white uppercase font-display">
                    Cookie & Advertising Notice
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase">
                    Google AdSense Ready
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-3xl">
                  We and verified advertising partners (including <strong className="text-white">Google AdSense</strong>) use cookies and anonymous device identifiers to keep music streaming free, analyze traffic, and deliver non-intrusive, relevant advertisements in compliance with the Google Publisher and EU User Consent policies.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              <button
                onClick={onNavigateToPrivacy}
                className="cursor-pointer px-3 py-1.5 rounded-full text-[11px] text-amber-300 hover:text-white transition underline"
              >
                Learn More
              </button>

              <button
                onClick={() => setShowPreferences(true)}
                className="cursor-pointer px-3 py-1.5 rounded-full royal-glass-card text-slate-200 hover:text-white hover:border-amber-400 text-xs font-semibold transition"
              >
                Preferences
              </button>

              <button
                onClick={handleDeclineNonEssential}
                className="cursor-pointer px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition"
              >
                Decline Non-Essential
              </button>

              <button
                onClick={handleAcceptAll}
                className="cursor-pointer px-4 py-1.5 rounded-full gold-btn text-xs font-extrabold uppercase tracking-wider"
              >
                Accept All
              </button>
            </div>

          </div>
        </aside>
      )}

      {/* 2. Granular Cookie Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl royal-glass-card p-6 sm:p-8 text-white shadow-2xl border-2 border-amber-400/50 space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Close Button */}
            <button
              onClick={() => { setShowPreferences(false); onClosePreferences?.(); }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold gold-chrome-text font-display uppercase">
                  Cookie & Advertising Preferences
                </h3>
                <p className="text-xs text-slate-300">
                  Manage how DJ EMMA PRO and third-party vendors process data.
                </p>
              </div>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-3 pt-2 text-xs">
              
              {/* Category 1: Strictly Necessary */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase">Essential Platform Cookies</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ALWAYS ACTIVE
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Required for core website security, audio playback continuity, and administrator sessions. Cannot be disabled.
                  </p>
                </div>
              </div>

              {/* Category 2: Analytics & Stream Metrics */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                <div className="space-y-1 pr-2">
                  <span className="font-bold text-white uppercase">Analytics & Stream Counting</span>
                  <p className="text-slate-400 text-[11px]">
                    Measures popular DJ mixes and overall listener counts to improve future mixtapes.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={analyticsCookies}
                    onChange={(e) => setAnalyticsCookies(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Category 3: Google AdSense & Personalized Ads */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white uppercase">Google AdSense Advertising</span>
                    <span className="text-[10px] text-amber-300 font-mono">(Google Certified)</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Allows Google and its partners to serve relevant ads. When disabled, you will still see ads, but they will be non-personalized.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={advertisingCookies}
                    onChange={(e) => setAdvertisingCookies(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-3">
              <button
                onClick={onNavigateToPrivacy}
                className="cursor-pointer text-xs text-amber-300 hover:text-white underline"
              >
                Full Privacy Policy
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => saveConsent(analyticsCookies, advertisingCookies)}
                  className="cursor-pointer px-5 py-2 rounded-full gold-btn text-xs font-black uppercase tracking-wider shadow-lg"
                >
                  Save My Preferences
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

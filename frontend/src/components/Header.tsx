import React from 'react';
import { Volume2, VolumeX, ShieldCheck, Sparkles } from 'lucide-react';
import type { SupportedLanguage } from '../hooks/useSpeech';

interface HeaderProps {
  isSpeaking: boolean;
  onStopSpeech: () => void;
  voiceLang: SupportedLanguage;
  onToggleVoiceLang: () => void;
  onOpenVendorModal: () => void;
  onOpenMascotIntro: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSpeaking,
  onStopSpeech,
  voiceLang,
  onToggleVoiceLang,
  onOpenVendorModal,
  onOpenMascotIntro,
}) => {
  const getLangBadge = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'hi-IN':
        return 'HI';
      case 'te-IN':
        return 'తెలుగు';
      default:
        return 'EN';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner Notice (MB Solar Hub Aggregator Platform) */}
      <div className="bg-gradient-to-r from-blue-900 via-sky-800 to-blue-900 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        <span>MB Solar Hub — India's #1 Solar Aggregator Platform</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <img
            src="/images/mb-solar-hub-logo.jpg"
            alt="MB Solar Hub Logo"
            className="h-9 sm:h-12 md:h-14 object-contain rounded-md"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'flex items-center gap-2 font-black text-lg sm:text-2xl text-blue-900';
                fallback.innerHTML = '☀️ MB SOLAR HUB';
                parent.appendChild(fallback);
              }
            }}
          />
        </div>

        {/* Right side controls: 3D Mascot, Voice Assistant & Vendor Help */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* 3D Mascot Trigger Button */}
          <button
            onClick={onOpenMascotIntro}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Open 3D Animated Solar Mascot"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Solar Mascot</span>
          </button>

          {/* MB Solar AI Voice Assistant with EN / HI / TE cycle */}
          <div className="flex items-center bg-sky-50 border border-sky-200 rounded-full px-2 sm:px-3 py-1 text-xs text-sky-900 gap-1.5 sm:gap-2">
            <span className="hidden md:inline font-semibold">Voice:</span>
            <button
              onClick={onToggleVoiceLang}
              className="px-1.5 sm:px-2 py-0.5 rounded-full font-bold bg-white text-sky-700 shadow-xs hover:bg-sky-100 transition-colors cursor-pointer text-[11px] sm:text-xs"
              title="Click to cycle English / हिन्दी / తెలుగు"
            >
              {getLangBadge(voiceLang)}
            </button>
            {isSpeaking ? (
              <button
                onClick={onStopSpeech}
                className="flex items-center gap-1 text-red-600 font-medium hover:underline cursor-pointer text-[11px] sm:text-xs"
              >
                <VolumeX className="w-3.5 h-3.5 animate-bounce" /> Stop
              </button>
            ) : (
              <span className="flex items-center gap-1 text-emerald-700 font-medium text-[11px] sm:text-xs">
                <Volume2 className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Ready</span>
              </span>
            )}
          </div>

          {/* Aggregator Vendor Button */}
          <button
            onClick={onOpenVendorModal}
            className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span className="hidden sm:inline">Find Verified Vendors</span>
            <span className="sm:hidden">Vendors</span>
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { X, Volume2, ArrowRight, Sparkles } from 'lucide-react';
import type { SupportedLanguage } from '../hooks/useSpeech';

interface SolarIntroScreenProps {
  isOpen: boolean;
  onProceedToCalculator: (lang: SupportedLanguage) => void;
  onClose: () => void;
  speakIntro: (lang: SupportedLanguage, onEnd?: () => void) => void;
  isSpeaking: boolean;
}

export const SolarIntroScreen: React.FC<SolarIntroScreenProps> = ({
  isOpen,
  onProceedToCalculator,
  onClose,
  speakIntro,
  isSpeaking,
}) => {
  const [step, setStep] = useState<'select_language' | 'greeting'>('select_language');
  const [chosenLang, setChosenLang] = useState<SupportedLanguage>('te-IN');
  const [hasFinishedSpeech, setHasFinishedSpeech] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setStep('select_language');
      setHasFinishedSpeech(false);
    }
  }, [isOpen]);

  const handleLanguageClick = (lang: SupportedLanguage) => {
    setChosenLang(lang);
    setStep('greeting');
    setHasFinishedSpeech(false);

    // Instant local high-fidelity speech playback with zero network latency!
    speakIntro(lang, () => {
      // Transition gracefully only after the intro topic is completely finished!
      setHasFinishedSpeech(true);
      setTimeout(() => {
        onProceedToCalculator(lang);
      }, 1200);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white overflow-y-auto py-6 sm:py-8 animate-fadeIn select-none">
      {/* Background Starry Glow & Dark Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/80 via-black to-black pointer-events-none"></div>

      {/* Top Controls: Close / Skip Button */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-6 z-20 flex items-center gap-3">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all cursor-pointer backdrop-blur-md"
        >
          <span>Skip to Calculator</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main 3D Animated Character Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-md w-full px-4 text-center my-auto">
        {/* Official MB Solar Hub Logo Header */}
        <div className="flex flex-col items-center mb-1 sm:mb-2 animate-fadeIn">
          <div className="bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.6)] border border-sky-400/50 backdrop-blur-md flex items-center justify-center">
            <img
              src="/images/mb-solar-hub-logo.jpg"
              alt="MB Solar Hub Logo"
              className="h-8 sm:h-11 object-contain rounded"
            />
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-300 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Meet "Surya Bot" — MB Solar Hub AI Guide</span>
          </div>
        </div>

        {/* Floating Sun with Radiating Ray Gear & Puffy Clouds */}
        <div className="relative mb-0.5 sm:mb-1 flex items-center justify-center">
          {/* Left Cloud */}
          <svg
            className="w-12 h-8 sm:w-16 sm:h-10 absolute -left-10 sm:-left-12 top-2 text-white/90 drop-shadow-md animate-pulse"
            viewBox="0 0 64 40"
            fill="currentColor"
          >
            <path d="M18 36h30a14 14 0 0 0 3-27.7 18 18 0 0 0-33-2.3A12 12 0 0 0 18 36z" />
          </svg>

          {/* Right Cloud */}
          <svg
            className="w-11 h-7 sm:w-14 sm:h-9 absolute -right-8 sm:-right-10 top-3 sm:top-5 text-white/90 drop-shadow-md animate-pulse"
            style={{ animationDelay: '1s' }}
            viewBox="0 0 64 40"
            fill="currentColor"
          >
            <path d="M18 36h30a14 14 0 0 0 3-27.7 18 18 0 0 0-33-2.3A12 12 0 0 0 18 36z" />
          </svg>

          {/* Stylized Radiating Sun Gear */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 text-[#EA580C] animate-spin"
              style={{ animationDuration: '24s' }}
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M50 0 L58 14 L74 6 L72 23 L89 25 L79 39 L96 49 L81 58 L92 72 L75 75 L79 92 L62 86 L56 100 L44 88 L35 99 L31 82 L14 88 L18 71 L2 67 L13 53 L0 42 L16 34 L9 18 L26 19 L28 2 L42 12 Z" />
              <circle cx="50" cy="50" r="26" fill="#FBBF24" />
              <circle cx="50" cy="50" r="18" fill="#D97706" />
              <path
                d="M42 42 L58 58 M42 58 L58 42 M50 38 L50 62 M38 50 L62 50"
                stroke="#FDE68A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 3D Animated Solar Panel Mascot Character Standing on Grassy Island */}
        <div className="relative my-1 sm:my-2 transition-transform duration-500 ease-out flex flex-col items-center animate-float-slow">
          <div className="absolute bottom-4 w-40 sm:w-48 h-8 bg-sky-500/30 rounded-full blur-xl pointer-events-none"></div>

          <svg
            className="w-48 h-56 sm:w-68 sm:h-76 drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]"
            viewBox="0 0 240 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grassy Island */}
            <g transform="translate(20, 200)">
              <path d="M20 30 L100 55 L180 30 L100 12 Z" fill="#5C3A21" />
              <path d="M20 30 L100 55 L100 70 L20 45 Z" fill="#784825" />
              <path d="M100 55 L180 30 L180 45 L100 70 Z" fill="#523218" />
              <ellipse cx="100" cy="30" rx="82" ry="24" fill="#65A30D" />
              <ellipse cx="100" cy="27" rx="76" ry="20" fill="#84CC16" />
              <path
                d="M50 25 L53 18 L56 25 M140 22 L143 15 L146 22 M95 35 L98 28 L101 35"
                stroke="#4D7C0F"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* Legs & Shoes */}
            <g>
              <rect x="86" y="170" width="14" height="42" rx="7" fill="#1E3A8A" />
              <path d="M72 206 C72 198 82 196 94 196 C104 196 110 200 110 212 L70 212 Z" fill="#2563EB" />
              <path d="M68 212 L112 212 L112 218 L68 218 Z" fill="#FFFFFF" rx="2" />
              <path d="M70 208 C68 210 70 214 74 214 L74 206 Z" fill="#FFFFFF" />
              <line x1="86" y1="200" x2="94" y2="204" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <line x1="86" y1="204" x2="94" y2="208" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </g>

            <g>
              <rect x="138" y="170" width="14" height="42" rx="7" fill="#1E3A8A" />
              <path d="M128 206 C128 198 138 196 150 196 C160 196 166 200 166 212 L126 212 Z" fill="#2563EB" />
              <path d="M124 212 L168 212 L168 218 L124 218 Z" fill="#FFFFFF" rx="2" />
              <path d="M126 208 C124 210 126 214 130 214 L130 206 Z" fill="#FFFFFF" />
              <line x1="142" y1="200" x2="150" y2="204" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <line x1="142" y1="204" x2="150" y2="208" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Left Arm */}
            <g>
              <path d="M62 105 C40 115 36 140 45 160" stroke="#1E3A8A" strokeWidth="12" strokeLinecap="round" fill="none" />
              <circle cx="46" cy="164" r="11" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            </g>

            {/* Right Arm (Waving) */}
            <g className={step === 'greeting' ? 'animate-wave' : ''}>
              <path d="M178 105 C198 115 204 140 195 160" stroke="#1E3A8A" strokeWidth="12" strokeLinecap="round" fill="none" />
              <circle cx="194" cy="164" r="11" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            </g>

            {/* Solar Panel Face */}
            <rect x="62" y="40" width="116" height="140" rx="12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="4" />
            <rect x="68" y="46" width="104" height="128" rx="8" fill="#1E3A8A" />

            <line x1="88" y1="46" x2="88" y2="174" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
            <line x1="108" y1="46" x2="108" y2="174" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
            <line x1="132" y1="46" x2="132" y2="174" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
            <line x1="152" y1="46" x2="152" y2="174" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />

            <line x1="68" y1="72" x2="172" y2="72" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
            <line x1="68" y1="98" x2="172" y2="98" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
            <line x1="68" y1="124" x2="172" y2="124" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
            <line x1="68" y1="150" x2="172" y2="150" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />

            {/* Eyes */}
            <g>
              <ellipse cx="98" cy="92" rx="14" ry="18" fill="#FFFFFF" />
              <circle cx="101" cy="94" r="8" fill="#0F172A" />
              <circle cx="101" cy="94" r="5" fill="#0284C7" />
              <circle cx="104" cy="90" r="3" fill="#FFFFFF" />
            </g>

            <g>
              <ellipse cx="142" cy="92" rx="14" ry="18" fill="#FFFFFF" />
              <circle cx="139" cy="94" r="8" fill="#0F172A" />
              <circle cx="139" cy="94" r="5" fill="#0284C7" />
              <circle cx="136" cy="90" r="3" fill="#FFFFFF" />
            </g>

            <path d="M86 70 Q98 64 108 72" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M132 72 Q142 64 154 70" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            {/* Talking Mouth */}
            <g className={step === 'greeting' && isSpeaking ? 'animate-talk' : ''}>
              <path d="M100 126 Q120 152 140 126 Z" fill="#0F172A" />
              <path d="M110 138 Q120 134 130 138 Q120 148 110 138 Z" fill="#F43F5E" />
              <path d="M104 126 Q120 132 136 126 Z" fill="#FFFFFF" />
            </g>

            {/* MB Solar Hub Badge on Robot Chest */}
            <g transform="translate(85, 153)">
              <rect x="0" y="0" width="70" height="15" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
              <text x="35" y="11" textAnchor="middle" fill="#FBBF24" fontSize="8" fontWeight="bold" letterSpacing="0.5" fontFamily="sans-serif">MB SOLAR HUB</text>
            </g>
          </svg>

          {/* Mascot Name Badge Pill */}
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-900/90 via-sky-800/90 to-blue-900/90 border border-sky-400/50 px-3.5 py-1 rounded-full text-xs font-black text-amber-300 shadow-md backdrop-blur-md -mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Surya Bot — MB Solar Hub</span>
          </div>
        </div>

        {/* STEP 1: LANGUAGE SELECTION (Telugu, Hindi, English) */}
        {step === 'select_language' ? (
          <div className="w-full max-w-xs space-y-2.5 mt-1 animate-fadeIn">
            <p className="text-slate-300 font-medium text-xs sm:text-sm tracking-wide mb-2">
              Please select language / భాషను ఎంచుకోండి
            </p>

            {/* TELUGU BUTTON */}
            <button
              type="button"
              onClick={() => handleLanguageClick('te-IN')}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#EA580C] hover:brightness-110 active:scale-95 text-white font-black text-lg tracking-wider shadow-[0_6px_20px_rgba(234,88,12,0.5)] border border-orange-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>తెలుగు</span>
            </button>

            {/* HINDI BUTTON */}
            <button
              type="button"
              onClick={() => handleLanguageClick('hi-IN')}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#EA580C] hover:brightness-110 active:scale-95 text-white font-black text-lg tracking-wider shadow-[0_6px_20px_rgba(234,88,12,0.5)] border border-orange-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>हिन्दी</span>
            </button>

            {/* ENGLISH BUTTON */}
            <button
              type="button"
              onClick={() => handleLanguageClick('en-IN')}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#EA580C] hover:brightness-110 active:scale-95 text-white font-black text-base tracking-wider shadow-[0_6px_20px_rgba(234,88,12,0.5)] border border-orange-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <span>English</span>
            </button>

            <p className="text-[11px] text-slate-500 pt-1 flex items-center justify-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              <span>తెలుగు, हिन्दी & English AI Audio Guidance</span>
            </p>
          </div>
        ) : (
          /* STEP 2: MASCOT GREETS & TALKS IN CHOSEN LANGUAGE */
          <div className="w-full max-w-md space-y-4 mt-1 animate-fadeIn">
            <div className="bg-white/10 border border-sky-400/40 backdrop-blur-md rounded-2xl p-4 text-left shadow-lg relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {isSpeaking
                    ? chosenLang === 'te-IN'
                      ? 'సూర్య బోట్ మాట్లాడుతున్నారు...'
                      : chosenLang === 'hi-IN'
                      ? 'सूर्या बॉट बोल रहे हैं...'
                      : 'Surya Bot Speaking...'
                    : hasFinishedSpeech
                    ? chosenLang === 'te-IN'
                      ? 'పరిచయం పూర్తయింది!'
                      : chosenLang === 'hi-IN'
                      ? 'परिचय पूरा हुआ!'
                      : 'Intro Complete!'
                    : 'MB Solar Guide'}
                </span>
                <span className="text-[11px] text-sky-200 bg-white/10 px-2 py-0.5 rounded-full font-mono">
                  {isSpeaking ? 'Listening...' : 'Ready'}
                </span>
              </div>

              <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                {chosenLang === 'te-IN' ? (
                  <>
                    "నమస్కారం! నేను <span className="text-sky-300 font-bold">MB Solar Hub</span> నుండి మీ{' '}
                    <span className="text-amber-300 font-bold">సూర్య బోట్‌ని</span>. మీ ఇంటికి బెస్ట్ సోలార్ ప్లాంట్
                    మరియు <span className="text-emerald-400 font-bold">₹78,000 సబ్సిడీని</span> లెక్కిద్దాం. రండి, స్టార్ట్ చేద్దాం!"
                  </>
                ) : chosenLang === 'hi-IN' ? (
                  <>
                    "नमस्ते! मैं <span className="text-sky-300 font-bold">MB Solar Hub</span> से आपका{' '}
                    <span className="text-amber-300 font-bold">सूर्या बॉट</span> हूँ। आइए आपके घर के लिए सही सोलर प्लांट
                    और <span className="text-emerald-400 font-bold">₹78,000 सरकारी सब्सिडी</span> जानें। चलिए शुरू करते हैं!"
                  </>
                ) : (
                  <>
                    "Hello! I am <span className="text-amber-300 font-bold">Surya Bot</span> from{' '}
                    <span className="text-sky-300 font-bold">MB Solar Hub</span>. Let's calculate the perfect rooftop solar
                    system for your home and unlock your{' '}
                    <span className="text-emerald-400 font-bold">₹78,000 PM Surya Ghar subsidy</span>. Let's get started!"
                  </>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onProceedToCalculator(chosenLang)}
              className="w-full h-12 rounded-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:brightness-110 active:scale-95 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-[0_6px_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {hasFinishedSpeech
                  ? chosenLang === 'te-IN'
                    ? 'కాలిక్యులేటర్ ఓపెన్ అవుతోంది...'
                    : chosenLang === 'hi-IN'
                    ? 'कैलकुलेटर खुल रहा है...'
                    : 'Opening Solar Calculator...'
                  : chosenLang === 'te-IN'
                  ? 'సోలార్ కాలిక్యులేటర్ ప్రారంభించండి'
                  : chosenLang === 'hi-IN'
                  ? 'कैलकुलेटर शुरू करें'
                  : 'Open Solar Calculator'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Volume2, Sparkles, X, MessageSquareQuote } from 'lucide-react';
import type { CalculationResult } from '../types';
import type { SupportedLanguage } from '../hooks/useSpeech';

interface SolarRobotMascotProps {
  result: CalculationResult | null;
  onSpeak: () => void;
  isSpeaking: boolean;
  stateName?: string;
  voiceLang?: SupportedLanguage;
}

export const SolarRobotMascot: React.FC<SolarRobotMascotProps> = ({
  result,
  onSpeak,
  isSpeaking,
  stateName,
  voiceLang = 'en-IN',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const formatINR = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className="relative mb-6">
      {!isMinimized ? (
        <div className="bg-gradient-to-r from-sky-500/10 via-blue-600/10 to-amber-500/10 border-2 border-sky-300/60 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden backdrop-blur-xs flex flex-col sm:flex-row items-center gap-4">
          {/* Close / Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50 transition-colors cursor-pointer"
            title="Minimize Assistant"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Solar Robot Character (SVG) */}
          <div
            onClick={onSpeak}
            className="shrink-0 cursor-pointer group relative flex flex-col items-center"
            title="Click me to speak!"
          >
            {/* Glowing Aura Behind Robot */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-sky-400 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity animate-pulse"></div>

            <svg
              className="w-20 h-24 sm:w-24 sm:h-28 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              viewBox="0 0 120 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Solar Panel Hat / Array on Head */}
              <g className="animate-pulse">
                {/* Sun rays above panel */}
                <path d="M60 4 L60 10" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M42 8 L46 13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                <path d="M78 8 L74 13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

                {/* Solar Panel Base */}
                <rect x="36" y="10" width="48" height="12" rx="3" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
                {/* Solar Panel Cells */}
                <line x1="48" y1="10" x2="48" y2="22" stroke="#BAE6FD" strokeWidth="1" />
                <line x1="60" y1="10" x2="60" y2="22" stroke="#BAE6FD" strokeWidth="1" />
                <line x1="72" y1="10" x2="72" y2="22" stroke="#BAE6FD" strokeWidth="1" />
                <line x1="36" y1="16" x2="84" y2="16" stroke="#BAE6FD" strokeWidth="1" />
              </g>

              {/* Antenna Connector */}
              <rect x="56" y="22" width="8" height="6" fill="#64748B" rx="1" />

              {/* Robot Head */}
              <rect x="30" y="28" width="60" height="46" rx="16" fill="#FFFFFF" stroke="#015296" strokeWidth="3" />

              {/* Head Visor (Screen) */}
              <rect x="38" y="36" width="44" height="26" rx="8" fill="#0F172A" />

              {/* Glowing LED Eyes */}
              <circle cx="49" cy="48" r="4.5" fill="#38BDF8" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="49" cy="48" r="4" fill="#38BDF8" />
              <circle cx="51" cy="46" r="1.5" fill="#FFFFFF" />

              <circle cx="71" cy="48" r="4.5" fill="#38BDF8" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="71" cy="48" r="4" fill="#38BDF8" />
              <circle cx="73" cy="46" r="1.5" fill="#FFFFFF" />

              {/* Happy Smile / Active Animated Mouth when Speaking */}
              {isSpeaking ? (
                <g className="animate-talk-bot">
                  <ellipse cx="60" cy="57" rx="7" ry="4.5" fill="#38BDF8" />
                  <ellipse cx="60" cy="57" rx="4.5" ry="2.5" fill="#0F172A" />
                </g>
              ) : (
                <path d="M54 56 Q60 60 66 56" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
              )}

              {/* Cheerful Blush */}
              <circle cx="41" cy="54" r="2.5" fill="#F43F5E" opacity="0.6" />
              <circle cx="79" cy="54" r="2.5" fill="#F43F5E" opacity="0.6" />

              {/* Neck */}
              <rect x="53" y="74" width="14" height="6" rx="2" fill="#94A3B8" />

              {/* Body */}
              <rect x="34" y="80" width="52" height="40" rx="12" fill="#F0F9FF" stroke="#015296" strokeWidth="3" />

              {/* Center Solar Emblem / Battery Indicator */}
              <circle cx="60" cy="100" r="11" fill="#015296" />
              <path d="M60 93 L63 98 L58 101 L62 101 L57 107 L59 102 L64 102 Z" fill="#FBBF24" />

              {/* Left Arm (Resting) */}
              <rect x="18" y="86" width="12" height="22" rx="6" fill="#FFFFFF" stroke="#015296" strokeWidth="2.5" />

              {/* Right Arm (Waving!) */}
              <g className="origin-top-left transition-transform duration-500" style={{ transformOrigin: '90px 88px' }}>
                <rect x="90" y="72" width="12" height="24" rx="6" fill="#FFFFFF" stroke="#015296" strokeWidth="2.5" transform="rotate(-30 90 72)" />
                <circle cx="106" cy="62" r="5" fill="#38BDF8" />
              </g>

              {/* Wheels / Hover Base */}
              <ellipse cx="60" cy="126" rx="20" ry="6" fill="#0369A1" />
              <ellipse cx="60" cy="129" rx="12" ry="3" fill="#38BDF8" opacity="0.8" className="animate-pulse" />
            </svg>

            <span className="text-[10px] font-extrabold text-[#015296] bg-sky-100/80 px-2 py-0.5 rounded-full mt-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              Surya Bot
            </span>
          </div>

          {/* Speech Bubble / Dynamic Dialogue */}
          <div className="flex-1 text-left bg-white border border-sky-200/80 rounded-2xl p-4 shadow-xs relative">
            {/* Bubble Tail */}
            <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l border-b border-sky-200/80 transform rotate-45"></div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareQuote className="w-4 h-4 text-amber-500" />
                {voiceLang === 'te-IN'
                  ? 'సూర్య బోట్ — MB Solar Hub'
                  : voiceLang === 'hi-IN'
                  ? 'सूर्या बॉट — MB Solar Hub'
                  : 'Surya Bot — MB Solar Hub'}
              </span>
              <button
                onClick={onSpeak}
                className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-amber-400 text-slate-900 animate-pulse'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {isSpeaking
                    ? voiceLang === 'te-IN'
                      ? 'మాట్లాడుతున్నాను...'
                      : voiceLang === 'hi-IN'
                      ? 'बोल रहे हैं...'
                      : 'Speaking...'
                    : voiceLang === 'te-IN'
                    ? 'వినండి'
                    : voiceLang === 'hi-IN'
                    ? 'सुनें'
                    : 'Speak'}
                </span>
              </button>
            </div>

            {result ? (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {result.subsidyCost > 0 ? (
                  voiceLang === 'te-IN' ? (
                    <>
                      "నమస్కారం! నేను <span className="font-bold text-[#015296]">MB Solar Hub</span> నుండి <span className="font-bold text-amber-600">సూర్య బోట్ (Surya Bot)</span>. మీ <span className="font-bold text-[#015296]">{stateName || 'ప్రాంతం'}</span>లో కరెంట్ బిల్లు ప్రకారం,{' '}
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        {result.capacity.toFixed(1)} kW సోలార్ ప్లాంట్
                      </span>{' '}
                      అత్యంత అనుకూలం! మీరు{' '}
                      <span className="font-extrabold text-emerald-600">
                        {formatINR(result.subsidyCost)} పీఎం సూర్య ఘర్ సబ్సిడీ
                      </span>
                      కి అర్హులు. మీ నికర ఖర్చు {formatINR(result.consumerShare)} మాత్రమే, ప్రతి సంవత్సరం{' '}
                      <span className="font-bold text-slate-900">{formatINR(result.savingYear)}</span> ఆదా అవుతుంది ({result.payBack.toFixed(1)} ఏళ్లలో పెట్టుబడి రికవరీ)!"
                    </>
                  ) : voiceLang === 'hi-IN' ? (
                    <>
                      "नमस्ते! मैं <span className="font-bold text-[#015296]">MB Solar Hub</span> से <span className="font-bold text-amber-600">सूर्या बॉट (Surya Bot)</span> हूँ। आपके <span className="font-bold text-[#015296]">{stateName || 'राज्य'}</span> में बिजली बिल के अनुसार,{' '}
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        {result.capacity.toFixed(1)} kW सोलर प्लांट
                      </span>{' '}
                      आदर्श है! आपको{' '}
                      <span className="font-extrabold text-emerald-600">
                        {formatINR(result.subsidyCost)} पीएम सूर्य घर सब्सिडी
                      </span>{' '}
                      मिलेगी। आपका शुद्ध निवेश {formatINR(result.consumerShare)} है, जिससे हर साल{' '}
                      <span className="font-bold text-slate-900">{formatINR(result.savingYear)}</span> की बचत होगी!"
                    </>
                  ) : (
                    <>
                      "Hello! I am <span className="font-bold text-amber-600">Surya Bot</span> from <span className="font-bold text-[#015296]">MB Solar Hub</span>. Based on your bill in <span className="font-bold text-[#015296]">{stateName || 'your area'}</span>, a{' '}
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        {result.capacity.toFixed(1)} kW Solar Plant
                      </span>{' '}
                      is ideal! You are eligible for{' '}
                      <span className="font-extrabold text-emerald-600">
                        {formatINR(result.subsidyCost)} PM Surya Ghar Subsidy
                      </span>
                      . Your net cost is {formatINR(result.consumerShare)}, saving you{' '}
                      <span className="font-bold text-slate-900">{formatINR(result.savingYear)}</span> every year with a{' '}
                      <span className="font-bold text-sky-700">{result.payBack.toFixed(1)} yr payback</span>!"
                    </>
                  )
                ) : (
                  /* Commercial / Non-Residential with 40% Accelerated Depreciation */
                  voiceLang === 'te-IN' ? (
                    <>
                      "నమస్కారం! నేను <span className="font-bold text-[#015296]">MB Solar Hub</span> నుండి <span className="font-bold text-amber-600">సూర్య బోట్</span>. మీ వాణిజ్య విద్యుత్ వినియోగానికి{' '}
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        {result.capacity.toFixed(1)} kW సోలార్ ప్లాంట్
                      </span>{' '}
                      సిఫార్సు చేస్తున్నాము. కమర్షియల్ ప్రాజెక్ట్‌లకు సెక్షన్ 32 కింద{' '}
                      <span className="font-extrabold text-amber-700">
                        40% యాక్సిలరేటెడ్ డిప్రిసియేషన్ పన్ను మినహాయింపు (~{formatINR(result.projectCost * 0.4)})
                      </span>{' '}
                      లభిస్తుంది! ప్రతి సంవత్సరం{' '}
                      <span className="font-bold text-slate-900">{formatINR(result.savingYear)}</span> ఆదా అవుతుంది ({result.payBack.toFixed(1)} ఏళ్లలో పెట్టుబడి రికవరీ)!"
                    </>
                  ) : voiceLang === 'hi-IN' ? (
                    <>
                      "नमस्ते! मैं <span className="font-bold text-[#015296]">MB Solar Hub</span> से <span className="font-bold text-amber-600">सूर्या बॉट</span> हूँ। आपके कमर्शियल बिजली उपयोग के लिए{' '}
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        {result.capacity.toFixed(1)} kW सोलर प्लांट
                      </span>{' '}
                      आदर्श है। आपको आयकर धारा 32 के तहत{' '}
                      <span className="font-extrabold text-amber-700">
                        40% त्वरित मूल्यह्रास (Accelerated Depreciation) टैक्स छूट (~{formatINR(result.projectCost * 0.4)})
                      </span>{' '}
                      मिलती है! हर साल <span className="font-bold text-slate-900">{formatINR(result.savingYear)}</span> की भारी बचत होगी ({result.payBack.toFixed(1)} साल में पेबैक)!"
                    </>
                  ) : (
                    <>
                      "Hello! I am <span className="font-bold text-amber-600">Surya Bot</span> from <span className="font-bold text-[#015296]">MB Solar Hub</span>. For your commercial facility, a{' '}
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        {result.capacity.toFixed(1)} kW Solar Plant
                      </span>{' '}
                      is optimal! Your enterprise qualifies for{' '}
                      <span className="font-extrabold text-amber-700">
                        40% Accelerated Depreciation Tax Benefit
                      </span>{' '}
                      under Section 32 (~{formatINR(result.projectCost * 0.4)} Year-1 tax deduction), saving you{' '}
                      <span className="font-bold text-slate-900">{formatINR(result.savingYear)}</span> every year with a{' '}
                      <span className="font-bold text-sky-700">{result.payBack.toFixed(1)} yr payback</span>!"
                    </>
                  )
                )}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {voiceLang === 'te-IN'
                  ? 'నమస్కారం! నేను MB Solar Hub నుండి సూర్య బోట్ (Surya Bot). మీ నెలవారీ కరెంట్ బిల్లును నమోదు చేయండి, నేను తక్షణమే మీ సోలార్ సామర్థ్యం, ప్రభుత్వ సబ్సిడీ మరియు పొదుపును లెక్కిస్తాను!'
                  : voiceLang === 'hi-IN'
                  ? 'नमस्ते! मैं MB Solar Hub से सूर्या बॉट (Surya Bot) हूँ। अपना मासिक बिजली बिल दर्ज करें, और मैं तुरंत आपके लिए सोलर प्लांट, सरकारी सब्सिडी और बचत की गणना करूँगा!'
                  : 'Hello! I am Surya Bot from MB Solar Hub. Enter your monthly electricity bill, and I will instantly calculate your optimal solar capacity, government subsidy, and monthly savings!'}
              </p>
            )}

            <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>
                {voiceLang === 'te-IN'
                  ? 'మీ వ్యక్తిగత విశ్లేషణ వినడానికి రోబోట్ లేదా స్పీక్ బటన్‌ను ఎప్పుడైనా క్లిక్ చేయండి!'
                  : voiceLang === 'hi-IN'
                  ? 'अपना व्यक्तिगत विश्लेषण सुनने के लिए कभी भी रोबोट या स्पीक बटन पर क्लिक करें!'
                  : 'Click the robot or the speak button anytime to hear your personalized analysis!'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Minimized Floating Bot Trigger */
        <button
          onClick={() => setIsMinimized(false)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Show Sunny Robot Assistant</span>
        </button>
      )}
    </div>
  );
};


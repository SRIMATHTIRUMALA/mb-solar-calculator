import React from 'react';
import { X, Volume2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import type { CalculationResult } from '../types';
import type { SupportedLanguage } from '../hooks/useSpeech';

interface RobotExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult | null;
  stateName?: string;
  onOpenVendorModal: () => void;
  isSpeaking: boolean;
  onReplaySpeech: () => void;
  voiceLang: SupportedLanguage;
}

export const RobotExplanationModal: React.FC<RobotExplanationModalProps> = ({
  isOpen,
  onClose,
  result,
  stateName,
  onOpenVendorModal,
  isSpeaking,
  onReplaySpeech,
  voiceLang,
}) => {
  if (!isOpen || !result) return null;

  const formatINR = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-sky-500/30 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot & Explanation Header */}
        <div className="flex flex-col items-center text-center relative z-10">
          {/* Animated Solar Mascot SVG (Waving & Talking) */}
          <div className="relative mb-2">
            <svg
              className="w-36 h-40 drop-shadow-[0_10px_20px_rgba(2,132,199,0.4)] animate-float-slow"
              viewBox="0 0 240 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Floating Island Base */}
              <ellipse cx="120" cy="230" rx="70" ry="18" fill="#65A30D" />
              <ellipse cx="120" cy="227" rx="64" ry="14" fill="#84CC16" />

              {/* Legs */}
              <rect x="100" y="160" width="12" height="36" rx="6" fill="#1E3A8A" />
              <path d="M88 190 C88 184 96 182 106 182 C114 182 118 186 118 196 L86 196 Z" fill="#2563EB" />
              <path d="M84 196 L120 196 L120 200 L84 200 Z" fill="#FFFFFF" rx="2" />

              <rect x="136" y="160" width="12" height="36" rx="6" fill="#1E3A8A" />
              <path d="M128 190 C128 184 136 182 146 182 C154 182 158 186 158 196 L126 196 Z" fill="#2563EB" />
              <path d="M124 196 L160 196 L160 200 L124 200 Z" fill="#FFFFFF" rx="2" />

              {/* Left Arm */}
              <path d="M80 95 C62 105 58 125 66 142" stroke="#1E3A8A" strokeWidth="10" strokeLinecap="round" fill="none" />
              <circle cx="68" cy="146" r="9" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />

              {/* Right Arm (Waving!) */}
              <g className="animate-wave">
                <path d="M168 95 C186 105 190 125 182 142" stroke="#1E3A8A" strokeWidth="10" strokeLinecap="round" fill="none" />
                <circle cx="180" cy="146" r="9" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              </g>

              {/* Solar Panel Face */}
              <rect x="80" y="36" width="90" height="116" rx="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
              <rect x="85" y="41" width="80" height="106" rx="7" fill="#1E3A8A" />

              {/* Grid Lines */}
              <line x1="102" y1="41" x2="102" y2="147" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
              <line x1="125" y1="41" x2="125" y2="147" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
              <line x1="147" y1="41" x2="147" y2="147" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
              <line x1="85" y1="68" x2="165" y2="68" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
              <line x1="85" y1="95" x2="165" y2="95" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
              <line x1="85" y1="122" x2="165" y2="122" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />

              {/* Eyes */}
              <ellipse cx="108" cy="80" rx="11" ry="14" fill="#FFFFFF" />
              <circle cx="110" cy="82" r="6" fill="#0F172A" />
              <circle cx="110" cy="82" r="4" fill="#0284C7" />
              <circle cx="112" cy="78" r="2.5" fill="#FFFFFF" />

              <ellipse cx="142" cy="80" rx="11" ry="14" fill="#FFFFFF" />
              <circle cx="140" cy="82" r="6" fill="#0F172A" />
              <circle cx="140" cy="82" r="4" fill="#0284C7" />
              <circle cx="138" cy="78" r="2.5" fill="#FFFFFF" />

              {/* Talking Mouth */}
              <g className={isSpeaking ? 'animate-talk' : ''}>
                <path d="M112 110 Q125 128 138 110 Z" fill="#0F172A" />
                <path d="M118 118 Q125 116 132 118 Q125 125 118 118 Z" fill="#F43F5E" />
                <path d="M115 110 Q125 114 135 110 Z" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Speech Dialogue Header */}
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {voiceLang === 'te-IN'
              ? 'సూర్య బోట్ (MB Solar Hub) మీ సోలార్ ప్లాన్‌ను వివరిస్తున్నాడు!'
              : voiceLang === 'hi-IN'
              ? 'सूर्या बॉट (MB Solar Hub) आपके सोलर प्लान को समझा रहे हैं!'
              : 'Surya Bot (MB Solar Hub) Explains Your Solar Plan!'}
          </div>

          <p className="text-xs sm:text-sm text-sky-100 max-w-md leading-relaxed mb-4">
            {result.subsidyCost > 0 ? (
              voiceLang === 'te-IN' ? (
                <>
                  "అద్భుతం! నేను <span className="text-amber-300 font-bold">MB Solar Hub నుండి సూర్య బోట్ (Surya Bot)</span>. మీ{' '}
                  <span className="text-amber-300 font-bold">{stateName || 'ప్రాంతం'}</span>లో కరెంట్ బిల్లు ప్రకారం, మేము{' '}
                  <span className="text-amber-300 font-black text-base">{result.capacity.toFixed(1)} kW సోలార్ ప్లాంట్</span> సిఫార్సు చేస్తున్నాము. మీరు{' '}
                  <span className="text-emerald-400 font-black text-base">{formatINR(result.subsidyCost)} పీఎం సూర్య ఘర్ సబ్సిడీ</span> పొందుతారు!"
                </>
              ) : voiceLang === 'hi-IN' ? (
                <>
                  "शानदार! मैं <span className="text-amber-300 font-bold">MB Solar Hub से सूर्या बॉट (Surya Bot)</span> हूँ। आपके{' '}
                  <span className="text-amber-300 font-bold">{stateName || 'राज्य'}</span> में मासिक बिजली खपत के अनुसार, हमने{' '}
                  <span className="text-amber-300 font-black text-base">{result.capacity.toFixed(1)} kW सोलर प्लांट</span> तैयार किया है। आपको{' '}
                  <span className="text-emerald-400 font-black text-base">{formatINR(result.subsidyCost)} पीएम सूर्य घर सब्सिडी</span> मिलेगी!"
                </>
              ) : (
                <>
                  "Great news! I am <span className="text-amber-300 font-bold">Surya Bot from MB Solar Hub</span>. Based on your electricity bill in{' '}
                  <span className="text-amber-300 font-bold">{stateName || 'your area'}</span>, we recommend a{' '}
                  <span className="text-amber-300 font-black text-base">{result.capacity.toFixed(1)} kW Solar Plant</span>. You qualify for a{' '}
                  <span className="text-emerald-400 font-black text-base">{formatINR(result.subsidyCost)} PM Surya Ghar Subsidy</span>!"
                </>
              )
            ) : (
              /* Commercial / Office: Show 40% Accelerated Depreciation instead of "₹0 Subsidy" */
              voiceLang === 'te-IN' ? (
                <>
                  "అద్భుతం! నేను <span className="text-amber-300 font-bold">MB Solar Hub నుండి సూర్య బోట్</span>. మీ{' '}
                  <span className="text-amber-300 font-bold">{stateName || 'ప్రాంతం'}</span>లో వాణిజ్య వినియోగానికి మేము{' '}
                  <span className="text-amber-300 font-black text-base">{result.capacity.toFixed(1)} kW సోలార్ ప్లాంట్</span> సిఫార్సు చేస్తున్నాము. కమర్షియల్ ప్రాజెక్ట్‌లకు సెక్షన్ 32 కింద{' '}
                  <span className="text-amber-400 font-black text-base">40% యాక్సిలరేటెడ్ డిప్రిసియేషన్ పన్ను మినహాయింపు (~{formatINR(result.projectCost * 0.4)})</span> లభిస్తుంది!"
                </>
              ) : voiceLang === 'hi-IN' ? (
                <>
                  "शानदार! मैं <span className="text-amber-300 font-bold">MB Solar Hub से सूर्या बॉट</span> हूँ। आपके{' '}
                  <span className="text-amber-300 font-bold">{stateName || 'राज्य'}</span> में कमर्शियल बिजली के लिए हमने{' '}
                  <span className="text-amber-300 font-black text-base">{result.capacity.toFixed(1)} kW सोलर प्लांट</span> तैयार किया है। कमर्शियल प्रतिष्ठानों को आयकर धारा 32 के तहत{' '}
                  <span className="text-amber-400 font-black text-base">40% त्वरित मूल्यह्रास (Accelerated Depreciation) टैक्स छूट (~{formatINR(result.projectCost * 0.4)})</span> का लाभ मिलता है!"
                </>
              ) : (
                <>
                  "Great news! I am <span className="text-amber-300 font-bold">Surya Bot from MB Solar Hub</span>. For your commercial facility in{' '}
                  <span className="text-amber-300 font-bold">{stateName || 'your area'}</span>, we recommend a{' '}
                  <span className="text-amber-300 font-black text-base">{result.capacity.toFixed(1)} kW Solar Plant</span>. Your business qualifies for{' '}
                  <span className="text-amber-400 font-black text-base">40% Accelerated Depreciation Tax Benefit</span> under Section 32 (saving ~{formatINR(result.projectCost * 0.4)} in Year 1 tax write-offs)!"
                </>
              )
            )}
          </p>

          {/* Key Metrics Highlight Grid */}
          <div className="grid grid-cols-2 gap-2.5 w-full mb-5 text-left">
            <div className="bg-white/10 border border-white/15 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {voiceLang === 'te-IN' ? 'మొత్తం ఖర్చు' : voiceLang === 'hi-IN' ? 'कुल लागत' : 'Gross Cost'}
              </span>
              <span className="text-base font-black text-white">{formatINR(result.projectCost)}</span>
            </div>

            {/* Metric 2: Subsidy for Residential/GHS OR Tax Benefit for Commercial */}
            {result.subsidyCost > 0 ? (
              <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-3">
                <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                  {voiceLang === 'te-IN' ? 'ప్రభుత్వ సబ్సిడీ' : voiceLang === 'hi-IN' ? 'सरकारी सब्सिडी' : 'Govt Subsidy'}
                </span>
                <span className="text-base font-black text-emerald-400">{formatINR(result.subsidyCost)}</span>
              </div>
            ) : (
              <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-3">
                <span className="text-[10px] text-amber-300 uppercase font-bold block">
                  {voiceLang === 'te-IN' ? 'పన్ను ప్రయోజనం (Sec 32)' : voiceLang === 'hi-IN' ? 'टैक्स लाभ (Sec 32)' : 'Tax Benefit (Sec 32)'}
                </span>
                <span className="text-base font-black text-amber-300">40% Write-Off</span>
                <span className="text-[10px] text-amber-200/80 block mt-0.5">~{formatINR(result.projectCost * 0.4)} Tax Save</span>
              </div>
            )}

            <div className="bg-sky-500/20 border border-sky-400/40 rounded-xl p-3">
              <span className="text-[10px] text-sky-300 uppercase font-bold block">
                {result.subsidyCost > 0
                  ? voiceLang === 'te-IN' ? 'మీ నికర ఖర్చు' : voiceLang === 'hi-IN' ? 'आपका शुद्ध निवेश' : 'Your Net Cost'
                  : voiceLang === 'te-IN' ? 'పెట్టుబడి మొత్తం' : voiceLang === 'hi-IN' ? 'कुल निवेश' : 'Capital Investment'}
              </span>
              <span className="text-base font-black text-sky-300">{formatINR(result.consumerShare)}</span>
              {result.subsidyCost <= 0 && (
                <span className="text-[10px] text-sky-200/80 block mt-0.5">Recovers in {result.payBack.toFixed(1)} yrs</span>
              )}
            </div>

            <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-3">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                {voiceLang === 'te-IN' ? 'వార్షిక ఆదా' : voiceLang === 'hi-IN' ? 'वार्षिक बचत' : 'Yearly Savings'}
              </span>
              <span className="text-base font-black text-emerald-400">{formatINR(result.savingYear)} / yr</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2.5">
            {/* Find Vendors button */}
            <button
              onClick={() => {
                onClose();
                onOpenVendorModal();
              }}
              className="w-full bg-[#63c153] hover:bg-[#52ad43] active:scale-95 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {voiceLang === 'te-IN'
                  ? 'MB సోలార్ హబ్‌లో వెండర్లను కనుగొనండి'
                  : 'Find Verified Vendors on MB Solar Hub'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* View Full Dashboard & Slider */}
            <div className="flex gap-2 w-full">
              <button
                onClick={onReplaySpeech}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isSpeaking
                    ? 'Speaking...'
                    : voiceLang === 'te-IN'
                    ? 'మళ్లీ వినండి'
                    : voiceLang === 'hi-IN'
                    ? 'फिर से सुनें'
                    : 'Listen Again'}
                </span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all cursor-pointer"
              >
                {voiceLang === 'te-IN' ? 'పూర్తి వివరాలు చూడండి' : 'Explore Details & Fine-Tune'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

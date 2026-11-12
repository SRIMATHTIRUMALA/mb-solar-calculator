import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, X, Sparkles, Volume2, ArrowDown, ArrowUp, Bot } from 'lucide-react';
import type { SupportedLanguage } from '../hooks/useSpeech';

interface TourStep {
  targetId: string;
  stepNumber: number;
  title: Record<string, string>;
  desc: Record<string, string>;
  buttonText: Record<string, string>;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-step-state',
    stepNumber: 1,
    title: {
      'te-IN': '1. మీ రాష్ట్రాన్ని ఎంచుకోండి (Select State)',
      'en-IN': '1. Select Your State / UT',
      'hi-IN': '1. अपना राज्य चुनें (Select State)',
    },
    desc: {
      'te-IN': 'మీ రాష్ట్రం ఆధారంగా స్థానిక డిస్కమ్ (DISCOM) విద్యుత్ ఛార్జీలు మరియు సూర్యకాంతి సమయం ఖచ్చితంగా సెట్ అవుతాయి.',
      'en-IN': 'Choose your state to apply accurate regional DISCOM electricity tariffs and solar sunlight hours.',
      'hi-IN': 'अपने राज्य का चयन करें ताकि सटीक बिजली दरें और धूप के घंटे लागू हो सकें।',
    },
    buttonText: {
      'te-IN': 'Got it! తరువాత →',
      'en-IN': 'Got it / Next →',
      'hi-IN': 'समझ गए / आगे बढ़ें →',
    },
  },
  {
    targetId: 'tour-step-category',
    stepNumber: 2,
    title: {
      'te-IN': '2. కేటగిరీని ఎంచుకోండి (Select Category)',
      'en-IN': '2. Choose Customer Category',
      'hi-IN': '2. श्रेणी चुनें (Select Category)',
    },
    desc: {
      'te-IN': 'గృహ వినియోగదారులకు (Residential) ₹78,000 వరకు PM సూర్య ఘర్ ప్రభుత్వ సబ్సిడీ లభిస్తుంది. వాణిజ్య సంస్థలకు 40% పన్ను మినహాయింపు (Tax Write-Off) ఉంటుంది.',
      'en-IN': 'Select Residential for up to ₹78,000 PM Surya Ghar central subsidy, or Commercial for 40% Accelerated Depreciation tax benefit.',
      'hi-IN': 'घर के लिए ₹78,000 तक सरकारी सब्सिडी, या वाणिज्यिक के लिए 40% टैक्स छूट चुनें।',
    },
    buttonText: {
      'te-IN': 'Got it! తరువాత →',
      'en-IN': 'Got it / Next →',
      'hi-IN': 'समझ गए / आगे बढ़ें →',
    },
  },
  {
    targetId: 'tour-step-bill',
    stepNumber: 3,
    title: {
      'te-IN': '3. కరెంట్ బిల్లు నమోదు చేయండి (Enter Bill)',
      'en-IN': '3. Monthly Electricity Bill',
      'hi-IN': '3. मासिक बिजली बिल (Enter Bill)',
    },
    desc: {
      'te-IN': 'మీ సగటు నెలవారీ కరెంట్ బిల్లు టైప్ చేయండి లేదా క్రింద ఉన్న ₹1,500, ₹2,500, ₹3,500 క్విక్ బటన్లపై క్లిక్ చేయండి.',
      'en-IN': 'Enter your monthly electricity bill or click any quick preset button (₹1,500, ₹2,500, ₹3,500) to auto-size your system.',
      'hi-IN': 'अपना मासिक बिजली बिल टाइप करें या त्वरित प्रीसेट बटन पर क्लिक करें।',
    },
    buttonText: {
      'te-IN': 'Got it! తరువాత →',
      'en-IN': 'Got it / Next →',
      'hi-IN': 'समझ गए / आगे बढ़ें →',
    },
  },
  {
    targetId: 'tour-step-submit',
    stepNumber: 4,
    title: {
      'te-IN': '4. ఫలితాల కోసం క్లిక్ చేయండి! (Calculate)',
      'en-IN': '4. Click to Get Solar Results!',
      'hi-IN': '4. परिणाम देखने के लिए क्लिक करें!',
    },
    desc: {
      'te-IN': 'ఈ బటన్ పై క్లిక్ చేయగానే మీ సోలార్ సామర్థ్యం (kW), ₹78,000 సబ్సిడీ, మొత్తం ఖర్చు మరియు 25 ఏళ్ల కరెంట్ ఆదా తక్షణమే కనిపిస్తాయి!',
      'en-IN': 'Click this button to see your exact solar system size (kW), ₹78,000 subsidy, net cost, and 25-year bill savings!',
      'hi-IN': 'इस बटन पर क्लिक करते ही आपका सोलर साइज, ₹78,000 सब्सिडी और 25 साल की बचत तुरंत दिखाई देगी!',
    },
    buttonText: {
      'te-IN': 'Got it! ఫలితాలు చూడండి 🚀',
      'en-IN': "Got it! Let's Calculate 🚀",
      'hi-IN': 'समझ गए! गणना करें 🚀',
    },
  },
];

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteAndCalculate: () => void;
  voiceLang: SupportedLanguage;
  speakTourStep: (stepNumber: number, lang: SupportedLanguage) => void;
  stopSpeech: () => void;
}

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  isOpen,
  onClose,
  onCompleteAndCalculate,
  voiceLang,
  speakTourStep,
  stopSpeech,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [popoverPos, setPopoverPos] = useState<'top' | 'bottom'>('bottom');
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Update target element positioning and highlighting
  const updateTargetPosition = () => {
    if (!step) return;
    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add glowing pulse border on the target element
      document.querySelectorAll('.tour-highlighted-element').forEach((node) => {
        node.classList.remove('tour-highlighted-element', 'ring-4', 'ring-amber-400', 'ring-offset-2', 'ring-offset-white', 'shadow-xl', 'rounded-xl');
      });
      el.classList.add('tour-highlighted-element', 'ring-4', 'ring-amber-400', 'ring-offset-2', 'ring-offset-white', 'shadow-xl', 'rounded-xl');

      const rect = el.getBoundingClientRect();

      // Decide if popover goes below or above
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 280 && rect.top > 280) {
        setPopoverPos('top');
      } else {
        setPopoverPos('bottom');
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Remove any highlight classes
      document.querySelectorAll('.tour-highlighted-element').forEach((node) => {
        node.classList.remove('tour-highlighted-element', 'ring-4', 'ring-amber-400', 'ring-offset-2', 'ring-offset-white', 'shadow-xl', 'rounded-xl');
      });
      return;
    }

    // Scroll & position after DOM paints
    const timer = setTimeout(() => {
      updateTargetPosition();
      // Speak lively audio instruction for this step
      speakTourStep(step.stepNumber, voiceLang);
    }, 150);

    const handleResize = () => updateTargetPosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen, currentStepIndex, voiceLang]);

  const handleNext = () => {
    stopSpeech();
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Final step: finish tour and submit calculation!
      handleClose();
      onCompleteAndCalculate();
    }
  };

  const handleBack = () => {
    stopSpeech();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    stopSpeech();
    document.querySelectorAll('.tour-highlighted-element').forEach((node) => {
      node.classList.remove('tour-highlighted-element', 'ring-4', 'ring-amber-400', 'ring-offset-2', 'ring-offset-white', 'shadow-xl', 'rounded-xl');
    });
    onClose();
  };

  const handleReplayVoice = () => {
    speakTourStep(step.stepNumber, voiceLang);
  };

  if (!isOpen || !step) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 pointer-events-auto bg-slate-950/60 backdrop-blur-[2px] transition-all duration-300 flex flex-col justify-end sm:justify-center items-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Surrounding backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Popover Card */}
      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-amber-400/80 p-5 sm:p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#015296] to-sky-500 flex items-center justify-center text-white shadow-md relative">
              <Bot className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#015296] bg-blue-50 px-2 py-0.5 rounded-full">
                  Surya Bot Guide
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Step {step.stepNumber} of {TOUR_STEPS.length}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5 leading-tight">
                {step.title[voiceLang] || step.title['en-IN']}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
            title="Close / Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Pointing Arrow Indicator */}
        <div className="flex items-center justify-center py-2 bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 rounded-xl my-3 border border-amber-200/60">
          <div className="flex items-center gap-2 text-xs font-black text-amber-900">
            {popoverPos === 'bottom' ? (
              <>
                <ArrowUp className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>సూర్య బోట్ ఈ క్రింది విభాగాన్ని సూచిస్తున్నారు 👇</span>
                <ArrowDown className="w-4 h-4 text-amber-600 animate-bounce" />
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>సూర్య బోట్ ఈ విభాగాన్ని సూచిస్తున్నారు 👆</span>
                <ArrowUp className="w-4 h-4 text-amber-600 animate-bounce" />
              </>
            )}
          </div>
        </div>

        {/* Step Description */}
        <div className="py-2">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            {step.desc[voiceLang] || step.desc['en-IN']}
          </p>
          {voiceLang === 'te-IN' && (
            <p className="text-xs text-slate-500 font-medium mt-1.5 italic">
              English: {step.desc['en-IN']}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2.5 mt-2">
          {/* Re-play voice button */}
          <button
            type="button"
            onClick={handleReplayVoice}
            className="flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-2 rounded-xl transition-all border border-sky-200 cursor-pointer"
            title="Replay energetic voice guidance"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-600" />
            <span>వినండి (Listen)</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>వెనుకకు</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#015296] to-sky-600 hover:brightness-110 active:scale-95 px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{step.buttonText[voiceLang] || step.buttonText['en-IN']}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

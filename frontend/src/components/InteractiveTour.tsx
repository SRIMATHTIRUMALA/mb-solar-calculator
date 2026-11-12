import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Volume2, ArrowDown, Bot, CheckCircle } from 'lucide-react';
import type { SupportedLanguage } from '../hooks/useSpeech';

interface TourStep {
  targetId: string;
  stepNumber: number;
  title: Record<string, string>;
  actionPrompt: Record<string, string>;
  desc: Record<string, string>;
  buttonText: Record<string, string>;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-step-state',
    stepNumber: 1,
    title: {
      'te-IN': '1. మీ రాష్ట్రాన్ని ఎంచుకోండి',
      'en-IN': '1. Select Your State / UT',
      'hi-IN': '1. अपना राज्य चुनें',
    },
    actionPrompt: {
      'te-IN': 'క్రింద ఉన్న డ్రాప్‌డౌన్ నుండి మీ రాష్ట్రాన్ని ఎంచుకుని "Got it" క్లిక్ చేయండి 👇',
      'en-IN': 'Select your state from the dropdown below, then click "Got it" 👇',
      'hi-IN': 'नीचे दिए गए ड्रॉपडाउन से अपना राज्य चुनें और "Got it" पर क्लिक करें 👇',
    },
    desc: {
      'te-IN': 'మీ రాష్ట్రం ఆధారంగా DISCOM విద్యుత్ ధరలు మరియు సూర్యకాంతి సమయం ఖచ్చితంగా సెట్ అవుతాయి.',
      'en-IN': 'Applies your state DISCOM electricity tariffs and solar sunlight hours.',
      'hi-IN': 'सटीक बिजली दरें और धूप के घंटे सेट करता है।',
    },
    buttonText: {
      'te-IN': 'Got it! తరువాత →',
      'en-IN': 'Got it! Next →',
      'hi-IN': 'Got it! आगे बढ़ें →',
    },
  },
  {
    targetId: 'tour-step-category',
    stepNumber: 2,
    title: {
      'te-IN': '2. కేటగిరీని ఎంచుకోండి',
      'en-IN': '2. Select Customer Category',
      'hi-IN': '2. अपनी श्रेणी चुनें',
    },
    actionPrompt: {
      'te-IN': 'ఇంటి కోసమైతే రెసిడెన్షియల్ (₹78,000 సబ్సిడీ) ఎంచుకోండి 👇',
      'en-IN': 'Select Residential for ₹78,000 subsidy, or Commercial for tax savings 👇',
      'hi-IN': 'घर के लिए आवासीय (₹78,000 सब्सिडी) चुनें 👇',
    },
    desc: {
      'te-IN': 'గృహ వినియోగదారులకు ₹78,000 వరకు PM సూర్య ఘర్ సబ్సిడీ వస్తుంది. వ్యాపారాలకు 40% పన్ను మినహాయింపు ఉంటుంది.',
      'en-IN': 'Residential gets up to ₹78,000 PM Surya Ghar subsidy; Commercial gets 40% tax depreciation.',
      'hi-IN': 'घर के लिए ₹78,000 सरकारी सब्सिडी, या व्यापार के लिए 40% टैक्स छूट।',
    },
    buttonText: {
      'te-IN': 'Got it! తరువాత →',
      'en-IN': 'Got it! Next →',
      'hi-IN': 'Got it! आगे बढ़ें →',
    },
  },
  {
    targetId: 'tour-step-bill',
    stepNumber: 3,
    title: {
      'te-IN': '3. కరెంట్ బిల్లు నమోదు చేయండి',
      'en-IN': '3. Enter Monthly Bill',
      'hi-IN': '3. मासिक बिजली बिल दर्ज करें',
    },
    actionPrompt: {
      'te-IN': 'మీ సగటు బిల్లు నమోదు చేయండి లేదా ₹2,500 / ₹3,500 బటన్ నొక్కండి 👇',
      'en-IN': 'Enter your monthly bill or tap any preset button like ₹2,500 / ₹3,500 👇',
      'hi-IN': 'अपना बिल टाइप करें या ₹2,500 / ₹3,500 बटन दबाएं 👇',
    },
    desc: {
      'te-IN': 'మీ నెలవారీ బిల్లును బట్టి మీకు కావాల్సిన ఖచ్చితమైన సోలార్ సామర్థ్యం (kW) లెక్కించబడుతుంది.',
      'en-IN': 'Automatically calculates your exact solar capacity in kW.',
      'hi-IN': 'आपकी आवश्यकता के अनुसार सटीक सोलर साइज निकालता है।',
    },
    buttonText: {
      'te-IN': 'Got it! తరువాత →',
      'en-IN': 'Got it! Next →',
      'hi-IN': 'Got it! आगे बढ़ें →',
    },
  },
  {
    targetId: 'tour-step-submit',
    stepNumber: 4,
    title: {
      'te-IN': '4. ఫలితాల కోసం క్లిక్ చేయండి!',
      'en-IN': '4. Calculate & Get Results!',
      'hi-IN': '4. परिणाम देखने के लिए क्लिक करें!',
    },
    actionPrompt: {
      'te-IN': 'ఈ బటన్ పై క్లిక్ చేయగానే పూర్తి సోలార్ కొటేషన్ మరియు సబ్సిడీ వివరాలు కనిపిస్తాయి 🚀',
      'en-IN': 'Click this button to see your solar size, subsidy, and net cost 🚀',
      'hi-IN': 'इस बटन पर क्लिक करके तुरंत सोलर सब्सिडी और बचत परिणाम देखें 🚀',
    },
    desc: {
      'te-IN': 'క్లిక్ చేయగానే సూర్య బోట్ మీకు పూర్తి వివరాలు వాయిస్ ద్వారా వివరిస్తారు!',
      'en-IN': 'Surya Bot will explain your complete quotation with lively voice!',
      'hi-IN': 'सूर्या बॉट आपको पूरी रिपोर्ट बोलकर समझाएंगे!',
    },
    buttonText: {
      'te-IN': 'Got it! ఫలితాలు చూడండి 🚀',
      'en-IN': "Got it! Let's Calculate 🚀",
      'hi-IN': 'Got it! गणना करें 🚀',
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
  const step = TOUR_STEPS[currentStepIndex];

  // Highlight and focus the target element
  const highlightStepElement = (stepObj: TourStep) => {
    if (!stepObj) return;
    const el = document.getElementById(stepObj.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Clean up previous highlights
      document.querySelectorAll('.tour-active-ring').forEach((node) => {
        node.classList.remove(
          'tour-active-ring',
          'ring-4',
          'ring-amber-400',
          'ring-offset-4',
          'ring-offset-white',
          'shadow-2xl',
          'relative',
          'z-30',
          'bg-amber-50/20'
        );
      });

      // Highlight current element so user can clearly see and interact with it!
      el.classList.add(
        'tour-active-ring',
        'ring-4',
        'ring-amber-400',
        'ring-offset-4',
        'ring-offset-white',
        'shadow-2xl',
        'relative',
        'z-30',
        'bg-amber-50/20'
      );
    }
  };

  useEffect(() => {
    if (!isOpen) {
      document.querySelectorAll('.tour-active-ring').forEach((node) => {
        node.classList.remove(
          'tour-active-ring',
          'ring-4',
          'ring-amber-400',
          'ring-offset-4',
          'ring-offset-white',
          'shadow-2xl',
          'relative',
          'z-30',
          'bg-amber-50/20'
        );
      });
      return;
    }

    const timer = setTimeout(() => {
      highlightStepElement(step);
      // Play speech guidance
      speakTourStep(step.stepNumber, voiceLang);
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, currentStepIndex, voiceLang]);

  const handleNext = () => {
    stopSpeech();
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      // Synchronously trigger next audio directly inside user click so browser NEVER blocks it!
      speakTourStep(TOUR_STEPS[nextIndex].stepNumber, voiceLang);
    } else {
      handleClose();
      onCompleteAndCalculate();
    }
  };

  const handleBack = () => {
    stopSpeech();
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      speakTourStep(TOUR_STEPS[prevIndex].stepNumber, voiceLang);
    }
  };

  const handleClose = () => {
    stopSpeech();
    document.querySelectorAll('.tour-active-ring').forEach((node) => {
      node.classList.remove(
        'tour-active-ring',
        'ring-4',
        'ring-amber-400',
        'ring-offset-4',
        'ring-offset-white',
        'shadow-2xl',
        'relative',
        'z-30',
        'bg-amber-50/20'
      );
    });
    onClose();
  };

  const handleReplayVoice = () => {
    speakTourStep(step.stepNumber, voiceLang);
  };

  if (!isOpen || !step) return null;

  return (
    <>
      {/* Light subtle backdrop: pointer-events-none so users CAN FREELY CLICK inputs! */}
      <div className="fixed inset-0 z-20 pointer-events-none bg-slate-900/30 backdrop-blur-[1px] transition-all duration-300" />

      {/* Floating Surya Bot Guided Tour Card (Fixed at bottom for easy thumb access, fully clickable) */}
      <aside
        aria-label="Surya Bot Guided Tour"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] border-3 border-amber-400 p-4 sm:p-5 animate-in slide-in-from-bottom-6 duration-200 pointer-events-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#015296] to-sky-500 flex items-center justify-center text-white shadow-sm relative shrink-0">
              <Bot className="w-5 h-5 animate-bounce" style={{ animationDuration: '2s' }} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#015296] bg-blue-50 px-2 py-0.5 rounded-full">
                  Surya Bot Walkthrough
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                  Step {step.stepNumber} / {TOUR_STEPS.length}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5 leading-snug">
                {step.title[voiceLang] || step.title['en-IN']}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Skip Tour"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Prompt with Bouncing Pointer Indicator */}
        <div className="flex items-center gap-2 py-2 px-3 bg-amber-50 rounded-xl my-2 border border-amber-200/80">
          <ArrowDown className="w-4 h-4 text-amber-600 animate-bounce shrink-0" />
          <p className="text-xs sm:text-sm font-bold text-amber-950 leading-tight">
            {step.actionPrompt[voiceLang] || step.actionPrompt['en-IN']}
          </p>
        </div>

        {/* Detail Note */}
        <p className="text-[11px] sm:text-xs text-slate-600 font-medium px-1">
          {step.desc[voiceLang] || step.desc['en-IN']}
        </p>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
          {/* Re-play voice button */}
          <button
            type="button"
            onClick={handleReplayVoice}
            className="flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1.5 rounded-lg transition-all border border-sky-200 cursor-pointer"
            title="Replay voice guidance"
          >
            <Volume2 className="w-3 h-3 text-sky-600" />
            <span>వాయిస్ వినండి</span>
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
              className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#015296] via-blue-700 to-sky-600 hover:brightness-110 active:scale-95 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span>{step.buttonText[voiceLang] || step.buttonText['en-IN']}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SolarRobotMascot } from './components/SolarRobotMascot';
import { MBSolarHubCategoryModal } from './components/MBSolarHubCategoryModal';
import { SolarIntroScreen } from './components/SolarIntroScreen';
import { RobotExplanationModal } from './components/RobotExplanationModal';
import type { StateOption, CategoryOption, CalculationRequest, CalculationResult } from './types';
import { fetchStates, fetchCategories, calculateSolar, recalculateSubsidy } from './services/api';
import { useSpeech, type SupportedLanguage } from './hooks/useSpeech';
import confetti from 'canvas-confetti';
import { Sun } from 'lucide-react';

export function App() {
  const [states, setStates] = useState<StateOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [lastRequest, setLastRequest] = useState<CalculationRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState<boolean>(false);
  const [showIntroScreen, setShowIntroScreen] = useState<boolean>(true); // Welcome mascot intro on load!
  const [showRobotExplanation, setShowRobotExplanation] = useState<boolean>(false); // Mascot explains after calculate!

  // Speech Hook
  const {
    isSpeaking,
    isListening,
    voiceLang,
    setVoiceLang,
    speak,
    speakIntro,
    stop,
    startListening,
  } = useSpeech();

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const [sts, cats] = await Promise.all([fetchStates(), fetchCategories()]);
      setStates(sts);
      setCategories(cats);

      // Default initial calculation (e.g. ₹3,500 bill in Andhra Pradesh)
      const initialReq: CalculationRequest = {
        stateId: 2,
        category: 1,
        averageBill: 3500,
        areaType: 1,
        roofArea: 2000,
        sanctionLoad: 2,
        invest: 100000,
        isFromSubsidyPage: false,
      };
      setLastRequest(initialReq);
      try {
        const initResult = await calculateSolar(initialReq);
        setResult(initResult);
      } catch (e) {
        console.error('Initial calc error:', e);
      }
    }
    loadData();
  }, []);

  const handleProceedFromIntro = (lang: SupportedLanguage) => {
    setVoiceLang(lang);
    setShowIntroScreen(false);
  };

  const handleCalculate = async (payload: CalculationRequest) => {
    setIsLoading(true);
    setLastRequest(payload);
    try {
      const data = await calculateSolar(payload);
      setResult(data);

      // Celebration effect
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.5 }
      });

      // Show the robot explanation stage so mascot explains results in person!
      setShowRobotExplanation(true);

      // Voice readout
      generateAndSpeakSummary(data, payload.stateId);
    } catch (err: any) {
      alert(err.message || 'Error calculating solar capacity. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced slider handler
  const sliderTimer = useRef<any>(null);
  const handleSliderChange = (newCapacity: number) => {
    if (!result || !lastRequest) return;

    // Optimistically update capacity display
    setResult({ ...result, capacity: newCapacity });

    if (sliderTimer.current) clearTimeout(sliderTimer.current);

    sliderTimer.current = setTimeout(async () => {
      setIsRecalculating(true);
      try {
        const updated = await recalculateSubsidy({
          capacityKw: newCapacity,
          stateId: lastRequest.stateId,
          category: lastRequest.category,
          averageBill: lastRequest.averageBill,
          areaType: 1,
          roofArea: 2000,
        });
        setResult(updated);
      } catch (err) {
        console.error('Slider recalculate error:', err);
      } finally {
        setIsRecalculating(false);
      }
    }, 250);
  };

function formatCapacityTelugu(cap: number): string {
  if (Math.round(cap) === cap || cap % 1 === 0) {
    return `${Math.round(cap)} కిలోవాట్ల`;
  }
  const parts = cap.toFixed(1).split('.');
  return `${parts[0]} పాయింట్ ${parts[1]} కిలోవాట్ల`;
}

function formatCurrencyTelugu(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded >= 100000) {
    const lakhs = Math.floor(rounded / 100000);
    const thousands = Math.round((rounded % 100000) / 1000);
    if (thousands > 0) {
      return `${lakhs} లక్షల ${thousands} వేల రూపాయల`;
    }
    return `${lakhs} లక్షల రూపాయల`;
  } else if (rounded >= 1000) {
    const thousands = Math.round(rounded / 1000);
    return `${thousands} వేల రూపాయల`;
  }
  return `${rounded} రూపాయల`;
}

function formatYearsTelugu(years: number): string {
  if (Math.round(years) === years || years % 1 === 0) {
    return `${Math.round(years)} సంవత్సరాల్లో`;
  }
  const parts = years.toFixed(1).split('.');
  return `${parts[0]} పాయింట్ ${parts[1]} సంవత్సరాల్లో`;
}

  const generateAndSpeakSummary = (res: CalculationResult, stateId?: number) => {
    const currentState = states.find((s) => s.stateId === (stateId || lastRequest?.stateId));
    const stateName = currentState?.stateName || 'your state';

    if (voiceLang === 'te-IN') {
      const capStr = formatCapacityTelugu(res.capacity);
      const saveStr = formatCurrencyTelugu(res.savingYear);
      const paybackStr = formatYearsTelugu(res.payBack);

      let teluguText: string;
      if (res.subsidyCost > 0) {
        const subStr = formatCurrencyTelugu(res.subsidyCost);
        const netStr = formatCurrencyTelugu(res.consumerShare);
        teluguText = `అద్భుతం! నేను MB Solar Hub నుండి సూర్య బోట్‌ను. మీ ${stateName}లో కరెంట్ బిల్లు ప్రకారం, మేము ${capStr} సోలార్ ప్లాంట్‌ను సిఫార్సు చేస్తున్నాము. మీరు పీఎం సూర్య ఘర్ పథకం కింద ${subStr} ప్రభుత్వ సబ్సిడీని పొందుతారు. మీ నికర ఖర్చు ${netStr} మాత్రమే. ఇది ప్రతి సంవత్సరం మీకు దాదాపు ${saveStr} కరెంట్ బిల్లును ఆదా చేస్తుంది! పెట్టుబడి రికవరీ ${paybackStr} పూర్తవుతుంది.`;
      } else {
        teluguText = `అద్భుతం! నేను MB Solar Hub నుండి సూర్య బోట్‌ను. మీ ${stateName}లో కమర్షియల్ విద్యుత్ వినియోగానికి మేము ${capStr} సోలార్ ప్లాంట్‌ను సిఫార్సు చేస్తున్నాము. కమర్షియల్ ప్రాజెక్ట్‌లకు సెక్షన్ 32 కింద 40 శాతం యాక్సిలరేటెడ్ డిప్రిసియేషన్ పన్ను మినహాయింపు లభిస్తుంది! ఇది మీ వ్యాపారానికి ప్రతి సంవత్సరం దాదాపు ${saveStr} విద్యుత్ బిల్లును ఆదా చేస్తుంది. పెట్టుబడి రికవరీ ${paybackStr} పూర్తవుతుంది.`;
      }
      speak(teluguText, 'te-IN');
    } else if (voiceLang === 'hi-IN') {
      let hindiText: string;
      if (res.subsidyCost > 0) {
        hindiText = `शानदार! मैं MB Solar Hub से सूर्या बॉट हूँ। आपके ${stateName} में मासिक बिजली खपत के अनुसार, हमने ${res.capacity.toFixed(
          1
        )} किलोवाट रूफटॉप सोलर प्लांट तैयार किया है। आपको पीएम सूर्य घर योजना के तहत ${Math.round(
          res.subsidyCost
        ).toLocaleString(
          'hi-IN'
        )} रुपये की सरकारी सब्सिडी मिलेगी। आपका शुद्ध निवेश लगभग ${Math.round(
          res.consumerShare
        ).toLocaleString('hi-IN')} रुपये होगा, जिससे हर साल ${Math.round(
          res.savingYear
        ).toLocaleString('hi-IN')} रुपये की बिजली बचत होगी!`;
      } else {
        hindiText = `शानदार! मैं MB Solar Hub से सूर्या बॉट हूँ। आपके ${stateName} में कमर्शियल बिजली खपत के अनुसार, हमने ${res.capacity.toFixed(
          1
        )} किलोवाट सोलर प्लांट तैयार किया है। कमर्शियल प्रतिष्ठानों को आयकर धारा 32 के तहत 40 प्रतिशत त्वरित मूल्यह्रास टैक्स छूट का लाभ मिलता है! यह हर साल आपके बिल में लगभग ${Math.round(
          res.savingYear
        ).toLocaleString('hi-IN')} रुपये की बिजली बचत करेगा!`;
      }
      speak(hindiText, 'hi-IN');
    } else {
      let englishText: string;
      if (res.subsidyCost > 0) {
        englishText = `Great news! I am Surya Bot from MB Solar Hub. Based on your electricity bill in ${stateName}, we recommend a ${res.capacity.toFixed(
          1
        )} kilowatt solar plant. You qualify for a ${Math.round(
          res.subsidyCost
        ).toLocaleString(
          'en-IN'
        )} rupees PM Surya Ghar government subsidy, bringing your net investment to ${Math.round(
          res.consumerShare
        ).toLocaleString('en-IN')} rupees. This will save you approximately ${Math.round(
          res.savingYear
        ).toLocaleString('en-IN')} rupees every year with a payback period of ${res.payBack.toFixed(1)} years!`;
      } else {
        englishText = `Great news! I am Surya Bot from MB Solar Hub. For your commercial facility in ${stateName}, we recommend a ${res.capacity.toFixed(
          1
        )} kilowatt solar plant. While commercial connections do not receive residential DBT subsidies, your business qualifies for a 40 percent Accelerated Depreciation tax benefit under Section 32! This will save you approximately ${Math.round(
          res.savingYear
        ).toLocaleString('en-IN')} rupees every year in power bills with a payback period of ${res.payBack.toFixed(1)} years!`;
      }
      speak(englishText, 'en-IN');
    }
  };

  const handleSpeechInput = () => {
    startListening((transcriptText: string) => {
      const matches = transcriptText.match(/\d+/g);
      if (matches && matches.length > 0) {
        const billVal = parseInt(matches[0], 10);
        if (billVal >= 100 && lastRequest) {
          handleCalculate({
            ...lastRequest,
            averageBill: billVal,
          });
        }
      }
    });
  };

  const currentStateName = states.find((s) => s.stateId === lastRequest?.stateId)?.stateName;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header with MB Solar Hub Branding */}
      <Header
        isSpeaking={isSpeaking}
        onStopSpeech={stop}
        voiceLang={voiceLang}
        onToggleVoiceLang={() => {
          if (voiceLang === 'en-IN') setVoiceLang('hi-IN');
          else if (voiceLang === 'hi-IN') setVoiceLang('te-IN');
          else setVoiceLang('en-IN');
        }}
        onOpenVendorModal={() => setIsVendorModalOpen(true)}
        onOpenMascotIntro={() => setShowIntroScreen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Animated Solar Robot Mascot ("Sunny Bot") */}
        <SolarRobotMascot
          result={result}
          onSpeak={() => result && generateAndSpeakSummary(result)}
          isSpeaking={isSpeaking}
          stateName={currentStateName}
          voiceLang={voiceLang}
        />

        {/* 2-Column Split: Step 1 (Left Form) & Step 2 (Right Sizing & Subsidy Result) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Form (Sticky ONLY on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 w-full">
            <CalculatorForm
              states={states}
              categories={categories}
              isLoading={isLoading}
              onCalculate={handleCalculate}
              onStartSpeechInput={handleSpeechInput}
              isListening={isListening}
            />
          </div>

          {/* Right Column: Results & Projections */}
          <div className="lg:col-span-7">
            {result ? (
              <ResultsDisplay
                result={result}
                onSliderChange={handleSliderChange}
                isRecalculating={isRecalculating}
                onSpeakSummary={() => generateAndSpeakSummary(result)}
                isSpeaking={isSpeaking}
                onOpenVendorModal={() => setIsVendorModalOpen(true)}
              />
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="w-12 h-12 bg-blue-50 text-[#015296] rounded-full flex items-center justify-center mx-auto mb-3 animate-spin">
                  <Sun className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-700">Loading Solar Sizing Engine...</h3>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-700">
            MB Solar Hub — India's #1 Solar Aggregator Platform
          </p>
          <p className="max-w-2xl mx-auto text-slate-400 text-[11px]">
            Independent solar calculator implementing PM Surya Ghar: Muft Bijli Yojana central subsidy formulas. Estimates are indicative and subject to exact rooftop conditions, DISCOM net metering sanction, and empaneled vendor inspection.
          </p>
          <p className="text-slate-400 pt-2 text-[10px]">
            © {new Date().getFullYear()} MB Solar Hub. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Official MB Solar Hub Account Category & Sign In Modal */}
      <MBSolarHubCategoryModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
      />

      {/* 3D Animated Solar Mascot Welcome & Greet Stage */}
      <SolarIntroScreen
        isOpen={showIntroScreen}
        onProceedToCalculator={handleProceedFromIntro}
        onClose={() => setShowIntroScreen(false)}
        speakIntro={speakIntro}
        isSpeaking={isSpeaking}
      />

      {/* Mascot Results Explanation Spotlight Modal */}
      <RobotExplanationModal
        isOpen={showRobotExplanation}
        onClose={() => setShowRobotExplanation(false)}
        result={result}
        stateName={currentStateName}
        onOpenVendorModal={() => {
          setShowRobotExplanation(false);
          setIsVendorModalOpen(true);
        }}
        isSpeaking={isSpeaking}
        onReplaySpeech={() => result && generateAndSpeakSummary(result)}
        voiceLang={voiceLang}
      />
    </div>
  );
}

export default App;

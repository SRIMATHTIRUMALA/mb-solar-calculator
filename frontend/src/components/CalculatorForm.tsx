import React, { useState } from 'react';
import type { StateOption, CategoryOption, CalculationRequest } from '../types';
import { Calculator, RotateCcw, ChevronDown, Mic, Sparkles, MapPin, Building2, Zap } from 'lucide-react';

interface CalculatorFormProps {
  states: StateOption[];
  categories: CategoryOption[];
  isLoading: boolean;
  onCalculate: (data: CalculationRequest) => void;
  onStartSpeechInput: (targetField: string) => void;
  isListening: boolean;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  states,
  categories,
  isLoading,
  onCalculate,
  onStartSpeechInput,
  isListening,
}) => {
  const [stateId, setStateId] = useState<number>(2); // Default to Andhra Pradesh
  const [category, setCategory] = useState<number>(1); // Default to Residential
  const [averageBill, setAverageBill] = useState<string>('3500');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const getPresetsForCategory = (catId: number) => {
    switch (catId) {
      case 2: // GHS / RWA
        return [15000, 30000, 60000, 120000, 250000];
      case 3: // Commercial / Offices
        return [10000, 25000, 50000, 100000, 200000];
      case 4: // Industrial
        return [25000, 50000, 100000, 250000, 500000];
      default: // Residential
        return [1500, 2500, 3500, 5000, 8000];
    }
  };

  const getCategoryHelper = (catId: number) => {
    switch (catId) {
      case 2:
        return '🏢 PM Surya Ghar GHS/RWA CFA Subsidy: ₹18,000 / kW up to 500 kW for society common meters (lifts, pumps, EV charging)';
      case 3:
        return '💼 Commercial & Offices: Qualify for 40% Accelerated Depreciation tax benefit + high commercial tariff savings';
      case 4:
        return '🏭 Industrial: Heavy daytime captive solar savings and commercial net-metering';
      default:
        return '🏠 PM Surya Ghar central subsidy up to ₹78,000 directly deposited to Residential homeowners via DBT';
    }
  };

  const handleCategoryChange = (newCat: number) => {
    setCategory(newCat);
    const presets = getPresetsForCategory(newCat);
    setAverageBill(presets[1].toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const billNum = parseFloat(averageBill);
    if (isNaN(billNum) || billNum <= 0) {
      setErrorMsg('Please enter a valid monthly electricity bill greater than ₹0.');
      return;
    }

    onCalculate({
      stateId,
      category,
      averageBill: billNum,
      areaType: 1,
      roofArea: 50000, // Generous upper limit for large societies and offices
      sanctionLoad: 2,
      invest: 100000,
      isFromSubsidyPage: false,
    });
  };

  const handleReset = () => {
    setStateId(2);
    setCategory(1);
    setAverageBill('3500');
    setErrorMsg('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#015296] bg-blue-50 px-2.5 py-0.5 rounded-full">
            Step 1
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-1">
            <Calculator className="w-5 h-5 text-[#015296]" />
            Your Electricity Bill
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter your details to calculate your recommended solar size & subsidy
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
          title="Reset form"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* State Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#015296]" />
            Select Your State / UT <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={stateId}
              onChange={(e) => setStateId(parseInt(e.target.value, 10))}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-[#015296] focus:bg-white transition-all appearance-none cursor-pointer"
              required
            >
              {states.map((st) => (
                <option key={st.stateId} value={st.stateId}>
                  {st.stateName} {st.isSpecialCategory ? '(Special Category Subsidy)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Applies local DISCOM electricity rates and solar sunlight hours</p>
        </div>

        {/* Consumer Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#015296]" />
            Customer Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => handleCategoryChange(parseInt(e.target.value, 10))}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-[#015296] focus:bg-white transition-all appearance-none cursor-pointer"
              required
            >
              {categories.map((cat) => (
                <option key={cat.keyID} value={cat.keyID}>
                  {cat.value} {cat.isSubsidyEligible ? '⚡ (Subsidy Eligible)' : '(Non-Subsidy / Tax Benefit)'}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[11px] text-sky-900 font-medium mt-1.5 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200">
            {getCategoryHelper(category)}
          </p>
        </div>

        {/* Average Monthly Bill with Voice Dictation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Average Monthly Electricity Bill (₹) <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => onStartSpeechInput('bill')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
              title="Click to dictate your bill by voice"
            >
              <Mic className="w-3 h-3" />
              <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
            </button>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
              ₹
            </span>
            <input
              type="number"
              min="100"
              max="5000000"
              step="100"
              value={averageBill}
              onChange={(e) => setAverageBill(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 text-slate-900 font-black text-lg rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#015296] focus:bg-white transition-all"
              required
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
            <span className="text-[11px] text-slate-400 font-medium shrink-0">Presets:</span>
            {getPresetsForCategory(category).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAverageBill(preset.toString())}
                className={`text-xs px-3 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                  averageBill === preset.toString()
                    ? 'bg-[#015296] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#015296] hover:bg-[#014278] active:scale-[0.99] text-white py-4 px-6 rounded-xl font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-4"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Calculating Solar Sizing & Subsidy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Calculate Solar Sizing & Subsidy</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

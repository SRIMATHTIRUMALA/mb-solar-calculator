import React from 'react';
import type { CalculationResult } from '../types';
import { CostChart } from './CostChart';
import {
  Sun,
  ShieldCheck,
  TrendingUp,
  Leaf,
  Layers,
  Sparkles,
  ArrowRight,
  Sliders,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Coins
} from 'lucide-react';

interface ResultsDisplayProps {
  result: CalculationResult;
  onSliderChange: (capacity: number) => void;
  isRecalculating: boolean;
  onSpeakSummary: () => void;
  isSpeaking: boolean;
  onOpenVendorModal: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  onSliderChange,
  isRecalculating,
  onSpeakSummary,
  isSpeaking,
  onOpenVendorModal,
}) => {
  const formatINR = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner: Recommended Capacity */}
      <div className="bg-gradient-to-r from-[#015296] via-[#0267bd] to-[#015296] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Step 2: Solar Sizing Result
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              Recommended Solar Plant: <span className="text-amber-300">{result.capacity.toFixed(1)} kW</span>
            </h2>
            <p className="text-sky-100 text-xs sm:text-sm mt-1 max-w-xl">
              Calculated to offset ~100% of your electricity consumption ({Math.round(result.monthlyUnits)} units/month).
            </p>
          </div>

          <button
            onClick={onSpeakSummary}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer ${
              isSpeaking
                ? 'bg-amber-400 text-slate-900 animate-pulse'
                : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Speaking Analysis...' : 'Listen to AI Summary'}</span>
          </button>
        </div>

        {/* Dynamic Capacity Slider */}
        <div className="mt-5 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-sky-200">
              <Sliders className="w-3.5 h-3.5 text-amber-300" />
              Fine-Tune Capacity:
            </span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-md font-mono font-bold text-amber-300 text-sm">
              {result.capacity.toFixed(1)} kW
            </span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="1"
              max={result.capacity > 15 ? Math.max(100, Math.ceil(result.capacity * 1.5)) : 15}
              step={result.capacity > 20 ? 1 : 0.5}
              value={result.capacity}
              onChange={(e) => onSliderChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-sky-950/60 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] sm:text-[11px] text-sky-200/70 font-mono mt-1">
              <span>1 kW</span>
              {result.capacity <= 15 ? (
                <>
                  <span>3 kW <span className="hidden sm:inline">(Max Subsidy)</span></span>
                  <span>5 kW</span>
                  <span>10 kW</span>
                  <span>15 kW</span>
                </>
              ) : (
                <>
                  <span>25 kW</span>
                  <span>50 kW</span>
                  <span>75 kW</span>
                  <span>{Math.max(100, Math.ceil(result.capacity * 1.5))} kW</span>
                </>
              )}
            </div>
          </div>
          {isRecalculating && (
            <p className="text-[11px] text-amber-300 font-medium mt-1 animate-pulse">
              Updating subsidy, costs & returns...
            </p>
          )}
        </div>
      </div>

      {/* Warnings Notification if any */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            {result.warnings.map((w, idx) => (
              <p key={idx} className="font-medium">{w}</p>
            ))}
          </div>
        </div>
      )}

      {/* Financial Overview Grid (3 Main Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gross Project Cost */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated Project Cost</p>
          <div>
            <p className="text-2xl font-black text-slate-800">{formatINR(result.projectCost)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Turnkey (Tier-1 Panels, Inverter & BOS)</p>
          </div>
        </div>

        {/* PM Surya Ghar Subsidy / Commercial Depreciation Card */}
        <div className={`rounded-xl p-5 border-2 shadow-xs flex flex-col justify-between ${
          result.subsidyCost > 0
            ? 'border-emerald-500/40 bg-emerald-50/20'
            : 'border-amber-400/50 bg-amber-50/20'
        }`}>
          <div className="flex items-center justify-between gap-1 mb-1">
            <p className={`text-xs font-bold uppercase tracking-wider ${
              result.subsidyCost > 0 ? 'text-emerald-700' : 'text-amber-800'
            }`}>
              {result.subsidyCost > 0 ? 'PM Surya Ghar Subsidy' : 'Commercial Tax Benefit'}
            </p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              result.subsidyCost > 0
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              <CheckCircle2 className="w-3 h-3" /> {result.subsidyCost > 0 ? 'MNRE DBT' : 'Sec 32 (40%)'}
            </span>
          </div>
          <div>
            <p className={`text-2xl font-black ${
              result.subsidyCost > 0 ? 'text-emerald-600' : 'text-amber-700'
            }`}>
              {result.subsidyCost > 0 ? formatINR(result.subsidyCost) : '40% Accelerated Dep.'}
            </p>
            <p className={`text-[11px] mt-1 ${
              result.subsidyCost > 0 ? 'text-emerald-700' : 'text-slate-600'
            }`}>
              {result.subsidyCost > 0
                ? result.capacity > 3
                  ? 'GHS / RWA Society CFA Subsidy'
                  : 'Direct Bank Credit via DBT'
                : `1st Year Tax Deduction: ~${formatINR(result.projectCost * 0.4)}`}
            </p>
          </div>
        </div>

        {/* Consumer Share */}
        <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-xs bg-blue-50/20 flex flex-col justify-between">
          <p className="text-xs font-bold text-[#015296] uppercase tracking-wider mb-1">Your Net Investment</p>
          <div>
            <p className="text-2xl font-black text-[#015296]">{formatINR(result.consumerShare)}</p>
            <p className="text-[11px] text-slate-500 mt-1">Cost After Government Subsidy</p>
          </div>
        </div>
      </div>

      {/* Middle Row: Cost Breakdown Chart & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Cost Doughnut Chart */}
        <div className="lg:col-span-5 flex flex-col">
          <CostChart
            subsidyCost={result.subsidyCost}
            consumerShare={result.consumerShare}
            projectCost={result.projectCost}
          />
        </div>

        {/* Key Operational & Financial Metrics Grid (4 Cards) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Electricity Savings */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Electricity Bill Savings</span>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{formatINR(result.savingYear)}</span>
              <span className="text-xs text-slate-400 font-medium"> / year</span>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">
                ≈ {formatINR(result.savingDay)} / day saved
              </p>
            </div>
          </div>

          {/* Payback Period & ROI */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <TrendingUp className="w-4 h-4 text-[#015296]" />
              <span>Payback & ROI</span>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{result.payBack.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-medium"> Years Payback</span>
              <p className="text-[11px] text-[#015296] font-bold mt-1">
                {result.returnOnInvest.toFixed(1)}% Annual ROI
              </p>
            </div>
          </div>

          {/* Electricity Generation */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Solar Power Generation</span>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {Math.round(result.kwhYear).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 font-medium"> kWh / year</span>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                ≈ {result.kwhDay.toFixed(1)} units/day
              </p>
            </div>
          </div>

          {/* Rooftop Area Required */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <Layers className="w-4 h-4 text-slate-600" />
              <span>Required Rooftop Area</span>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {Math.round(result.areaSqFt).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 font-medium"> Sq. Ft</span>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                ≈ {result.areaSqm.toFixed(1)} sq. meters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact & Carbon Offset */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-900">Environmental Impact</p>
            <p className="text-xs text-emerald-700">
              Reduces <span className="font-extrabold">{result.savingEmission} Tonnes of CO₂</span> annually, equivalent to planting <span className="font-extrabold">{Math.round(result.savingEmission * 45)} trees</span> each year.
            </p>
          </div>
        </div>
      </div>

      {/* MB Solar Hub Vendor Action Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> MB Solar Hub Aggregator
          </div>
          <h3 className="text-xl font-black">Find Empaneled Solar Vendors Nearby</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Connect with certified installers in your city for free site visits, net-metering approvals, and competitive pricing.
          </p>
        </div>

        <button
          onClick={onOpenVendorModal}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Find Vendors</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

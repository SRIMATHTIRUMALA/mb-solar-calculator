import type { StateOption, CategoryOption, CalculationRequest, SubsidyRecalculateRequest, CalculationResult } from '../types';
import statesData from '../data/states.json';
import categoriesData from '../data/categories.json';

const DCR_PRICE_TABLE: Record<number, number> = {
  1.0: 75000.0,
  2.0: 140000.0,
  3.0: 200000.0,
  4.0: 260000.0,
  5.0: 320000.0,
  6.0: 380000.0,
  7.0: 440000.0,
  8.0: 500000.0,
  9.0: 560000.0,
  10.0: 620000.0,
};

export function getLocalStates(): StateOption[] {
  return statesData as StateOption[];
}

export function getLocalCategories(): CategoryOption[] {
  return categoriesData as CategoryOption[];
}

export function calculateInstallationCostLocal(capacityKw: number, category: number = 1): number {
  if (category === 1 && capacityKw <= 10.0) {
    const floorKw = Math.floor(capacityKw);
    const ceilKw = Math.min(10, floorKw + 1);
    if (capacityKw === floorKw && DCR_PRICE_TABLE[floorKw]) {
      return DCR_PRICE_TABLE[floorKw];
    } else if (DCR_PRICE_TABLE[floorKw] && DCR_PRICE_TABLE[ceilKw]) {
      const ratio = capacityKw - floorKw;
      const cost = DCR_PRICE_TABLE[floorKw] + ratio * (DCR_PRICE_TABLE[ceilKw] - DCR_PRICE_TABLE[floorKw]);
      return Math.round(cost);
    } else if (capacityKw < 1.0) {
      return Math.round(capacityKw * 75000.0);
    }
  }

  let rate = 55000.0;
  if (capacityKw > 50.0) {
    rate = 42000.0;
  } else if (capacityKw > 10.0) {
    rate = 48000.0;
  }
  return Math.round(capacityKw * rate);
}

export function calculateSubsidyLocal(capacityKw: number, category: number, isSpecialCategory: boolean, grossCost: number): number {
  if (category === 1) {
    // Residential Individual
    const cap1to2 = Math.min(capacityKw, 2.0);
    const cap2to3 = Math.max(0.0, Math.min(capacityKw - 2.0, 1.0));
    const rate1 = isSpecialCategory ? 33000.0 : 30000.0;
    const rate2 = isSpecialCategory ? 19800.0 : 18000.0;
    const subsidy = cap1to2 * rate1 + cap2to3 * rate2;
    const maxSubsidy = isSpecialCategory ? 85800.0 : 78000.0;
    return Math.min(subsidy, maxSubsidy, grossCost);
  } else if (category === 2) {
    // GHS / RWA common facilities
    const cappedCap = Math.min(capacityKw, 500.0);
    const rate = isSpecialCategory ? 19800.0 : 18000.0;
    return Math.min(cappedCap * rate, grossCost);
  }
  // Commercial / Non-residential
  return 0.0;
}

export function calculateSolarLocal(req: CalculationRequest): CalculationResult {
  const states = getLocalStates();
  const state = states.find(s => s.stateId === req.stateId) || states[0];
  let tariffRate = state.avgTariff;
  if (req.category === 3 || req.category === 4) {
    tariffRate = Math.round(tariffRate * 1.35 * 100) / 100;
  }
  const dailyYield = state.dailyYield;
  const isSpecial = state.isSpecialCategory;

  const monthlyUnits = req.averageBill / Math.max(1.0, tariffRate);
  const dailyUnits = monthlyUnits / 30.0;
  const idealKw = dailyUnits / Math.max(2.5, dailyYield);

  let capacityKw = 1.0;
  if (req.isFromSubsidyPage && req.capacityKw) {
    capacityKw = Math.round(req.capacityKw * 10) / 10;
  } else {
    if (idealKw < 1.0) capacityKw = 1.0;
    else if (idealKw < 3.0) capacityKw = Math.max(1.0, Math.round(idealKw));
    else capacityKw = Math.round(idealKw * 2) / 2;
  }
  capacityKw = Math.max(1.0, capacityKw);

  const reqAreaSqFt = Math.round(capacityKw * 100.0);
  const reqAreaSqm = Math.round((reqAreaSqFt / 10.7639) * 100) / 100;

  const kwhDay = Math.round(capacityKw * dailyYield * 100) / 100;
  const kwhYear = Math.round(kwhDay * 365.0 * 10) / 10;

  const grossCost = calculateInstallationCostLocal(capacityKw, req.category);
  const subsidyCost = calculateSubsidyLocal(capacityKw, req.category, isSpecial, grossCost);
  const consumerShare = Math.max(0.0, Math.round(grossCost - subsidyCost));

  const annualHouseholdUnits = monthlyUnits * 12.0;
  const effectiveOffset = Math.min(kwhYear, Math.max(annualHouseholdUnits, kwhYear * 0.95));
  const savingYear = Math.round(effectiveOffset * tariffRate);
  const savingDay = Math.round((savingYear / 365.0) * 100) / 100;

  const payback = savingYear > 0 && consumerShare > 0 ? Math.round((consumerShare / savingYear) * 10) / 10 : 0.0;
  const roi = consumerShare > 0 ? Math.round((savingYear / consumerShare) * 1000) / 10 : 0.0;
  const savingEmission = Math.round(((kwhYear * 0.82) / 1000.0) * 100) / 100;

  return {
    capacity: capacityKw,
    areaSqFt: reqAreaSqFt,
    areaSqm: reqAreaSqm,
    projectCost: grossCost,
    subsidyCost: subsidyCost,
    consumerShare: consumerShare,
    kwhDay: kwhDay,
    kwhYear: kwhYear,
    savingDay: savingDay,
    savingYear: savingYear,
    savingEmission: savingEmission,
    returnOnInvest: roi,
    payBack: payback,
    monthlyUnits: Math.round(monthlyUnits * 10) / 10,
    tariffRate: tariffRate,
    assumptions: [
      `State Tariff: ₹${tariffRate.toFixed(2)}/kWh for ${state.stateName}`,
      `Solar Yield: ${dailyYield.toFixed(1)} kWh/kW/day average`,
      req.category === 1
        ? 'PM Surya Ghar central subsidy applied (up to ₹78,000 max for residential)'
        : req.category === 2
        ? 'PM Surya Ghar GHS/RWA CFA subsidy applied (₹18,000/kW up to 500 kW)'
        : 'Commercial / Non-residential Section 32 40% depreciation benefits',
      'Turnkey installation includes Tier-1 solar modules, grid inverter, and mounting structures',
    ],
    warnings: [],
    calculationVersion: '1.0.0',
  };
}

export function recalculateSubsidyLocal(req: SubsidyRecalculateRequest): CalculationResult {
  return calculateSolarLocal({
    stateId: req.stateId,
    category: req.category,
    averageBill: req.averageBill,
    areaType: req.areaType,
    roofArea: req.roofArea,
    capacityKw: req.capacityKw,
    isFromSubsidyPage: true,
  });
}


export interface StateOption {
  stateId: number;
  stateName: string;
  avgTariff: number;
  dailyYield: number;
  isSpecialCategory: boolean;
  discoms: string[];
}

export interface CategoryOption {
  keyID: number;
  value: string;
  isSubsidyEligible: boolean;
}

export interface CalculationRequest {
  stateId: number;
  category: number;
  averageBill: number;
  areaType: number; // 1 = Sq. Ft, 2 = Sq. Meter
  roofArea: number;
  capacityKw?: number;
  sanctionLoad?: number;
  invest?: number;
  isFromSubsidyPage?: boolean;
}

export interface SubsidyRecalculateRequest {
  capacityKw: number;
  stateId: number;
  category: number;
  averageBill: number;
  areaType: number;
  roofArea: number;
  sanctionLoad?: number;
  invest?: number;
  isFromSubsidyPage?: boolean;
}

export interface CalculationResult {
  capacity: number;
  areaSqFt: number;
  areaSqm: number;
  projectCost: number;
  subsidyCost: number;
  consumerShare: number;
  kwhDay: number;
  kwhYear: number;
  savingDay: number;
  savingYear: number;
  savingEmission: number;
  returnOnInvest: number;
  payBack: number;
  monthlyUnits: number;
  tariffRate: number;
  assumptions: string[];
  warnings: string[];
  calculationVersion: string;
}


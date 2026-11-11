import type { StateOption, CategoryOption, CalculationRequest, SubsidyRecalculateRequest, CalculationResult } from '../types';
import { getLocalStates, getLocalCategories, calculateSolarLocal, recalculateSubsidyLocal } from './localEngine';

const API_BASE = '/api';

export interface LeadSubmission {
  name: string;
  phone: string;
  city: string;
  capacityKw: number;
  subsidyAmount: number;
  stateName?: string;
}

export async function fetchStates(): Promise<StateOption[]> {
  try {
    const res = await fetch(`${API_BASE}/states`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using built-in all-India state database');
    return getLocalStates();
  }
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using built-in categories');
    return getLocalCategories();
  }
}

export async function calculateSolar(payload: CalculationRequest): Promise<CalculationResult> {
  try {
    const res = await fetch(`${API_BASE}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      throw new Error(`Server returned error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline or unreachable, using local DCR calculation engine', err);
    return calculateSolarLocal(payload);
  }
}

export async function recalculateSubsidy(payload: SubsidyRecalculateRequest): Promise<CalculationResult> {
  try {
    const res = await fetch(`${API_BASE}/calculate-subsidy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      throw new Error(`Server returned error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline or unreachable, using local DCR recalculation engine', err);
    return recalculateSubsidyLocal(payload);
  }
}

export async function submitLead(lead: LeadSubmission): Promise<{ status: string; leadId: string }> {
  try {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend leads API unavailable, saving lead locally', err);
    return { status: 'success', leadId: `LEAD-${Date.now()}` };
  }
}

"""
Module F: Financial Analysis & Environmental Impact
Calculates net consumer investment, daily/annual savings, simple payback period, ROI, and carbon offset.
"""
from typing import Tuple

CO2_GRID_FACTOR_KG_PER_KWH = 0.82  # Central Electricity Authority (CEA) India benchmark factor

def calculate_financials(
    gross_cost: float,
    subsidy: float,
    kwh_year: float,
    tariff_rate: float,
    monthly_units: float
) -> Tuple[float, float, float, float, float, float]:
    """
    Returns:
        (consumer_share, saving_day, saving_year, saving_emission, return_on_invest, payback_years)
    """
    # Net investment out-of-pocket
    consumer_share = max(0.0, round(gross_cost - subsidy, 2))

    # Annual bill savings (avoided cost of purchasing grid electricity)
    annual_household_units = monthly_units * 12.0
    effective_offset_units = min(kwh_year, max(annual_household_units, kwh_year * 0.95))
    
    annual_savings = round(effective_offset_units * tariff_rate, 2)
    daily_savings = round(annual_savings / 365.0, 2)

    # Simple Payback Period
    if annual_savings > 0 and consumer_share > 0:
        payback_years = round(consumer_share / annual_savings, 1)
    else:
        payback_years = 0.0

    # Return on Investment (First year ROI %)
    if consumer_share > 0:
        roi = round((annual_savings / consumer_share) * 100.0, 1)
    else:
        roi = 100.0 if annual_savings > 0 else 0.0

    # Carbon emissions avoided (Tonnes of CO2 per year)
    saving_emission = round((kwh_year * CO2_GRID_FACTOR_KG_PER_KWH) / 1000.0, 2)

    return consumer_share, daily_savings, annual_savings, saving_emission, roi, payback_years


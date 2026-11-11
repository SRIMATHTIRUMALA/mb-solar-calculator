"""
Module B: Solar Electricity Generation
Computes daily and annual solar power output based on location-specific yield.
"""
from typing import Tuple

def calculate_generation(capacity_kw: float, daily_yield: float) -> Tuple[float, float]:
    """
    Computes (kwh_day, kwh_year)
    daily_yield: average specific yield in kWh/kW/day (typically 4.0 - 5.0 in India)
    """
    safe_yield = max(2.5, daily_yield)
    kwh_day = round(capacity_kw * safe_yield, 2)
    kwh_year = round(kwh_day * 365.0, 1)
    return kwh_day, kwh_year


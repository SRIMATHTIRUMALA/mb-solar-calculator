"""
Module A: Solar System Capacity Estimation
Calculates recommended and roof-constrained solar plant capacity.
"""
import math
from typing import Tuple, List

SQFT_PER_KW = 100.0  # ~100 sq. ft. per 1 kW standard crystalline module
SQM_TO_SQFT = 10.7639

def calculate_capacity(
    average_bill: float,
    tariff_rate: float,
    daily_yield: float,
    available_roof_area: float,
    area_type: int = 1,
    requested_capacity: float = 1.0,
    is_from_subsidy_page: bool = False
) -> Tuple[float, float, float, float, List[str]]:
    """
    Returns:
        (selected_capacity_kw, required_area_sqft, required_area_sqm, estimated_monthly_units, warnings)
    """
    warnings: List[str] = []

    # Convert available roof to square feet if given in sq meters
    if area_type == 2:
        available_roof_sqft = available_roof_area * SQM_TO_SQFT
    else:
        available_roof_sqft = available_roof_area

    # Calculate estimated monthly consumption in units (kWh)
    safe_tariff = max(1.0, tariff_rate)
    monthly_units = average_bill / safe_tariff
    daily_units = monthly_units / 30.0

    # Max capacity physically supported by the roof
    max_kw_from_roof = max(0.5, available_roof_sqft / SQFT_PER_KW)

    if is_from_subsidy_page and requested_capacity > 0:
        # User manually selected capacity via slider
        capacity_kw = round(requested_capacity, 1)
        if capacity_kw > max_kw_from_roof:
            warnings.append(
                f"Selected capacity ({capacity_kw:.1f} kW) exceeds recommended shadow-free roof capacity ({max_kw_from_roof:.1f} kW for {available_roof_sqft:.0f} sq.ft.)."
            )
    else:
        # Sizing model: offset ~90-100% of household monthly consumption
        safe_yield = max(2.5, daily_yield)
        ideal_kw = daily_units / safe_yield

        # Round to convenient residential installation size (e.g. 1.0, 2.0, 3.0, 4.0, 5.0)
        # Standard PM Surya Ghar recommendation is rounded to nearest integer or 0.5 kW
        if ideal_kw < 1.0:
            recommended_kw = 1.0
        elif ideal_kw < 3.0:
            recommended_kw = round(ideal_kw)
            if recommended_kw < 1:
                recommended_kw = 1.0
        else:
            recommended_kw = round(ideal_kw * 2) / 2  # steps of 0.5 kW

        # Check roof constraint
        if recommended_kw > max_kw_from_roof and max_kw_from_roof >= 1.0:
            capacity_kw = math.floor(max_kw_from_roof)
            warnings.append(
                f"Recommended capacity was capped from {recommended_kw:.1f} kW to {capacity_kw:.1f} kW due to roof space limits ({available_roof_sqft:.0f} sq.ft.)."
            )
        else:
            capacity_kw = recommended_kw

    # Minimum 1 kW
    capacity_kw = max(1.0, float(capacity_kw))

    # Calculate required roof area
    req_area_sqft = round(capacity_kw * SQFT_PER_KW, 1)
    req_area_sqm = round(req_area_sqft / SQM_TO_SQFT, 2)

    return capacity_kw, req_area_sqft, req_area_sqm, round(monthly_units, 1), warnings


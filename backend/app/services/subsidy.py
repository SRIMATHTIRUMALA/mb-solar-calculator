"""
Module D: PM Surya Ghar: Muft Bijli Yojana Central Subsidy Engine
Calculates piecewise CFA (Central Financial Assistance) based on official MNRE scheme rules.
"""

def calculate_subsidy(
    capacity_kw: float,
    category_id: int = 1,
    is_special_category: bool = False,
    gross_cost: float = 0.0
) -> float:
    """
    PM Surya Ghar CFA Subsidy Rules:
    1. Residential (Individual Household) (category_id == 1):
       - Standard States:
         * Up to 2 kW: ₹30,000 per kW (₹60,000 for 2 kW)
         * Additional between 2 kW and 3 kW: ₹18,000 per kW
         * >= 3 kW: Maximum cap ₹78,000
       - Special Category States:
         * Up to 2 kW: ₹33,000 per kW (₹66,000 for 2 kW)
         * Additional between 2 kW and 3 kW: ₹19,800 per kW
         * >= 3 kW: Maximum cap ₹85,800
    2. Group Housing Society (GHS) / Resident Welfare Association (RWA) (category_id == 2):
       - CFA of ₹18,000 per kW (₹19,800 in special states) for common facilities up to 500 kW capacity.
    3. Commercial / Offices / Industrial / Others (category_id >= 3):
       - 0 central CFA under PM Surya Ghar (benefit via 40% Accelerated Depreciation & commercial tariff offsets).
    """
    if capacity_kw <= 0:
        return 0.0

    if category_id == 1:
        if is_special_category:
            rate_per_kw_up_to_2 = 33000.0
            rate_additional_kw = 19800.0
            max_cap = 85800.0
        else:
            rate_per_kw_up_to_2 = 30000.0
            rate_additional_kw = 18000.0
            max_cap = 78000.0

        if capacity_kw <= 2.0:
            subsidy = capacity_kw * rate_per_kw_up_to_2
        elif capacity_kw < 3.0:
            subsidy = (2.0 * rate_per_kw_up_to_2) + ((capacity_kw - 2.0) * rate_additional_kw)
        else:
            subsidy = max_cap

    elif category_id == 2:
        # GHS / RWA common facilities: ₹18,000/kW (or ₹19,800 in special states) capped at 500 kW
        rate_per_kw = 19800.0 if is_special_category else 18000.0
        eligible_kw = min(capacity_kw, 500.0)
        subsidy = eligible_kw * rate_per_kw

    else:
        return 0.0

    # Subsidy cannot exceed gross project cost
    if gross_cost > 0:
        subsidy = min(subsidy, gross_cost)

    return round(subsidy, 2)


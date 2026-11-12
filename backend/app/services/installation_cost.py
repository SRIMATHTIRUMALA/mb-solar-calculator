"""
Module C: Solar Installation Cost Estimation
Implements official PM Surya Ghar DCR Benchmark Price List
matching empanelled installer rate cards (1 kW to 10 kW + commercial tiers).
"""

DCR_PRICE_TABLE = {
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
}

def calculate_installation_cost(capacity_kw: float, category: int = 1) -> float:
    """
    Turnkey installation cost (DCR Panels + Inverter + Structure + Wiring + Net Meter + Labor).
    For residential (category 1):
      - 1 kW:  75,000 INR
      - 2 kW: 140,000 INR
      - 3 kW: 200,000 INR (Base)
      - For each additional kW above 3 kW: add exactly +60,000 INR/kW:
        * 4 kW:  260,000 INR
        * 5 kW:  320,000 INR
        * 6 kW:  380,000 INR
        * 7 kW:  440,000 INR
        * 8 kW:  500,000 INR
        * 9 kW:  560,000 INR
        * 10 kW: 620,000 INR
    """
    if category == 1 and capacity_kw <= 10.0:
        floor_kw = int(capacity_kw)
        ceil_kw = min(10, floor_kw + 1)
        if capacity_kw == float(floor_kw) and float(floor_kw) in DCR_PRICE_TABLE:
            return DCR_PRICE_TABLE[float(floor_kw)]
        elif floor_kw in DCR_PRICE_TABLE and ceil_kw in DCR_PRICE_TABLE:
            ratio = capacity_kw - floor_kw
            cost = DCR_PRICE_TABLE[float(floor_kw)] + ratio * (DCR_PRICE_TABLE[float(ceil_kw)] - DCR_PRICE_TABLE[float(floor_kw)])
            return round(cost, 2)
        elif capacity_kw < 1.0:
            return round(capacity_kw * 75000.0, 2)

    # For systems > 10 kW or non-residential commercial/GHS
    if capacity_kw <= 10.0:
        rate = 55000.0
    elif capacity_kw <= 50.0:
        rate = 48000.0
    else:
        rate = 42000.0

    gross_cost = capacity_kw * rate
    return round(gross_cost, 2)


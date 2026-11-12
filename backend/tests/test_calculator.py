import pytest
from app.services.capacity import calculate_capacity
from app.services.generation import calculate_generation
from app.services.installation_cost import calculate_installation_cost
from app.services.subsidy import calculate_subsidy
from app.services.financial_analysis import calculate_financials

def test_subsidy_piecewise_residential():
    # 1 kW standard
    assert calculate_subsidy(1.0, category_id=1, is_special_category=False) == 30000.0

    # 2 kW standard
    assert calculate_subsidy(2.0, category_id=1, is_special_category=False) == 60000.0

    # 2.5 kW standard: 60k + (0.5 * 18k) = 69,000
    assert calculate_subsidy(2.5, category_id=1, is_special_category=False) == 69000.0

    # 3 kW standard (Capped at 78,000)
    assert calculate_subsidy(3.0, category_id=1, is_special_category=False) == 78000.0

    # 5 kW standard (Still capped at 78,000)
    assert calculate_subsidy(5.0, category_id=1, is_special_category=False) == 78000.0

def test_subsidy_special_category():
    # 1 kW special
    assert calculate_subsidy(1.0, category_id=1, is_special_category=True) == 33000.0

    # 2 kW special
    assert calculate_subsidy(2.0, category_id=1, is_special_category=True) == 66000.0

    # 3 kW special (Capped at 85,800)
    assert calculate_subsidy(3.0, category_id=1, is_special_category=True) == 85800.0

    # 5 kW special (Capped at 85,800)
    assert calculate_subsidy(5.0, category_id=1, is_special_category=True) == 85800.0

def test_subsidy_ghs_rwa():
    # GHS / RWA gets 18,000 INR/kW up to 500 kW
    assert calculate_subsidy(10.0, category_id=2, is_special_category=False) == 180000.0
    assert calculate_subsidy(50.0, category_id=2, is_special_category=False) == 900000.0
    # Special category states get 19,800 INR/kW
    assert calculate_subsidy(10.0, category_id=2, is_special_category=True) == 198000.0

def test_subsidy_non_residential():
    # Commercial (3), Industrial (4), Institutional (5), Govt (6) receive 0 direct central CFA
    for cat in [3, 4, 5, 6]:
        assert calculate_subsidy(10.0, category_id=cat) == 0.0

def test_capacity_sizing_and_roof_limit():
    # Small bill (approx 1 kW recommended)
    cap, sqft, sqm, units, warnings = calculate_capacity(
        average_bill=1000.0,
        tariff_rate=7.0,
        daily_yield=4.3,
        available_roof_area=1000.0
    )
    assert cap >= 1.0
    assert sqft == cap * 100.0

    # Constrained rooftop (150 sq.ft. can only fit 1 kW)
    cap_c, _, _, _, warnings_c = calculate_capacity(
        average_bill=5000.0,
        tariff_rate=7.0,
        daily_yield=4.3,
        available_roof_area=150.0
    )
    assert cap_c <= 1.5
    assert len(warnings_c) > 0

def test_installation_cost_tiers():
    # 1 kW: 75,000
    assert calculate_installation_cost(1.0) == 75000.0
    # 2 kW: 140,000
    assert calculate_installation_cost(2.0) == 140000.0
    # 3 kW: 200,000 (Base)
    assert calculate_installation_cost(3.0) == 200000.0
    # 4 kW: 260,000 (+60k)
    assert calculate_installation_cost(4.0) == 260000.0
    # 5 kW: 320,000 (+60k as requested by Sir)
    assert calculate_installation_cost(5.0) == 320000.0
    # 6 kW: 380,000 (+60k)
    assert calculate_installation_cost(6.0) == 380000.0
    # 8 kW: 500,000
    assert calculate_installation_cost(8.0) == 500000.0
    # 10 kW: 620,000
    assert calculate_installation_cost(10.0) == 620000.0

def test_financial_analysis_protection():
    # Zero division protection
    share, d_save, a_save, co2, roi, payback = calculate_financials(
        gross_cost=0.0,
        subsidy=0.0,
        kwh_year=0.0,
        tariff_rate=0.0,
        monthly_units=0.0
    )
    assert payback == 0.0
    assert roi == 0.0
    assert d_save == 0.0


# PM Surya Ghar Formula Verification Report

This document records the verification of calculations implemented in MB Solar Hub Solar Rooftop Calculator against official Ministry of New and Renewable Energy (MNRE) guidelines and the live PM Surya Ghar portal.

### 1. PM Surya Ghar Central Financial Assistance (CFA) Subsidy

| System Capacity | Standard States CFA | Special Category States CFA | Verification Reference |
| :--- | :--- | :--- | :--- |
| **Up to 2 kW** | ₹30,000 per kW (₹60,000 for 2 kW) | ₹33,000 per kW (₹66,000 for 2 kW) | MNRE PM Surya Ghar Operational Guidelines |
| **Additional 2 to 3 kW** | ₹18,000 per kW | ₹19,800 per kW | MNRE Operational Guidelines |
| **3 kW and Above** | Capped at **₹78,000** | Capped at **₹85,800** | National Portal (pmsuryaghar.gov.in) |
| **Non-Residential** | **₹0** (No central subsidy) | **₹0** | Commercial/Industrial excluded from residential CFA |

### 2. Capacity Sizing Engine

* **Monthly Energy Demand (kWh):** `Average Monthly Bill (₹) / State Electricity Tariff (₹/kWh)`
* **Daily Energy Demand (kWh):** `Monthly Units / 30.0`
* **Raw Capacity (kW):** `Daily Units / Location Daily Solar Yield (kWh/kW/day)`
* **Roof Physical Constraint:** `Available Roof Area (sq. ft.) / 100.0 sq. ft. per kW`
* **Recommended Capacity:** Selected as `min(Sized kW, Physical Roof Limit)`, rounded to integer or 0.5 kW intervals.

### 3. Generation & Environmental Offsets

* **Daily Generation:** `Capacity (kW) × Location Daily Specific Yield (kWh/kW/day)`
* **Annual Generation:** `Daily Generation × 365 days`
* **Avoided CO2 Factor:** `0.82 kg CO2 / kWh` (Central Electricity Authority benchmark)
* **Simple Payback:** `Net Consumer Share (₹) / Annual Electricity Bill Savings (₹)`


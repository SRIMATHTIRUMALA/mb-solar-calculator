# MB Solar Hub — Solar Rooftop Calculator

A production-ready Solar Rooftop Sizing & Subsidy Calculator built for **MB Solar Hub** (India's #1 Solar Aggregator Platform), based on the official Ministry of New and Renewable Energy (MNRE) **PM Surya Ghar: Muft Bijli Yojana** portal and the **SUNtosh** calculator engine.

---

## 🌟 Key Features

* **Authentic PM Surya Ghar Sizing:** Accurate capacity estimation offsetting ~100% of household monthly consumption.
* **Piecewise Subsidy Engine:** Computes official Central Financial Assistance (₹30,000 for 1 kW, ₹60,000 for 2 kW, capped at ₹78,000 for ≥3 kW; ₹85,800 in special category states).
* **Interactive Dynamic Slider:** Real-time 1 kW to 100 kW slider dynamically recalculating costs, subsidies, generation, and payback on the fly.
* **Investment Breakdown Chart:** Recharts Doughnut chart showing Subsidy vs Estimated Consumer Share (`#3C8EE3` and `#015296`).
* **SUNtosh AI Voice Assistant:** Built-in speech synthesis (English & Hindi) reading out solar analysis aloud, plus voice dictation for monthly bills.
* **Aggregator Vendor Hook:** Dedicated lead capture modal connecting consumers with verified nearby empaneled solar vendors for free site visits.
* **Fully Responsive & Polished UI:** Tailored with official MB Solar Hub branding, Poppins typography, and modern micro-animations.

---

## 🏗️ Project Architecture

```text
mb-solar-hub-calculator/
├── backend/                  # Python 3.12+ / FastAPI / Pydantic / pytest
│   ├── app/
│   │   ├── api/routes.py     # Endpoints: /health, /config, /states, /calculate, /calculate-subsidy
│   │   ├── services/         # Independent sizing, generation, cost, subsidy & financial modules
│   │   ├── data/             # states.json (36 States & UTs) and categories.json
│   │   └── main.py           # FastAPI server with CORS & error handlers
│   └── tests/                # 12 automated pytest unit & integration tests
│
├── frontend/                 # React 19 / Vite / TypeScript / Tailwind CSS
│   ├── src/
│   │   ├── components/       # Header, CalculatorForm, ResultsDisplay, CostChart, LeadModal
│   │   ├── hooks/useSpeech.ts# Web Speech API synthesis & recognition
│   │   └── services/api.ts   # Centralized API client with fallback resilience
│   └── public/images/        # Original MB Solar Hub branding logo
│
└── reference/                # Specification, formula verification, test cases & assumptions
```

---

## 🚀 Quick Start (Local Development)

### 1. Start the Python FastAPI Backend

```bash
cd backend
python -m pip install -r requirements.txt
$env:PYTHONPATH="."  # On Windows PowerShell (or export PYTHONPATH="." on Linux/Mac)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
*API Swagger Documentation will be live at `http://127.0.0.1:8000/docs`.*

### 2. Run Backend Tests

```bash
cd backend
$env:PYTHONPATH="."
python -m pytest tests/ -v
```

### 3. Start the React Frontend

```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 📦 Production Build

```bash
cd frontend
npm run build
```
Generates optimized, minified production assets in `frontend/dist/`.


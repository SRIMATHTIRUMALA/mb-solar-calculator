from fastapi import APIRouter, HTTPException, status, Response
from typing import List, Dict, Any
from datetime import datetime
import json
import os
import re
import httpx

from app.schemas.calculator import (
    CalculationRequest,
    SubsidyRecalculateRequest,
    CalculationResponse,
    LeadRequest
)
from app.services.electricity_tariff import load_states, load_categories, get_state_by_id
from app.services.capacity import calculate_capacity
from app.services.generation import calculate_generation
from app.services.installation_cost import calculate_installation_cost
from app.services.subsidy import calculate_subsidy
from app.services.financial_analysis import calculate_financials

router = APIRouter()

LEADS_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "leads.json")

def save_lead_to_storage(lead_dict: Dict[str, Any]):
    leads = []
    if os.path.exists(LEADS_FILE):
        try:
            with open(LEADS_FILE, "r", encoding="utf-8") as f:
                leads = json.load(f)
        except Exception:
            leads = []
    leads.append(lead_dict)
    with open(LEADS_FILE, "w", encoding="utf-8") as f:
        json.dump(leads, f, indent=2, ensure_ascii=False)

@router.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "MB Solar Hub Calculator Engine",
        "version": "1.0.0"
    }

@router.get("/config", tags=["Configuration"])
def get_calculator_config():
    return {
        "appName": "MB Solar Hub Rooftop Calculator",
        "referenceStandard": "PM Surya Ghar: Muft Bijli Yojana (MNRE)",
        "defaultRoofAreaSqFt": 1000.0,
        "sqFtPerKw": 100.0,
        "maxCapacityKw": 100.0,
        "cfaCapStandard": 78000.0,
        "cfaCapSpecial": 85800.0
    }

@router.get("/states", response_model=List[Dict[str, Any]], tags=["Data"])
def get_states():
    return load_states()

@router.get("/categories", response_model=List[Dict[str, Any]], tags=["Data"])
def get_categories():
    return load_categories()

@router.post("/calculate", response_model=CalculationResponse, tags=["Calculations"])
def calculate_solar(req: CalculationRequest):
    state = get_state_by_id(req.stateId)
    tariff_rate = state.get("avgTariff", 6.8)
    if req.category in [3, 4]:  # Commercial / Offices or Industrial
        tariff_rate = round(tariff_rate * 1.35, 2)
    daily_yield = state.get("dailyYield", 4.3)
    is_special = state.get("isSpecialCategory", False)

    capacity_kw, req_area_sqft, req_area_sqm, monthly_units, warnings = calculate_capacity(
        average_bill=req.averageBill,
        tariff_rate=tariff_rate,
        daily_yield=daily_yield,
        available_roof_area=req.roofArea,
        area_type=req.areaType,
        requested_capacity=req.capacityKw or 1.0,
        is_from_subsidy_page=req.isFromSubsidyPage
    )

    kwh_day, kwh_year = calculate_generation(capacity_kw, daily_yield)
    gross_cost = calculate_installation_cost(capacity_kw, req.category)
    subsidy = calculate_subsidy(
        capacity_kw=capacity_kw,
        category_id=req.category,
        is_special_category=is_special,
        gross_cost=gross_cost
    )

    consumer_share, saving_day, saving_year, saving_emission, roi, payback = calculate_financials(
        gross_cost=gross_cost,
        subsidy=subsidy,
        kwh_year=kwh_year,
        tariff_rate=tariff_rate,
        monthly_units=monthly_units
    )

    if req.category == 1:
        scheme_desc = "PM Surya Ghar central subsidy applied (up to ₹78,000 max for residential)"
    elif req.category == 2:
        scheme_desc = "PM Surya Ghar GHS/RWA CFA subsidy applied (₹18,000/kW up to 500 kW for society common facilities)"
    elif req.category == 3:
        scheme_desc = "Commercial Offices qualify for 40% Accelerated Depreciation tax deduction under Sec 32"
    else:
        scheme_desc = "Industrial & Non-residential enjoy high daytime grid offset and commercial net-metering"

    assumptions = [
        f"State Tariff: ₹{tariff_rate:.2f}/kWh for {state.get('stateName')}",
        f"Solar Yield: {daily_yield:.1f} kWh/kW/day average",
        scheme_desc,
        "Turnkey installation includes Tier-1 solar modules, grid inverter, and mounting structures",
        "Estimates are indicative and subject to exact DISCOM net-metering approvals and vendor quotation"
    ]

    return CalculationResponse(
        capacity=capacity_kw,
        areaSqFt=req_area_sqft,
        areaSqm=req_area_sqm,
        projectCost=gross_cost,
        subsidyCost=subsidy,
        consumerShare=consumer_share,
        kwhDay=kwh_day,
        kwhYear=kwh_year,
        savingDay=saving_day,
        savingYear=saving_year,
        savingEmission=saving_emission,
        returnOnInvest=roi,
        payBack=payback,
        monthlyUnits=monthly_units,
        tariffRate=tariff_rate,
        assumptions=assumptions,
        warnings=warnings,
        calculationVersion="1.0.0"
    )

@router.post("/calculate-subsidy", response_model=CalculationResponse, tags=["Calculations"])
def recalculate_subsidy(req: SubsidyRecalculateRequest):
    state = get_state_by_id(req.stateId)
    tariff_rate = state.get("avgTariff", 6.8)
    if req.category in [3, 4]:  # Commercial / Offices or Industrial
        tariff_rate = round(tariff_rate * 1.35, 2)
    daily_yield = state.get("dailyYield", 4.3)
    is_special = state.get("isSpecialCategory", False)

    capacity_kw, req_area_sqft, req_area_sqm, monthly_units, warnings = calculate_capacity(
        average_bill=req.averageBill,
        tariff_rate=tariff_rate,
        daily_yield=daily_yield,
        available_roof_area=req.roofArea,
        area_type=req.areaType,
        requested_capacity=req.capacityKw,
        is_from_subsidy_page=True
    )

    kwh_day, kwh_year = calculate_generation(capacity_kw, daily_yield)
    gross_cost = calculate_installation_cost(capacity_kw, req.category)
    subsidy = calculate_subsidy(
        capacity_kw=capacity_kw,
        category_id=req.category,
        is_special_category=is_special,
        gross_cost=gross_cost
    )

    consumer_share, saving_day, saving_year, saving_emission, roi, payback = calculate_financials(
        gross_cost=gross_cost,
        subsidy=subsidy,
        kwh_year=kwh_year,
        tariff_rate=tariff_rate,
        monthly_units=monthly_units
    )

    return CalculationResponse(
        capacity=capacity_kw,
        areaSqFt=req_area_sqft,
        areaSqm=req_area_sqm,
        projectCost=gross_cost,
        subsidyCost=subsidy,
        consumerShare=consumer_share,
        kwhDay=kwh_day,
        kwhYear=kwh_year,
        savingDay=saving_day,
        savingYear=saving_year,
        savingEmission=saving_emission,
        returnOnInvest=roi,
        payBack=payback,
        monthlyUnits=monthly_units,
        tariffRate=tariff_rate,
        assumptions=[
            f"State Tariff: ₹{tariff_rate:.2f}/kWh for {state.get('stateName')}",
            f"Solar Yield: {daily_yield:.1f} kWh/kW/day average",
            "Adjusted dynamically via capacity slider"
        ],
        warnings=warnings,
        calculationVersion="1.0.0"
    )

@router.post("/leads", tags=["Leads"])
def capture_lead(lead: LeadRequest):
    """
    Captures customer inquiries and vendor quotation requests.
    Saves to backend storage so MB Solar Hub administrators can view and assign to nearby installers.
    """
    lead_data = {
        "id": f"LEAD-{int(datetime.now().timestamp())}",
        "name": lead.name,
        "phone": lead.phone,
        "city": lead.city,
        "stateName": lead.stateName,
        "capacityKw": lead.capacityKw,
        "subsidyAmount": lead.subsidyAmount,
        "submittedAt": datetime.now().isoformat(),
        "status": "NEW"
    }
    save_lead_to_storage(lead_data)
    return {
        "status": "success",
        "message": "Lead received successfully. Verified installers will be assigned.",
        "leadId": lead_data["id"]
    }

@router.get("/leads", tags=["Leads"])
def get_all_leads():
    """
    Returns all submitted customer leads for MB Solar Hub administrators.
    """
    if os.path.exists(LEADS_FILE):
        try:
            with open(LEADS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

TTS_CACHE: Dict[str, bytes] = {}

def split_text_into_chunks(text: str, max_chars: int = 110) -> List[str]:
    # Split by sentence enders (. ! ? । \n) or comma followed by space
    parts = re.split(r'([।\.\!\?\n]+|,\s+)', text)
    chunks = []
    current = ""
    for piece in parts:
        if not piece:
            continue
        if len(current) + len(piece) <= max_chars:
            current += piece
        else:
            if current.strip():
                chunks.append(current.strip())
            current = piece
    if current.strip():
        chunks.append(current.strip())
    return [c for c in chunks if c.strip()]

@router.get("/tts", tags=["Voice"])
async def text_to_speech(text: str, lang: str = "te"):
    """
    High-fidelity Cloud TTS endpoint for Telugu, Hindi, and English.
    Ensures clear, native voice even when client OS has no local Telugu TTS voice.
    Features text cleaning for numbers/currency and high-speed in-memory caching.
    """
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    tl = "te" if "te" in lang.lower() else ("hi" if "hi" in lang.lower() else "en")

    # Clean text to ensure fluid natural cadence and accurate decimal pronunciation
    clean_text = re.sub(r'(\d+),(\d+)', r'\1\2', text)
    if tl == "te":
        clean_text = clean_text.replace("₹", "రూపాయలు ")
        # Convert any decimals like 4.5 in Telugu into "4 పాయింట్ 5" so TTS never says "4 and 5"
        clean_text = re.sub(r'(\d+)\.(\d+)', r'\1 పాయింట్ \2', clean_text)
    elif tl == "hi":
        clean_text = clean_text.replace("₹", "रुपये ")
        clean_text = re.sub(r'(\d+)\.(\d+)', r'\1 दशमलव \2', clean_text)
    else:
        clean_text = clean_text.replace("₹", "rupees ")
        clean_text = re.sub(r'(\d+)\.(\d+)', r'\1 point \2', clean_text)

    cache_key = f"{tl}:{clean_text.strip()}"
    if cache_key in TTS_CACHE:
        return Response(content=TTS_CACHE[cache_key], media_type="audio/mpeg")

    chunks = split_text_into_chunks(clean_text, max_chars=110)
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    combined_audio = bytearray()
    async with httpx.AsyncClient(timeout=10.0) as client:
        for chunk in chunks:
            if not chunk.strip():
                continue
            params = {
                "ie": "UTF-8",
                "q": chunk,
                "tl": tl,
                "client": "tw-ob"
            }
            try:
                resp = await client.get("https://translate.google.com/translate_tts", params=params, headers=headers)
                if resp.status_code == 200:
                    combined_audio.extend(resp.content)
            except Exception as e:
                print(f"TTS fetch error for chunk '{chunk}': {e}")
                
    if not combined_audio:
        raise HTTPException(status_code=502, detail="Failed to synthesize speech")

    audio_bytes = bytes(combined_audio)
    TTS_CACHE[cache_key] = audio_bytes
        
    return Response(content=audio_bytes, media_type="audio/mpeg")

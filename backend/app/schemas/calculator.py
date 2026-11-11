from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class CalculationRequest(BaseModel):
    stateId: int = Field(..., ge=1, le=36, description="State ID (1-36)")
    category: int = Field(..., ge=1, le=6, description="Consumer Category ID (1=Residential)")
    averageBill: float = Field(..., gt=0, le=1000000, description="Average Monthly Electricity Bill in INR")
    areaType: int = Field(1, description="1 for Sq. Ft, 2 for Sq. Meters")
    roofArea: float = Field(1000.0, gt=0, le=500000, description="Available Rooftop Area")
    capacityKw: Optional[float] = Field(1.0, ge=0.5, le=100.0, description="Requested Solar Capacity in kW")
    sanctionLoad: Optional[float] = Field(1.0, ge=0.5, le=500.0, description="Sanctioned Grid Load in kW")
    invest: Optional[float] = Field(1000.0, ge=0, description="Investment budget amount")
    isFromSubsidyPage: bool = Field(False, description="Flag indicating recalculation from results slider")

    @field_validator("averageBill")
    @classmethod
    def validate_bill(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Average monthly bill must be greater than zero.")
        return round(v, 2)

class SubsidyRecalculateRequest(BaseModel):
    capacityKw: float = Field(..., ge=1.0, le=100.0, description="Adjusted Capacity in kW")
    stateId: int = Field(..., ge=1, le=36)
    category: int = Field(1, ge=1, le=6)
    averageBill: float = Field(..., gt=0)
    areaType: int = Field(1)
    roofArea: float = Field(1000.0, gt=0)
    sanctionLoad: Optional[float] = Field(1.0)
    invest: Optional[float] = Field(1000.0)
    isFromSubsidyPage: bool = Field(True)

class CalculationResponse(BaseModel):
    capacity: float = Field(..., description="Solar Capacity (kW)")
    areaSqFt: float = Field(..., description="Rooftop Area Required (sq. ft.)")
    areaSqm: float = Field(..., description="Rooftop Area Required (sq. meters)")
    projectCost: float = Field(..., description="Gross Project Cost (INR)")
    subsidyCost: float = Field(..., description="Estimated PM Surya Ghar Subsidy (INR)")
    consumerShare: float = Field(..., description="Estimated Consumer Share (INR)")
    kwhDay: float = Field(..., description="Daily Electricity Generation (kWh)")
    kwhYear: float = Field(..., description="Annual Electricity Generation (kWh)")
    savingDay: float = Field(..., description="Estimated Daily Savings (INR)")
    savingYear: float = Field(..., description="Estimated Annual Savings (INR)")
    savingEmission: float = Field(..., description="Annual CO2 Reduction (Tonnes)")
    returnOnInvest: float = Field(..., description="Return on Investment (%)")
    payBack: float = Field(..., description="Simple Payback Period (Years)")
    monthlyUnits: float = Field(..., description="Estimated Monthly Consumption (kWh)")
    tariffRate: float = Field(..., description="Applied Electricity Tariff (INR/kWh)")
    assumptions: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    calculationVersion: str = Field("1.0.0", description="Engine version")

class LeadRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    city: str = Field(..., min_length=2, max_length=100)
    capacityKw: float = Field(..., gt=0)
    subsidyAmount: float = Field(..., ge=0)
    stateName: Optional[str] = Field("Unknown")

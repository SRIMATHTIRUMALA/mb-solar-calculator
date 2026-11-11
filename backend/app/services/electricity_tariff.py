"""
Module E: Electricity Tariff & State Assumptions
Retrieves state-specific electricity tariff rates, solar daily yield, and special category flags.
"""
import json
import os
from typing import Dict, Any, List

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
STATES_FILE = os.path.join(DATA_DIR, "states.json")
CATEGORIES_FILE = os.path.join(DATA_DIR, "categories.json")

def load_states() -> List[Dict[str, Any]]:
    with open(STATES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def load_categories() -> List[Dict[str, Any]]:
    with open(CATEGORIES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def get_state_by_id(state_id: int) -> Dict[str, Any]:
    states = load_states()
    for state in states:
        if state["stateId"] == state_id:
            return state
    # Default fallback to India national average if ID not found
    return {
        "stateId": state_id,
        "stateName": "Standard / All India",
        "avgTariff": 6.8,
        "dailyYield": 4.3,
        "isSpecialCategory": False,
        "discoms": []
    }


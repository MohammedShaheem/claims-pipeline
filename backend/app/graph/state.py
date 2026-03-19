from typing import TypedDict, List, Dict

"""
    state object -> passed between LangGraph nodes.
"""

class ClaimState(TypedDict):
    claim_id: str
    file_url: str   

    pages: List[Dict]
    classified_pages: Dict

    identity_data: Dict
    discharge_data: Dict
    bill_data: Dict
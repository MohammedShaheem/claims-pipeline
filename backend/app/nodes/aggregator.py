from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

"""Combine all extracted data into final claim response."""
def aggregator_node(state):
    try:
        result = {
            "claim_id": state.get("claim_id", ""),

            "identity": state.get("identity_data", {
                "patient_name": "",
                "dob": "",
                "policy_number": "",
                "id_number": ""
            }),

            "discharge_summary": state.get("discharge_data", {
                "diagnosis": "",
                "admit_date": "",
                "discharge_date": "",
                "doctor_name": "",
                "hospital_name": ""
            }),

            "bill": state.get("bill_data", {
                "items": [],
                "total": ""
            })
        }

        logger.info("Aggregation completed successfully")

        return result

    except Exception as e:
        logger.error(f"Aggregation failed: {e}")

        return {
            "claim_id": state.get("claim_id", ""),
            "identity": {},
            "discharge_summary": {},
            "bill": {}
        }
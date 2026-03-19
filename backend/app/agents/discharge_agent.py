import json
import logging

from ..utils.llm import LLMProvider
from ..utils.llm_call import call_llm_with_retry

logger = logging.getLogger(__name__)


def DischargeAgentNode(state: dict):
    try:
        classified = state.get("classified_pages", {})
        pages = classified.get("discharge_summary", [])

        if not pages:
            logger.info("No discharge summary documents found")
            return {
                "discharge_data": empty_response()
            }

        llm = LLMProvider.get_llm()

        text = "\n".join([p.get("text", "") for p in pages])[:8000]

        prompt = f"""
You are a medical discharge summary parser.

Extract the following fields from the document.

Return STRICT JSON only (no explanation, no markdown):

{{
  "diagnosis": "",
  "admit_date": "",
  "discharge_date": "",
  "doctor_name": "",
  "hospital_name": ""
}}

Rules:
- Dates should be in readable format if possible
- If any field is missing, leave it empty

Document:
{text}
"""

        response = call_llm_with_retry(llm, prompt)
        raw_output = response.content.strip()

        # Parse JSON safely
        try:
            discharge_data = json.loads(raw_output)
        except json.JSONDecodeError:
            logger.warning("Invalid JSON from LLM, attempting cleanup")
            discharge_data = safe_json_parse(raw_output)

        # Validate structure
        discharge_data = validate_output(discharge_data)

        logger.info("Discharge extraction completed successfully")

        return {
            "discharge_data": discharge_data
        }

    except Exception as e:
        logger.error(f"Discharge Agent failed: {e}")

        return {
            "discharge_data": empty_response()
        }


def safe_json_parse(raw_text: str):
    try:
        start = raw_text.find("{")
        end = raw_text.rfind("}") + 1

        if start != -1 and end != -1:
            return json.loads(raw_text[start:end])

    except Exception as e:
        logger.error(f"Fallback JSON parsing failed: {e}")

    return empty_response()


def validate_output(data: dict):
    if not isinstance(data, dict):
        return empty_response()

    return {
        "diagnosis": str(data.get("diagnosis", "")),
        "admit_date": str(data.get("admit_date", "")),
        "discharge_date": str(data.get("discharge_date", "")),
        "doctor_name": str(data.get("doctor_name", "")),
        "hospital_name": str(data.get("hospital_name", "")),
    }


def empty_response():
    return {
        "diagnosis": "",
        "admit_date": "",
        "discharge_date": "",
        "doctor_name": "",
        "hospital_name": "",
    }
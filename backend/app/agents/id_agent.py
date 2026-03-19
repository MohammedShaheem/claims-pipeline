import json
import logging

from ..utils.llm import LLMProvider
from ..utils.llm_call import call_llm_with_retry

logger = logging.getLogger(__name__)


def IDAgentNode(state: dict):
    try:
        classified = state.get("classified_pages", {})
        pages = classified.get("identity_document", [])

        if not pages:
            logger.info("No identity documents found")
            return {
                "identity_data": {}
            }

        llm = LLMProvider.get_llm()

        # Combine text safely
        text = "\n".join([p.get("text", "") for p in pages])[:6000]

        prompt = f"""
You are a medical insurance document parser.

Extract the following fields from the document.

Return STRICT JSON only (no explanation, no markdown):

{{
  "patient_name": "",
  "dob": "",
  "policy_number": "",
  "id_number": ""
}}

Document:
{text}
"""

        response = call_llm_with_retry(llm, prompt)
        raw_output = response.content.strip()

        # Parse JSON safely
        try:
            identity_data = json.loads(raw_output)
        except json.JSONDecodeError:
            logger.warning("Invalid JSON from LLM, attempting cleanup")
            identity_data = safe_json_parse(raw_output)

        logger.info("Identity extraction completed successfully")

        return {
            "identity_data": identity_data
        }

    except Exception as e:
        logger.error(f"ID Agent failed: {e}")

        return {
            "identity_data": {}
        }


def safe_json_parse(raw_text: str):
    try:
        start = raw_text.find("{")
        end = raw_text.rfind("}") + 1

        if start != -1 and end != -1:
            return json.loads(raw_text[start:end])

    except Exception as e:
        logger.error(f"Fallback JSON parsing failed: {e}")

    return {
        "patient_name": "",
        "dob": "",
        "policy_number": "",
        "id_number": "",
    }
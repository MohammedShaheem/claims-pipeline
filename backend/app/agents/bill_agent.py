import json
import logging
from ..utils.llm import LLMProvider
from ..utils.llm_call import call_llm_with_retry

logger = logging.getLogger(__name__)


def BillAgentNode(state):
    try:
        classified = state.get("classified_pages", {})
        pages = classified.get("itemized_bill", [])

        if not pages:
            return {"bill_data": empty_response()}

        llm = LLMProvider.get_llm()

        all_items = []
        total_sum = 0

        for page in pages:
            try:
                text = page.get("text", "")[:1500]

                prompt = f"""
                    You are a medical billing parser.

                    Return STRICT JSON:

                    {{
                    "items": [{{"name": "", "cost": ""}}],
                    "total": ""
                    }}

                    Document:
                    {text}
                    """

                response = call_llm_with_retry(llm, prompt)
                raw_output = response.content.strip()

                try:
                    data = json.loads(raw_output)
                except:
                    data = safe_json_parse(raw_output)

                data = validate_output(data)

                all_items.extend(data.get("items", []))

                try:
                    total_sum += float(data.get("total", 0))
                except:
                    pass

            except Exception as e:
                logger.error(f"Page bill parsing failed: {e}")

        return {
            "bill_data": {
                "items": all_items,
                "total": str(total_sum)
            }
        }

    except Exception as e:
        logger.error(f"Bill Agent failed: {e}")
        return {"bill_data": empty_response()}


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

    items = data.get("items", [])
    total = data.get("total", "")

    if not isinstance(items, list):
        items = []

    validated_items = []
    for item in items:
        if isinstance(item, dict):
            validated_items.append({
                "name": str(item.get("name", "")),
                "cost": str(item.get("cost", ""))
            })

    return {
        "items": validated_items,
        "total": str(total)
    }


def empty_response():
    return {
        "items": [],
        "total": ""
    }
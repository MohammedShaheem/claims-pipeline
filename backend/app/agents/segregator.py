from typing import Dict, List, Any
import logging
import time

from ..utils.llm import LLMProvider
from ..utils.pdf_loader import extract_pages
from ..utils.llm_call import call_llm_with_retry

logger = logging.getLogger(__name__)


def SegregatorNode(state):
    try:
        llm = LLMProvider.get_llm()

        pages = extract_pages(state["file_url"])  
        
        classified = {label: [] for label in {
            "claim_forms",
            "cheque_or_bank_details",
            "identity_document",
            "itemized_bill",
            "discharge_summary",
            "prescription",
            "investigation_report",
            "cash_receipt",
            "other",
        }}

        for page in pages:
            try:
                prompt = f"""
                    You are a STRICT medical document classifier.

                    You MUST return EXACTLY ONE label from the list below.

                    Do NOT explain.
                    Do NOT justify.
                    Do NOT output sentences.
                    Do NOT output multiple lines.

                    Allowed labels:
                    claim_forms
                    cheque_or_bank_details
                    identity_document
                    itemized_bill
                    discharge_summary
                    prescription
                    investigation_report
                    cash_receipt
                    other

                    If unsure, return: other

                    Document:
                    {page["text"][:1500]}

                    Answer (one word only):
                    """
                
                response = call_llm_with_retry(llm, prompt)
                time.sleep(0.5)
                
                raw = response.content.strip().lower()

                label = "other"
                for key in classified.keys():
                    if key in raw:
                        label = key
                        break

                classified[label].append(page)

            except Exception as e:
                classified["other"].append(page)

        return {
            "pages": pages,
            "classified_pages": classified
        }

    except Exception as e:
        raise RuntimeError(f"Segregator failed: {e}")
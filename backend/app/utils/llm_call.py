import time

def call_llm_with_retry(llm, prompt, retries=3):
    for i in range(retries):
        try:
            return llm.invoke(prompt)
        except Exception as e:
            if "rate_limit" in str(e).lower():
                wait = (i + 1) * 5
                print(f" Rate limited. Retrying in {wait}s...")
                time.sleep(wait)
            else:
                raise e
    raise Exception("LLM failed after retries")
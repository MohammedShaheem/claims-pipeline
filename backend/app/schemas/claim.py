from pydantic import BaseModel

class ClaimResponse(BaseModel):
    claim_id: str
    status: str
    amount: float | None = None
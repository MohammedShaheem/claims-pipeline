from fastapi import APIRouter, UploadFile, File, Form
from app.services.claim_service import process_claim_service

router = APIRouter()


""" basic validation """

@router.post("/process")
async def process_claim(
    claim_id: str = Form(...),
    file: UploadFile = File(...)
):
    return await process_claim_service(claim_id, file)
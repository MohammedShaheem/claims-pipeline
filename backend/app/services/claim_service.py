import shutil
import os
from uuid import uuid4
from fastapi import HTTPException
import asyncio

from app.graph.graph import build_graph
from ..services.storage_service import upload_file_to_s3

graph = build_graph()



async def process_claim_service(claim_id, file):
    
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(400, "Only PDF allowed")
        
        

        
        file_url = await asyncio.to_thread(upload_file_to_s3, file)
        

        
        result = await graph.ainvoke({
            "claim_id": claim_id,
            "file_url": file_url,

            "pages": [],
            "classified_pages": {},

            "identity_data": {},
            "discharge_data": {},
            "bill_data": {}
        })
        

        return result

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(500, str(e))
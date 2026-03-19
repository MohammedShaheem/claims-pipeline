import boto3
from uuid import uuid4
from fastapi import HTTPException

from app.core.config.base import settings



s3 = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION,
)

bucket_name = settings.AWS_BUCKET_NAME
region_name = settings.AWS_REGION

def upload_file_to_s3(file):
    
    
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="Invalid file")

    try:
        
        file_key = f"claims/{uuid4().hex}_{file.filename}"
       

        
        s3.upload_fileobj(
            file.file,
            bucket_name,
            file_key,
            ExtraArgs={
                "ContentType": file.content_type or "application/octet-stream"
            }
        )

        
        return s3.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": settings.AWS_BUCKET_NAME,
            "Key": file_key
        },
        ExpiresIn=3600
    )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file to S3: {str(e)}"
        )
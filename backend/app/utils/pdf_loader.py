from pypdf import PdfReader
import requests
from io import BytesIO


"""
    utility class for extracting text from PDF files.
    downloading file from url
    converting to file like object
"""

def extract_pages(file_url: str):
    try:
        

        response = requests.get(file_url, timeout=10)
        

        response.raise_for_status()

        
        from io import BytesIO
        pdf_file = BytesIO(response.content)

        from pypdf import PdfReader
        reader = PdfReader(pdf_file)

        

        pages = []

        for i, page in enumerate(reader.pages):
            try:
                text = page.extract_text() or ""
            except Exception as e:
                
                text = ""

            pages.append({
                "page_number": i + 1,
                "text": text
            })

        return pages

    except Exception as e:
         
        raise RuntimeError("Failed to process PDF file") from e
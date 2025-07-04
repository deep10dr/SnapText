from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.baseToImg import base64_to_image
from utils.extract import extract_text_from_image

app = FastAPI()

# ✅ Allow your frontend domain explicitly
origins = [
    "https://snap-text-eight.vercel.app",  # Your deployed frontend
    "http://localhost:5173",               # Optional: for local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # DO NOT use ["*"] here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageData(BaseModel):
    image: str

@app.post("/img")
async def extracText(data: ImageData):
    image = base64_to_image(data.image)
    result = extract_text_from_image(image)
    print(result)

    if image is None:
        return {"error": "Could not decode image"}

    return {"message": "Image decoded successfully", "data": result}

import cv2
import pytesseract
import os
from PIL import Image
import tempfile
import platform

# Set Tesseract path only if running on Windows
if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# On Linux (like Render), tesseract will be installed via build.sh and be in the system path

def extract_text_from_image(image_np, pre_processor="thresh"):
    # Save temporary input image from numpy array
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
        cv2.imwrite(temp_file.name, image_np)
        image_path = temp_file.name

    # Read saved image
    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"Image not found or unreadable: {image_path}")
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Preprocessing
    if pre_processor == "thresh":
        gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    elif pre_processor == "blur":
        gray = cv2.medianBlur(gray, 3)

    # Save processed image to another temp file
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_gray:
        cv2.imwrite(temp_gray.name, gray)
        gray_path = temp_gray.name

    # Extract text using pytesseract
    text = pytesseract.image_to_string(Image.open(gray_path), lang='eng')

    # Clean up temporary files
    os.remove(image_path)
    os.remove(gray_path)

    return text.strip()

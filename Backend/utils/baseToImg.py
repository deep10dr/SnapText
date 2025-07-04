import cv2
import base64
import numpy as np

def base64_to_image(data: str):
    # Remove the data URI prefix if it exists
    if "," in data:
        _, encoded = data.split(",", 1)
    else:
        encoded = data

    # Decode base64 string to bytes
    decoded = base64.b64decode(encoded)

    # Convert to numpy array
    np_arr = np.frombuffer(decoded, np.uint8)

    # Decode image with OpenCV
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    return img

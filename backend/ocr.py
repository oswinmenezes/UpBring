import base64
import requests
import os
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()

# -------------------------------
# Function 1: OCR from image file       q
# -------------------------------
def send_image_as_base64(image_file_path, api_key):
    """
    Convert a local image to base64 and extract text using Qwen3-VL.

    Args:
        image_file_path (str): Path to the image file.
        api_key (str): Your Hugging Face/OpenAI API key.

    Returns:
        str: Extracted text from the image.
    """
    # Initialize client
    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=api_key
    )

    # Read image and convert to base64
    try:
        with open(image_file_path, "rb") as f:
            image_bytes = f.read()
    except Exception as e:
        raise ValueError(f"Failed to read image: {e}")

    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    # Fixed prompt
    prompt = "Extract all readable text from this image and return as plain text."

    # Send request to model
    try:
        completion = client.chat.completions.create(
            model="Qwen/Qwen3-VL-8B-Instruct:novita",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
                    ]
                }
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"OCR failed: {e}")

 
import base64
import requests
import os
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()

# -------------------------------
# Function 1: OCR from image file
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


# --------------------------------------------
# Function 2: Streaming text from your endpoint
# --------------------------------------------
def ask_legal_ai(prompt, on_chunk, url="https://honest-poets-return.loca.lt/ask/"):
    """
    Send a prompt to a local/legal AI server and stream the response chunk by chunk.

    Args:
        prompt (str): The text prompt to send.
        on_chunk (callable): Function to handle each chunk of text as it arrives.
        url (str): The server endpoint (default is your localtunnel URL).
    """
    try:
        with requests.post(
            url,
            json={"prompt": prompt},
            headers={
                "Content-Type": "application/json",
                "Bypass-Tunnel-Reminder": "true"
            },
            stream=True
        ) as response:
            response.raise_for_status()
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    text_chunk = chunk.decode("utf-8")
                    on_chunk(text_chunk)
    except Exception as e:
        print(f"Streaming error: {e}")


# ----------------------
# Example usage
# ----------------------
if __name__ == "__main__":
    API_KEY = os.getenv('HUGGING_FACE_API')
    IMAGE_PATH = "resume.png"  # replace with your local image

    # 1️⃣ OCR
    extracted_text = send_image_as_base64(IMAGE_PATH, API_KEY)
    print("Extracted Text:\n", extracted_text)

    # 2️⃣ Streaming legal AI
    def handle_chunk(chunk):
        print("New chunk:", chunk)

    ask_legal_ai("Explain this legal clause.", handle_chunk)
    
send_image_as_base64("https://d1civoyjepycei.cloudfront.net/static/img/resume@2x.f8906757d43f.png",API_KEY)
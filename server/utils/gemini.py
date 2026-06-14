from google import genai
from google.genai import types
import json
import os

API_KEY = os.getenv("GENAI_API_KEY")
client = genai.Client(api_key=API_KEY)


def generate_gemini_response(text):
    prompt = f"""
You are an expert multilingual fact-checking assistant specializing in misinformation detection.

Supported languages:
- English
- Bahasa Indonesia
- Mixed-language content

TASK
Analyze the provided text and classify it into ONE of the following categories:

- "hoax"
  The content contains false, fabricated, misleading, manipulated, or highly implausible claims.

- "valid"
  The content appears factual, reasonable, internally consistent, and aligns with commonly known verified information.

GUIDELINES

1. Do NOT assume a claim is true merely because it sounds professional.
2. Do NOT assume a claim is false merely because it sounds unusual.
3. Be especially cautious with:
   - Breaking news
   - Political claims
   - Health and medical advice
   - Celebrity news
   - Disaster reports
   - Viral social media posts
   - Financial or investment claims
4. If verification would normally require trusted external sources and the claim cannot be reliably assessed from general knowledge alone, choose "uncertain".
5. Avoid overconfidence.
6. Confidence must reflect certainty:
   - 0.90 - 1.00 : Very strong confidence
   - 0.70 - 0.89 : High confidence
   - 0.50 - 0.69 : Moderate confidence
   - Below 0.50 : Low confidence
7. Return ONLY valid JSON.
8. Do NOT include explanations, markdown, code blocks, or additional text.

REQUIRED OUTPUT FORMAT

{{
    "confidences": [
        {{
            "confidence": 0.0,
            "label": "hoax" | "valid"
        }}
    ],
    "label": "hoax" | "valid"
}}

TEXT TO ANALYZE:
{text}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )

    return json.loads(response.text)

from dotenv import load_dotenv

load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from gradio_client import Client
import os
from utils.ocr import OCRProcessor
from utils.preprocess import TextPreprocessor
from utils.crawler import Crawler
from utils.gemini import generate_gemini_response

app = Flask(__name__)
app.config["DEBUG"] = os.getenv("DEBUG", "False").lower() == "true"

CORS(app, origins=["*"])

client = Client("ardhptr21/hoax-detection-id")


class Inference:
    def __init__(self):
        self.ocr_processor = OCRProcessor()
        self.text_preprocessor = TextPreprocessor()

    def predict_llm(self, text):
        preprocessed_text = self.text_preprocessor.clean(text)
        return generate_gemini_response(preprocessed_text)

    def predict_custom(self, text):
        preprocessed_text = self.text_preprocessor.clean(text)
        return client.predict(text=preprocessed_text, api_name="/detect_hoax")

    def predict(self, text):
        try:
            return self.predict_llm(text)
        except Exception as e:
            print(f"LLM prediction failed: {e}")
            return self.predict_custom(text)


inference = Inference()


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)

    if data and "url" in data:
        url = data["url"]
        crawler = Crawler()
        text = crawler.crawl_berita(url)

        if text:
            return jsonify(inference.predict(text)), 200

        return (
            jsonify(
                {
                    "error": "Source doesn't allow content extraction, try copying the news text directly instead."
                }
            ),
            400,
        )

    elif data and "text" in data:
        return jsonify(inference.predict(data["text"])), 200

    elif "image" in request.files:
        image = request.files["image"]

        text = inference.ocr_processor.extract_text(image)

        if text:
            return jsonify(inference.predict(text)), 200

        return (
            jsonify(
                {
                    "error": "Failed to extract text from image, try typing the news text directly instead."
                }
            ),
            400,
        )

    return jsonify({"error": "No valid input provided."}), 400


if __name__ == "__main__":
    HOST = os.getenv("HOST", "localhost")
    PORT = int(os.getenv("PORT", 5000))

    app.run(host=HOST, port=PORT)

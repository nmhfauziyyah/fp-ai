from flask import Flask, request, jsonify
from gradio_client import Client
import os
from utils.ocr import OCRProcessor
from utils.preprocess import TextPreprocessor
from utils.crawler import Crawler

app = Flask(__name__)
app.config["DEBUG"] = os.getenv("DEBUG", "False").lower() == "true"

client = Client("ardhptr21/hoax-detection-id")

class Inference:
    def __init__(self):
        self.ocr_processor = OCRProcessor()
        self.text_preprocessor = TextPreprocessor()        

    def predict(self, text):
        preprocessed_text = self.text_preprocessor.clean(text)
        result = client.predict(text=preprocessed_text, api_name="/detect_hoax")
        return result


inference = Inference()

@app.route("/predict", methods=["POST"])
def predict():
    # cek request apakah link atau text atau gambar
    if "url" in request.json:
        url = request.json["url"]
        crawler = Crawler()
        text = crawler.crawl_berita(url)
        if text:
            result = inference.predict(text)
            return jsonify(result), 200
        else:
            return jsonify({"error": "Failed to crawl the news content from the provided URL."}), 400
        
    elif "text" in request.json:
        text = request.json["text"]
        result = inference.predict(text)
        return jsonify(result), 200
    
    elif "image" in request.files:
        image = request.files["image"]
        text = inference.ocr_processor.extract_text_from_image(image)
        if text:
            result = inference.predict(text)
            return jsonify(result), 200
        else:
            return jsonify({"error": "Failed to extract text from the provided image."}), 400
        
    else:
        return jsonify({"error": "No valid input provided. Please provide a URL, text, or image."}), 400
    
    # data = request.get_json()
    # text = data.get("text", "")
    # if not text:
    #     return jsonify({"error": "No text provided"}), 400

    # result = inference.predict(text)
    # return jsonify(result), 200


if __name__ == "__main__":
    HOST = os.getenv("HOST", "localhost")
    PORT = int(os.getenv("PORT", 5000))

    app.run(host=HOST, port=PORT)

from flask import Flask, request, jsonify
from gradio_client import Client
import os

app = Flask(__name__)
app.config["DEBUG"] = os.getenv("DEBUG", "False").lower() == "true"

client = Client("ardhptr21/hoax-detection-id")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = client.predict(text=text, api_name="/detect_hoax")
    return jsonify(result), 200


if __name__ == "__main__":
    HOST = os.getenv("HOST", "localhost")
    PORT = int(os.getenv("PORT", 5000))

    app.run(host=HOST, port=PORT)

import gradio as gr
from transformers import pipeline
import os

classifier = pipeline(
    "text-classification",
    model="ardhptr21/hoax-detection-id",
    device=-1,
    token=os.environ["HF_TOKEN"],
)


def detect_hoax(text):
    result = classifier(text, truncation=True, max_length=256)[0]
    return {result["label"]: result["score"]}


demo = gr.Interface(
    fn=detect_hoax,
    inputs=gr.Textbox(lines=5, label="Input the text"),
    outputs=gr.Label(label="Detection Result"),
    title="Hoax Detection in Indonesian",
    description="Hoax detection model for Indonesian language",
)

if __name__ == "__main__":
    demo.launch(share=True)

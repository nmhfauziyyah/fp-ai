FROM python:3.12-alpine

WORKDIR /app

RUN apk add --no-cache tesseract-ocr tesseract-ocr-data-eng build-base gcc musl-dev libffi-dev jpeg-dev zlib-dev

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV HOST=0.0.0.0
ENV PORT=5000

EXPOSE 5000

CMD ["python", "app.py"]

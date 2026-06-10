# import easyocr

# class OCRProcessor:
#     def __init__(self):                
#         self.reader = easyocr.Reader(['id', 'en'], gpu=False)

#     def extract_text(self, image_path):
#         try:            
#             result = self.reader.readtext(image_path, detail=0, paragraph=True)
            
#             if not result:
#                 return None
                            
#             extracted_text = ' '.join(result)
#             return extracted_text
            
#         except Exception as e:
#             # print(f"Gagal memproses gambar {image_path}: {e}")
#             return None


import easyocr
import numpy as np
from PIL import Image


class OCRProcessor:
    def __init__(self):
        self.reader = easyocr.Reader(['id', 'en'], gpu=False)

    def extract_text(self, image_file):
        try:
            # Convert upload → PIL → numpy
            image = Image.open(image_file).convert("RGB")
            image = np.array(image)

            result = self.reader.readtext(
                image,
                detail=0,
                paragraph=True
            )

            if not result:
                return None

            extracted_text = " ".join(result)

            return extracted_text

        except Exception as e:
            print("OCR Error:", e)
            return None
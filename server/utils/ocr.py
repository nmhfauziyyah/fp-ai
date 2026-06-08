import easyocr

class OCRProcessor:
    def __init__(self):        
        # Inisialisasi ditaruh di sini agar tidak di-load berulang-ulang
        self.reader = easyocr.Reader(['id', 'en'], gpu=False)

    def extract_text(self, image_path):
        try:
            # paragraph=True bagus untuk mempertahankan struktur blok teks berita
            result = self.reader.readtext(image_path, detail=0, paragraph=True)
            
            if not result:
                return None
                
            # Gunakan spasi untuk menggabungkan list hasil bacaan
            extracted_text = ' '.join(result)
            return extracted_text
            
        except Exception as e:
            # print(f"Gagal memproses gambar {image_path}: {e}")
            return None

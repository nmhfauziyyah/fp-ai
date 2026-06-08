import re
import emoji
import html

class TextPreprocessor:
    def __init__(self):
        self.slang_dict = {
            "yg": "yang", "dgn": "dengan", "bgt": "banget", 
            "klo": "kalau", "hoax": "hoaks", "tdk": "tidak"
        }
        self.blacklisted_phrases = [
            "SCROLL TO CONTINUE WITH CONTENT",
            "BACA JUGA:",
            "ADVERTISMENT"
        ]

    def _remove_boilerplate(self, text):
        for phrase in self.blacklisted_phrases:
            text = re.sub(re.escape(phrase), '', text, flags=re.IGNORECASE)
        return text

    def _fix_artifacts(self, text):
        # 1. Fix Crawler Artifacts: Ubah &amp; jadi &, &quot; jadi ", dst.        
        text = html.unescape(text)

        # 2. Hapus zero-width space atau karakter unicode aneh bawaan web (\xa0, \u200b)
        text = text.replace('\xa0', ' ').replace('\u200b', '')
        
        # Maketrans: ubah karakter di string pertama menjadi karakter di string kedua
        # ocr_punct_mapping = str.maketrans('', '')
        # text = text.translate(ocr_punct_mapping)        

        # 3. Regex mengizinkan karakter yang wajar
        text = re.sub(r'[^a-zA-Z0-9\s.,?!\-\'"]', ' ', text)
        
        # hapus semua tanda baca jadi spasi
        text = re.sub(r'[^\w\s]', ' ', text)
        
        return text
    
    def _remove_noise(self, text):
        # 1. Hapus URL
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        # 2. Hapus HTML tags
        text = re.sub(r'<.*?>', '', text)
        # 3. Hapus Emoji 
        text = emoji.replace_emoji(text, replace='')
        return text

    def _normalize_slang(self, text):
        words = text.split()
        normalized_words = [self.slang_dict.get(word, word) for word in words]
        return ' '.join(normalized_words)

    def clean(self, text):
        if not isinstance(text, str):
            return ""

        text = self._remove_boilerplate(text)
        text = self._fix_artifacts(text)
        text = text.lower()
        text = self._remove_noise(text)
        text = self._normalize_slang(text)
        
        # Hapus spasi berlebih
        text = re.sub(r'\s+', ' ', text).strip()

        return text


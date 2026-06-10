# # crawl isi berita dari url website
import requests
from bs4 import BeautifulSoup
# from newspaper import Article


class Crawler:
    def crawl_berita(self, url):
        try:
            headers = {
                "User-Agent": "Mozilla/5.0"
            }

            response = requests.get(
                url,
                headers=headers,
                timeout=10
            )

            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            paragraphs = soup.find_all("p")
            isi_berita = " ".join(
                p.get_text(strip=True)
                for p in paragraphs
            )

            return isi_berita

        except Exception as e:                      
            return None
            
    
# pakai newspaper3k untuk crawl berita
# def crawl_berita(url):
#     article = Article(url)
#     article.download()
#     article.parse()
#     text_bersih = article
#     return text_bersih
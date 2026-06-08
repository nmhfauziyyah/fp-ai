# # crawl isi berita dari url website
import requests
from bs4 import BeautifulSoup
# from newspaper import Article


class Crawler:
    def __init__(self):
        pass

    def crawl_berita(self, url):
        try:
            response = requests.get(url)
            response.raise_for_status() 
            soup = BeautifulSoup(response.text, 'html.parser')
            
            #Mengambil teks dari tag <p>
            paragraphs = soup.find_all('p')
            isi_berita = ' '.join([p.get_text() for p in paragraphs])
            
            return isi_berita
        except requests.exceptions.RequestException as e:
            print(f"Error saat mengakses URL: {e}")
            return None
            
    
# pakai newspaper3k untuk crawl berita
# def crawl_berita(url):
#     article = Article(url)
#     article.download()
#     article.parse()
#     text_bersih = article
#     return text_bersih
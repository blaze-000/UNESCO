import requests 
from googlesearch import search
import sys
import re

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
sys.stdout.reconfigure(encoding='utf-8')
    
headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    }

def google_search(search_query):
    top_5_searchs = []
    try:
        for i in search(search_query, advanced=True, num_results=5, lang='en', unique = True):
            if i.url and i.title:
                
                top_5_searchs.append(
                {
                    "Title": i.title,
                    "url": i.url,
                    "search_query" : search_query
                }
                )
    except:
        pass
    
    return top_5_searchs
        
def deduplicate(datas):
    added_url = set()
    searches = []
    for data in datas:
        for i in (data['search']):
            if not i['url'] in added_url:
                searches.append(
                        {
                            "claim": data['claim'],
                            "category": data['category'],
                            "Title": i['Title'],
                            "url": i['url'],
                            "search_query" : i['search_query']
                        })
                added_url.add(i['url'])
    
    return searches


def remove_urls(text):
  url_pattern = re.compile(r'https?://\S+|www\.\S+')
  return url_pattern.sub(r'', text)


def get_from_url(url):
    api_endpoint = f'https://r.jina.ai/{url}'

    response = requests.get(api_endpoint, headers=headers)

    if response.status_code == 200:
        return remove_urls(response.text)
    else:
        return (f"Request failed with status: {response.status_code}")
    
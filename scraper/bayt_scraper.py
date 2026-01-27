import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time

def clean_text(text):
    if not text:
        return ""
    return ' '.join(text.strip().split())

def parse_tech_stack(text):
    tech_keywords = [
        'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Node.js', 
        'Python', 'Django', 'Java', 'Spring', 'C#', '.NET',
        'PHP', 'Laravel', 'Flutter', 'React Native',
        'SQL', 'MySQL', 'PostgreSQL', 'MongoDB',
        'AWS', 'Azure', 'Docker', 'Kubernetes'
    ]
    
    found_tech = []
    text_lower = text.lower()
    
    for tech in tech_keywords:
        if tech.lower() in text_lower:
            if tech not in found_tech:
                found_tech.append(tech)
    
    return found_tech[:8]

def scrape_bayt(query="software developer", pages=3):
    jobs = []
    base_url = "https://www.bayt.com/en/saudi-arabia/jobs/"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    
    for page in range(1, pages + 1):
        try:
            print(f"Scraping Bayt page {page}...")
            
            url = f"{base_url}?page={page}&q={query.replace(' ', '+')}"
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code != 200:
                print(f"Error: Status {response.status_code}")
                continue
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Bayt uses li elements with specific class
            job_cards = soup.find_all('li', class_='has-pointer-d')
            
            print(f"Found {len(job_cards)} jobs on page {page}")
            
            for card in job_cards:
                try:
                    title_elem = card.find('h2')
                    company_elem = card.find('b', class_='jb-company')
                    location_elem = card.find('span', class_='jb-loc')
                    link_elem = card.find('a', href=True)
                    
                    if not title_elem:
                        continue
                    
                    title = clean_text(title_elem.get_text())
                    company = clean_text(company_elem.get_text()) if company_elem else "Unknown"
                    location = clean_text(location_elem.get_text()) if location_elem else "Saudi Arabia"
                    
                    job_url = ""
                    if link_elem:
                        job_url = link_elem['href']
                        if not job_url.startswith('http'):
                            job_url = 'https://www.bayt.com' + job_url
                    
                    # Determine country
                    country = "Saudi Arabia"
                    if "UAE" in location or "Dubai" in location or "Abu Dhabi" in location:
                        country = "UAE"
                    elif "Kuwait" in location:
                        country = "Kuwait"
                    elif "Qatar" in location:
                        country = "Qatar"
                    elif "Egypt" in location or "Cairo" in location:
                        country = "Egypt"
                    
                    tech_stack = parse_tech_stack(title)
                    
                    job = {
                        'id': f"bayt_{len(jobs)}_{page}",
                        'title': title,
                        'company': company,
                        'location': location,
                        'country': country,
                        'postedDate': 'Recently',
                        'url': job_url,
                        'source': 'Bayt',
                        'techStack': tech_stack if tech_stack else None,
                        'scrapedAt': datetime.now().isoformat()
                    }
                    
                    jobs.append(job)
                    
                except Exception as e:
                    print(f"Error parsing job: {e}")
                    continue
            
            time.sleep(2)
            
        except Exception as e:
            print(f"Error on page {page}: {e}")
            continue
    
    return jobs

def save_jobs(jobs, filename='../data/jobs.json'):
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(jobs, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved {len(jobs)} jobs to {filename}")
    except Exception as e:
        print(f"Error saving: {e}")

if __name__ == "__main__":
    print("Starting Bayt scraper...")
    print("=" * 50)
    
    jobs = scrape_bayt(query="software developer", pages=5)
    
    print("=" * 50)
    print(f"Total jobs scraped: {len(jobs)}")
    
    if jobs:
        save_jobs(jobs)
        print("✓ Done!")
    else:
        print("✗ No jobs found")
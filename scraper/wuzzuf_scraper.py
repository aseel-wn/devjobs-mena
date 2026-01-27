import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time
import re

def clean_text(text):
    """Remove extra whitespace and clean text"""
    if not text:
        return ""
    return ' '.join(text.strip().split())

def parse_tech_stack(description):
    """Extract tech keywords from job description"""
    tech_keywords = [
        'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Node.js', 
        'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET',
        'PHP', 'Laravel', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
        'Flutter', 'React Native', 'iOS', 'Android',
        'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
        'Git', 'Linux', 'DevOps', 'Microservices', 'REST', 'GraphQL'
    ]
    
    found_tech = []
    description_lower = description.lower()
    
    for tech in tech_keywords:
        if tech.lower() in description_lower:
            if tech not in found_tech:
                found_tech.append(tech)
    
    return found_tech[:8]  # Limit to 8 tags

def scrape_wuzzuf(query="software developer", pages=3):
    """Scrape Wuzzuf for jobs"""
    jobs = []
    base_url = "https://wuzzuf.net/search/jobs/"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
    
    for page in range(pages):
        try:
            print(f"Scraping Wuzzuf page {page + 1}...")
            
            params = {
                'q': query,
                'a': 'hpb',
                'start': page
            }
            
            response = requests.get(base_url, headers=headers, params=params, timeout=10)
            
            if response.status_code != 200:
                print(f"Error: Status code {response.status_code}")
                continue
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find job cards - Wuzzuf uses different selectors, we'll try multiple
            job_cards = soup.select('.css-1gatmva') or soup.select('[data-test="job-card"]') or soup.select('.job-card')
            
            print(f"Found {len(job_cards)} job cards on page {page + 1}")
            
            for card in job_cards:
                try:
                    # Extract job details
                    title_elem = card.select_one('h2 a') or card.select_one('.css-o171kl a') or card.select_one('[data-test="job-title"]')
                    company_elem = card.select_one('.css-17s97q8') or card.select_one('[data-test="job-company"]')
                    location_elem = card.select_one('.css-5wys0k') or card.select_one('[data-test="job-location"]')
                    date_elem = card.select_one('.css-4c4ojb') or card.select_one('.css-do6t5g')
                    
                    if not title_elem:
                        continue
                    
                    title = clean_text(title_elem.get_text())
                    company = clean_text(company_elem.get_text()) if company_elem else "Unknown Company"
                    location = clean_text(location_elem.get_text()) if location_elem else "Egypt"
                    posted_date = clean_text(date_elem.get_text()) if date_elem else "Recently"
                    
                    # Get job URL
                    job_url = title_elem.get('href', '')
                    if job_url and not job_url.startswith('http'):
                        job_url = 'https://wuzzuf.net' + job_url
                    
                    # Determine country from location
                    country = "Egypt"
                    if any(city in location for city in ["Cairo", "Alexandria", "Giza"]):
                        country = "Egypt"
                    
                    # Try to get description for tech stack
                    description = ""
                    desc_elem = card.select_one('.css-y4udm8') or card.select_one('[data-test="job-description"]')
                    if desc_elem:
                        description = clean_text(desc_elem.get_text())
                    
                    tech_stack = parse_tech_stack(title + " " + description)
                    
                    job = {
                        'id': f"wuzzuf_{len(jobs)}_{page}",
                        'title': title,
                        'company': company,
                        'location': location,
                        'country': country,
                        'postedDate': posted_date,
                        'url': job_url,
                        'source': 'Wuzzuf',
                        'techStack': tech_stack if tech_stack else None,
                        'scrapedAt': datetime.now().isoformat()
                    }
                    
                    jobs.append(job)
                    
                except Exception as e:
                    print(f"Error parsing job card: {e}")
                    continue
            
            # Be nice to the server
            time.sleep(2)
            
        except Exception as e:
            print(f"Error fetching page {page + 1}: {e}")
            continue
    
    return jobs

def save_jobs(jobs, filename='../data/jobs.json'):
    """Save jobs to JSON file"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(jobs, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved {len(jobs)} jobs to {filename}")
    except Exception as e:
        print(f"Error saving jobs: {e}")

if __name__ == "__main__":
    print("Starting Wuzzuf scraper...")
    print("=" * 50)
    
    jobs = scrape_wuzzuf(query="software developer", pages=5)
    
    print("=" * 50)
    print(f"Total jobs scraped: {len(jobs)}")
    
    if jobs:
        save_jobs(jobs)
        print("✓ Scraping complete!")
    else:
        print("✗ No jobs found. Wuzzuf might have changed their HTML structure.")
        print("We'll need to inspect the page and update selectors.")
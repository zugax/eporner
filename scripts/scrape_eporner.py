#!/usr/bin/env python3
"""
Eporner Web Scraper Tool
Scrapes eporner.com to extract HTML/CSS structure for styling reference
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import os
from urllib.parse import urljoin

class EpornerScraper:
    def __init__(self):
        self.base_url = "https://www.eporner.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
    def get_page(self, url):
        """Fetch a page from eporner.com"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.text, 'html.parser')
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def get_page_title(self, soup):
        """Get page title"""
        if soup.title:
            return soup.title.string
        return None
    
    def extract_css_files(self, soup):
        """Extract all CSS file URLs"""
        css_files = []
        for link in soup.find_all('link', rel='stylesheet'):
            href = link.get('href')
            if href:
                css_files.append(href)
        return css_files
    
    def extract_main_styles(self, soup):
        """Extract inline styles from style tags"""
        styles = []
        for style in soup.find_all('style'):
            if style.string:
                styles.append(style.string)
        return styles
    
    def scrape_homepage(self):
        """Scrape homepage structure"""
        print("=" * 60)
        print("SCRAPING EPORNER HOMEPAGE")
        print("=" * 60)
        
        soup = self.get_page(self.base_url)
        if not soup:
            return None
            
        print(f"\n📌 Page Title: {self.get_page_title(soup)}")
        
        # Extract CSS files
        print(f"\n📄 CSS Files:")
        css_files = self.extract_css_files(soup)
        for i, css in enumerate(css_files[:10], 1):
            print(f"  {i}. {css}")
        
        # Extract main navigation
        print(f"\n🔗 Main Navigation:")
        nav = soup.find('nav')
        if nav:
            for link in nav.find_all('a', href=True)[:10]:
                print(f"  - {link.get('text', '').strip()}: {link['href']}")
        
        # Extract hero section
        print(f"\n🎯 Hero Section:")
        hero = soup.find('section', class_=re.compile(r'hero|banner|featured'))
        if hero:
            print(f"  Hero element found: {hero.name}")
            print(f"  Classes: {hero.get('class', [])}")
        
        # Extract video grid structure
        print(f"\n🎬 Video Grid:")
        video_containers = soup.find_all(['div', 'section'], class_=re.compile(r'video|grid|item|thumb'))
        print(f"  Found {len(video_containers)} video-related elements")
        
        # Extract categories
        print(f"\n📂 Categories:")
        category_links = soup.find_all('a', href=re.compile(r'/category|/cat'))
        for cat in category_links[:8]:
            print(f"  - {cat.get('text', '').strip()}: {cat.get('href')}")
        
        return {
            'title': self.get_page_title(soup),
            'css_files': css_files,
            'navigation': str(nav) if nav else None,
        }
    
    def scrape_video_page(self):
        """Scrape video watch page structure"""
        print("\n" + "=" * 60)
        print("SCRAPING EPORNER VIDEO PAGE")
        print("=" * 60)
        
        # First get a video URL from homepage
        soup = self.get_page(self.base_url)
        if not soup:
            return None
            
        # Find a video link
        video_link = soup.find('a', href=re.compile(r'/video/'))
        if not video_link:
            print("No video link found")
            return None
            
        video_url = urljoin(self.base_url, video_link['href'])
        print(f"Video URL: {video_url}")
        
        soup = self.get_page(video_url)
        if not soup:
            return None
            
        print(f"\n📌 Page Title: {self.get_page_title(soup)}")
        
        # Video player
        print(f"\n🎬 Video Player:")
        player = soup.find(['div', 'iframe', 'video'], class_=re.compile(r'player|video|embed'))
        if player:
            print(f"  Player found: {player.name}")
            print(f"  Classes: {player.get('class', [])}")
        
        # Video info
        print(f"\n📊 Video Info:")
        title = soup.find('h1')
        if title:
            print(f"  Title: {title.get_text(strip=True)}")
        
        # Views, rating, duration
        stats = soup.find_all(['span', 'div'], class_=re.compile(r'views|rating|duration|time'))
        for stat in stats[:6]:
            print(f"  {stat.get_text(strip=True)}")
        
        # Related videos
        print(f"\n📺 Related Videos:")
        related = soup.find_all('a', href=re.compile(r'/video/'))
        print(f"  Found {len(related)} video links")
        
        return {'video_url': video_url}
    
    def scrape_category_page(self):
        """Scrape category page structure"""
        print("\n" + "=" * 60)
        print("SCRAPING EPORNER CATEGORY PAGE")
        print("=" * 60)
        
        # Try a category URL
        category_url = f"{self.base_url}/categories"
        soup = self.get_page(category_url)
        if not soup:
            # Try alternative
            category_url = f"{self.base_url}/cat"
            soup = self.get_page(category_url)
            if not soup:
                return None
            
        print(f"📌 Page Title: {self.get_page_title(soup)}")
        
        # Category grid
        print(f"\n📂 Category Grid:")
        categories = soup.find_all('a', href=re.compile(r'/cat/|/category/'))
        print(f"  Found {len(categories)} category links")
        
        # Print first few categories
        for cat in categories[:6]:
            name = cat.get_text(strip=True)
            href = cat.get('href', '')
            if name and 'category' in href.lower():
                print(f"  - {name}: {href}")
        
        return {'category_count': len(categories)}
    
    def scrape_pornstars_page(self):
        """Scrape pornstars page structure"""
        print("\n" + "=" * 60)
        print("SCRAPING EPORNER PORNSTARS PAGE")
        print("=" * 60)
        
        pornstars_url = f"{self.base_url}/pornstars"
        soup = self.get_page(pornstars_url)
        if not soup:
            return None
            
        print(f"📌 Page Title: {self.get_page_title(soup)}")
        
        # Pornstar grid
        print(f"\n👤 Pornstar Grid:")
        pornstars = soup.find_all('a', href=re.compile(r'/pornstar/|/model/'))
        print(f"  Found {len(pornstars)} pornstar links")
        
        # Print first few
        for ps in pornstars[:6]:
            name = ps.get_text(strip=True)
            href = ps.get('href', '')
            if name and 'pornstar' in href.lower():
                print(f"  - {name}: {href}")
        
        return {'pornstar_count': len(pornstars)}
    
    def extract_css_variables(self, soup):
        """Extract CSS custom properties (variables)"""
        print("\n" + "=" * 60)
        print("EXTRACTING CSS VARIABLES")
        print("=" * 60)
        
        # Look for CSS in style tags
        styles = soup.find_all('style')
        css_vars = []
        
        for style in styles:
            if style.string:
                # Find CSS custom properties
                vars_found = re.findall(r'--[\w-]+:\s*[^;]+;', style.string)
                css_vars.extend(vars_found)
        
        # Also check inline styles
        for elem in soup.find_all(style=True):
            inline = elem.get('style', '')
            vars_found = re.findall(r'--[\w-]+:\s*[^;]+;', inline)
            css_vars.extend(vars_found)
        
        print(f"\n🎨 Found {len(css_vars)} CSS variables:")
        unique_vars = list(set(css_vars))[:20]
        for var in unique_vars:
            print(f"  {var}")
        
        return unique_vars
    
    def generate_css_reference(self):
        """Generate a reference file of eporner's CSS structure"""
        print("\n" + "=" * 60)
        print("GENERATING CSS REFERENCE")
        print("=" * 60)
        
        soup = self.get_page(self.base_url)
        if not soup:
            return
            
        # Get all CSS
        css_files = self.extract_css_files(soup)
        inline_styles = self.extract_inline_styles(soup)
        
        # Generate reference
        reference = {
            'base_url': self.base_url,
            'css_files': css_files,
            'main_colors': self.extract_main_colors(soup),
            'layout_structure': self.analyze_layout(soup),
        }
        
        # Save to file
        output_file = 'eporner_reference.json'
        with open(output_file, 'w') as f:
            json.dump(reference, f, indent=2)
        print(f"\n💾 Reference saved to: {output_file}")
        
        return reference
    
    def extract_inline_styles(self, soup):
        """Extract common inline style patterns"""
        patterns = {}
        
        for elem in soup.find_all(style=True):
            style = elem.get('style', '')
            # Extract common properties
            if 'background' in style:
                patterns['background'] = style
            if 'color:' in style:
                patterns['color'] = style
            if 'font' in style:
                patterns['font'] = style
        
        return patterns
    
    def extract_main_colors(self, soup):
        """Extract main color values from the page"""
        colors = set()
        
        # Check style tags
        for style in soup.find_all('style'):
            if style.string:
                # Find hex colors
                hex_colors = re.findall(r'#[0-9a-fA-F]{3,8}', style.string)
                colors.update(hex_colors[:10])
                
                # Find rgb colors
                rgb_colors = re.findall(r'rgb\(\d+,\s*\d+,\s*\d+\)', style.string)
                colors.update(rgb_colors[:5])
        
        # Check inline styles
        for elem in soup.find_all(style=True):
            style = elem.get('style', '')
            hex_colors = re.findall(r'#[0-9a-fA-F]{3,8}', style)
            colors.update(hex_colors[:5])
        
        return list(colors)[:20]
    
    def analyze_layout(self, soup):
        """Analyze the page layout structure"""
        layout = {
            'header': None,
            'main_content': None,
            'footer': None,
            'sidebar': None,
        }
        
        # Find header
        header = soup.find('header')
        if header:
            layout['header'] = {
                'tag': 'header',
                'classes': header.get('class', []),
                'id': header.get('id'),
            }
        
        # Find main
        main = soup.find('main')
        if main:
            layout['main_content'] = {
                'tag': 'main',
                'classes': main.get('class', []),
            }
        
        # Find footer
        footer = soup.find('footer')
        if footer:
            layout['footer'] = {
                'tag': 'footer',
                'classes': footer.get('class', []),
            }
        
        # Find sidebar
        sidebar = soup.find(['aside', 'div'], class_=re.compile(r'sidebar|aside'))
        if sidebar:
            layout['sidebar'] = {
                'tag': sidebar.name,
                'classes': sidebar.get('class', []),
            }
        
        return layout


def main():
    scraper = EpornerScraper()
    
    print("🚀 Starting Eporner Web Scraper")
    print("=" * 60)
    
    # Scrape different pages
    scraper.scrape_homepage()
    scraper.scrape_video_page()
    scraper.scrape_category_page()
    scraper.scrape_pornstars_page()
    
    # Generate reference
    reference = scraper.generate_css_reference()
    
    print("\n" + "=" * 60)
    print("✅ SCRAPING COMPLETE")
    print("=" * 60)
    print("""
Next steps:
1. Check eporner_reference.json for extracted data
2. Review the CSS structure
3. Apply the styling to your website
4. Run: python scripts/scrape_eporner.py
    """)


if __name__ == "__main__":
    main()

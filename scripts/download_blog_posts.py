#!/usr/bin/env python3
"""
Script to download blog posts from generalarcade.com and convert them to Hugo format.
"""

import os
import re
import sys
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from pathlib import Path
from datetime import datetime
import json

BASE_URL = "https://generalarcade.com"
BLOG_URL = "https://generalarcade.com/blog/"
CONTENT_DIR = Path(__file__).parent.parent / "content" / "blog"

def slugify(text):
    """Convert text to URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def download_image(url, save_path):
    """Download an image from URL"""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Error downloading image {url}: {e}")
    return False

def extract_post_data(post_url):
    """Extract post data from a blog post page"""
    try:
        response = requests.get(post_url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title_elem = soup.find('h1')
        title = title_elem.get_text(strip=True) if title_elem else "Untitled"
        
        # Extract date
        date_elem = soup.find('time') or soup.find(string=re.compile(r'\d{1,2}\s+\w+\s+\d{4}'))
        date_str = None
        if date_elem:
            if hasattr(date_elem, 'get'):
                date_str = date_elem.get('datetime') or date_elem.get_text(strip=True)
            else:
                date_str = str(date_elem).strip()
        
        # Extract categories
        categories = []
        categories_elem = soup.find(string=re.compile(r'Categories?:', re.I))
        if categories_elem:
            parent = categories_elem.find_parent()
            if parent:
                links = parent.find_all('a')
                categories = [link.get_text(strip=True) for link in links]
        
        # Extract tags
        tags = []
        tags_elem = soup.find(string=re.compile(r'Tags?:', re.I))
        if tags_elem:
            parent = tags_elem.find_parent()
            if parent:
                links = parent.find_all('a')
                tags = [link.get_text(strip=True) for link in links]
        
        # Extract content
        content_elem = soup.find('article') or soup.find('main') or soup.find('div', class_=re.compile(r'content|post|article'))
        content = ""
        if content_elem:
            # Remove navigation, meta, etc.
            for elem in content_elem.find_all(['nav', 'footer', 'header']):
                elem.decompose()
            
            # Convert to markdown-like format
            for p in content_elem.find_all('p'):
                text = p.get_text(strip=True)
                if text:
                    content += text + "\n\n"
            
            for h2 in content_elem.find_all('h2'):
                text = h2.get_text(strip=True)
                if text:
                    content += f"## {text}\n\n"
            
            for h3 in content_elem.find_all('h3'):
                text = h3.get_text(strip=True)
                if text:
                    content += f"### {text}\n\n"
            
            for h4 in content_elem.find_all('h4'):
                text = h4.get_text(strip=True)
                if text:
                    content += f"#### {text}\n\n"
            
            for ul in content_elem.find_all('ul'):
                for li in ul.find_all('li'):
                    text = li.get_text(strip=True)
                    if text:
                        content += f"- {text}\n"
                content += "\n"
        
        # Extract featured image
        featured_image_url = None
        img_elem = soup.find('img', class_=re.compile(r'featured|hero|main', re.I))
        if not img_elem:
            img_elem = soup.find('img')
        if img_elem:
            featured_image_url = img_elem.get('src') or img_elem.get('data-src')
            if featured_image_url:
                featured_image_url = urljoin(post_url, featured_image_url)
        
        # Extract description (first paragraph or meta description)
        description = ""
        meta_desc = soup.find('meta', property='og:description') or soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            description = meta_desc.get('content', '')
        elif content:
            description = content.split('\n')[0][:200]
        
        return {
            'title': title,
            'date': date_str,
            'categories': categories if categories else ['Blog'],
            'tags': tags,
            'content': content.strip(),
            'description': description,
            'featured_image_url': featured_image_url
        }
    except Exception as e:
        print(f"Error extracting data from {post_url}: {e}")
        return None

def get_blog_post_urls():
    """Get list of blog post URLs from the blog index page"""
    try:
        response = requests.get(BLOG_URL, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        urls = []
        # Find all links to blog posts
        for link in soup.find_all('a', href=True):
            href = link.get('href')
            if href and '/blog/' in href and href != '/blog/':
                full_url = urljoin(BASE_URL, href)
                if full_url not in urls:
                    urls.append(full_url)
        
        return urls
    except Exception as e:
        print(f"Error getting blog post URLs: {e}")
        return []

def create_hugo_post(post_data, post_slug):
    """Create Hugo post from extracted data"""
    post_dir = CONTENT_DIR / post_slug
    post_dir.mkdir(parents=True, exist_ok=True)
    
    # Download featured image
    featured_image_name = None
    if post_data.get('featured_image_url'):
        img_ext = os.path.splitext(urlparse(post_data['featured_image_url']).path)[1] or '.jpg'
        featured_image_name = f"featured{img_ext}"
        img_path = post_dir / featured_image_name
        if download_image(post_data['featured_image_url'], img_path):
            print(f"Downloaded featured image: {featured_image_name}")
        else:
            featured_image_name = None
    
    # Create front matter
    front_matter = {
        'title': post_data['title'],
        'description': post_data.get('description', ''),
        'categories': post_data.get('categories', ['Blog']),
        'draft': False
    }
    
    if post_data.get('date'):
        front_matter['date'] = post_data['date']
    
    if post_data.get('tags'):
        front_matter['tags'] = post_data['tags']
    
    if featured_image_name:
        front_matter['featured_image'] = featured_image_name
    
    # Write index.md
    md_content = "---\n"
    for key, value in front_matter.items():
        if isinstance(value, list):
            md_content += f"{key}: {json.dumps(value)}\n"
        elif isinstance(value, str) and ('"' in value or ':' in value):
            md_content += f'{key}: "{value}"\n'
        else:
            md_content += f"{key}: {value}\n"
    md_content += "---\n\n"
    md_content += post_data.get('content', '')
    
    md_path = post_dir / "index.md"
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    print(f"Created post: {post_slug}")
    return True

def main():
    """Main function"""
    print("Fetching blog post URLs...")
    post_urls = get_blog_post_urls()
    
    if not post_urls:
        print("No blog posts found. Please provide URLs manually.")
        print("Usage: python download_blog_posts.py <url1> <url2> ...")
        if len(sys.argv) > 1:
            post_urls = sys.argv[1:]
        else:
            return
    
    print(f"Found {len(post_urls)} posts")
    
    for url in post_urls:
        print(f"\nProcessing: {url}")
        post_data = extract_post_data(url)
        
        if post_data:
            post_slug = slugify(post_data['title'])
            create_hugo_post(post_data, post_slug)
        else:
            print(f"Failed to extract data from {url}")

if __name__ == "__main__":
    main()













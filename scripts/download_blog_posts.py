#!/usr/bin/env python3
"""
Mirror every blog post from generalarcade.com (including items loaded through
the “Load more” button) into Hugo page bundles under content/blog.
"""

from __future__ import annotations

import json
import os
import re
import shutil
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://generalarcade.com"
BLOG_URL = f"{BASE_URL}/blog/"
AJAX_URL = f"{BASE_URL}/wp/wp-admin/admin-ajax.php"
CONTENT_DIR = Path(__file__).parent.parent / "content" / "blog"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
)
REQUEST_TIMEOUT = 30
REQUEST_DELAY = 0.4  # seconds between HTTP requests


@dataclass
class BlogPost:
    url: str
    slug: str
    title: str
    date: Optional[str]
    description: Optional[str]
    categories: List[str]
    tags: List[str]
    featured_image: Optional[str]
    content_html: str


def slug_from_url(post_url: str) -> str:
    path = urlparse(post_url).path.rstrip("/")
    slug = path.split("/")[-1] or "blog-post"
    return slug


def clean_filename(filename: str) -> str:
    filename = filename.split("?")[0]
    filename = filename.split("#")[0]
    filename = os.path.basename(filename)
    return re.sub(r"[^a-zA-Z0-9._-]", "-", filename) or "asset"


def normalize_date(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    value = value.strip()
    if not value:
        return None

    date_part = value.split("T")[0].split(" ")[0]
    if re.match(r"^\d{4}-\d{2}-\d{2}$", date_part):
        return date_part

    match = re.match(r"^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})", value)
    if match:
        day, month_name, year = match.groups()
        months = {
            "january": "01",
            "february": "02",
            "march": "03",
            "april": "04",
            "may": "05",
            "june": "06",
            "july": "07",
            "august": "08",
            "september": "09",
            "october": "10",
            "november": "11",
            "december": "12",
        }
        month = months.get(month_name.lower())
        if month:
            return f"{year}-{month}-{int(day):02d}"

    return value


def session_factory() -> requests.Session:
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": USER_AGENT,
            "Referer": BLOG_URL,
            "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
        }
    )
    return session


def parse_listing_html(html: str) -> List[str]:
    soup = BeautifulSoup(html, "html.parser")
    urls: List[str] = []
    for anchor in soup.select("a.c-article"):
        href = anchor.get("href")
        if not href:
            continue
        full_url = urljoin(BASE_URL, href)
        if full_url not in urls:
            urls.append(full_url)
    return urls


def collect_all_post_urls(session: requests.Session) -> List[str]:
    print("Collecting blog URLs (including Load more batches)...")
    response = session.get(BLOG_URL, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()

    urls: List[str] = parse_listing_html(response.text)
    seen = set(urls)
    offset = len(urls)
    attempt = 0

    while True:
        attempt += 1
        data = {"action": "load_more_news", "category": "", "offset": str(offset)}
        ajax_resp = session.post(
            AJAX_URL, data=data, timeout=REQUEST_TIMEOUT, headers={"Referer": BLOG_URL}
        )
        ajax_resp.raise_for_status()

        try:
            payload = ajax_resp.json()
        except ValueError:
            payload = ajax_resp.text

        html_chunk = payload.strip() if isinstance(payload, str) else ""
        if not html_chunk:
            print("  No more batches returned.")
            break

        batch_urls = parse_listing_html(html_chunk)
        new_urls = [u for u in batch_urls if u not in seen]
        if not new_urls:
            print("  Reached duplicate batch, stopping.")
            break

        urls.extend(new_urls)
        seen.update(new_urls)
        offset = len(urls)
        print(f"  Batch {attempt}: +{len(new_urls)} URLs (total {len(urls)})")
        time.sleep(REQUEST_DELAY)

    print(f"Collected {len(urls)} unique URLs.")
    return urls


def extract_meta_list(soup: BeautifulSoup, label: str) -> List[str]:
    label = label.lower()
    for item in soup.select(".list-unstyled-item"):
        badge = item.select_one(".u-fs-tiny")
        if not badge:
            continue
        badge_text = badge.get_text(strip=True).rstrip(":").lower()
        if badge_text != label:
            continue
        values = [
            a.get_text(strip=True)
            for a in item.select("a")
            if a.get_text(strip=True)
        ]
        if values:
            return values
        raw = item.get_text(separator=" ", strip=True)
        parts = raw.split(":", 1)
        if len(parts) == 2:
            tail = parts[1].strip()
            if tail:
                return [chunk.strip() for chunk in tail.split(",") if chunk.strip()]
    return []


def rewrite_content_images(
    session: requests.Session, html: str, post_dir: Path, base_url: str
) -> str:
    soup = BeautifulSoup(html, "html.parser")
    downloaded: Dict[str, str] = {}

    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src")
        if not src:
            continue

        absolute_url = urljoin(base_url, src)
        if absolute_url in downloaded:
            img["src"] = downloaded[absolute_url]
            continue

        filename = clean_filename(urlparse(absolute_url).path)
        if not filename:
            filename = f"image-{len(downloaded) + 1}.jpg"
        save_path = post_dir / filename

        try:
            download_binary(session, absolute_url, save_path)
            downloaded[absolute_url] = filename
            img["src"] = filename
            print(f"      inline image -> {filename}")
        except Exception as exc:
            print(f"      warning: failed to download inline image {absolute_url}: {exc}")
            img.decompose()

    return soup.decode_contents()


def download_binary(session: requests.Session, url: str, destination: Path) -> None:
    response = session.get(url, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    destination.write_bytes(response.content)


def extract_post(session: requests.Session, url: str) -> Optional[BlogPost]:
    response = session.get(url, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    response.encoding = "utf-8"
    soup = BeautifulSoup(response.text, "html.parser")

    title_el = soup.select_one("h1")
    if not title_el:
        print(f"  Skipping {url}: no title found.")
        return None

    title = title_el.get_text(strip=True)
    time_el = soup.select_one("time")
    date_value = None
    if time_el:
        date_value = time_el.get("datetime") or time_el.get_text(strip=True)
    date_iso = normalize_date(date_value)

    meta_desc = (
        soup.find("meta", attrs={"property": "og:description"})
        or soup.find("meta", attrs={"name": "description"})
    )
    description = meta_desc.get("content").strip() if meta_desc else None

    categories = extract_meta_list(soup, "categories")
    if not categories:
        categories = ["Blog"]
    tags = extract_meta_list(soup, "tags")

    content_container = soup.select_one(".c-wp")
    if not content_container:
        content_container = soup.find("article") or soup.find("main")
    if not content_container:
        print(f"  Skipping {url}: content container not found.")
        return None

    featured = (
        soup.find("meta", attrs={"property": "og:image"})
        or soup.select_one(".c-wp img")
        or soup.find("img")
    )
    featured_url = featured.get("content") if featured and featured.has_attr("content") else None
    if not featured_url and featured and featured.has_attr("src"):
        featured_url = featured.get("src")
    if featured_url:
        featured_url = urljoin(url, featured_url)

    slug = slug_from_url(url)
    post_dir = CONTENT_DIR / slug
    post_dir.mkdir(parents=True, exist_ok=True)

    content_html = rewrite_content_images(
        session, content_container.decode_contents(), post_dir, url
    )

    featured_name = None
    if featured_url:
        extension = os.path.splitext(urlparse(featured_url).path)[1] or ".jpg"
        featured_name = f"featured{extension}"
        try:
            download_binary(session, featured_url, post_dir / featured_name)
        except Exception as exc:
            print(f"      warning: failed to download featured image {featured_url}: {exc}")
            featured_name = None

    return BlogPost(
        url=url,
        slug=slug,
        title=title,
        date=date_iso,
        description=description,
        categories=categories,
        tags=tags,
        featured_image=featured_name,
        content_html=content_html.strip(),
    )


def write_post(post: BlogPost) -> None:
    post_dir = CONTENT_DIR / post.slug
    post_dir.mkdir(parents=True, exist_ok=True)

    front_matter: List[str] = ["---"]
    front_matter.append(f"title: {json.dumps(post.title)}")
    if post.date:
        front_matter.append(f"date: {post.date}")
    if post.description:
        front_matter.append(f"description: {json.dumps(post.description)}")
    if post.categories:
        front_matter.append("categories:")
        for cat in post.categories:
            front_matter.append(f"  - {json.dumps(cat)}")
    if post.tags:
        front_matter.append("tags:")
        for tag in post.tags:
            front_matter.append(f"  - {json.dumps(tag)}")
    if post.featured_image:
        front_matter.append(f"featured_image: {json.dumps(post.featured_image)}")
    front_matter.append(f"original_url: {json.dumps(post.url)}")
    front_matter.append("draft: false")
    front_matter.append("---")

    body = "\n".join(front_matter) + "\n\n" + post.content_html.strip() + "\n"
    md_path = post_dir / "index.md"
    md_path.write_text(body, encoding="utf-8")
    print(f"    wrote {md_path.relative_to(CONTENT_DIR.parent)}")


def clear_existing_posts():
    for entry in CONTENT_DIR.iterdir():
        if entry.is_dir():
            shutil.rmtree(entry)


def main() -> None:
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)

    session = session_factory()
    urls = collect_all_post_urls(session)
    if not urls:
        print("No blog posts detected.")
        sys.exit(1)

    clear_existing_posts()

    for idx, url in enumerate(urls, start=1):
        print(f"[{idx}/{len(urls)}] Fetching {url}")
        try:
            post = extract_post(session, url)
            if not post:
                continue
            write_post(post)
            time.sleep(REQUEST_DELAY)
        except Exception as exc:
            print(f"  Error while processing {url}: {exc}")


if __name__ == "__main__":
    main()














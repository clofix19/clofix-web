#!/usr/bin/env python3
"""Submit changed CloFix URLs to IndexNow (Bing / Yandex / compatible engines).

Usage:
  python3 _partials/indexnow.py                  # submit sitemap URLs
  python3 _partials/indexnow.py --git            # submit URLs for files changed vs HEAD~1
  python3 _partials/indexnow.py --sitemap        # submit all sitemap URLs
  python3 _partials/indexnow.py /waf /pricing    # submit specific paths
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOST = "clofix.com"
ENDPOINTS = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
]
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def find_key() -> tuple[str, Path]:
    keys = sorted(ROOT.glob("*.txt"))
    for path in keys:
        if path.name in {"robots.txt", "ads.txt"}:
            continue
        raw = path.read_text(encoding="utf-8").strip()
        if re.fullmatch(r"[a-fA-F0-9-]{8,}", raw) and raw == path.stem:
            return raw, path
    raise SystemExit(
        "No IndexNow key file found. Create <uuid>.txt in site root containing the same uuid."
    )


def html_to_url(rel: Path) -> str | None:
    if rel.parts and rel.parts[0] in {"_partials", "xml", "js", "api", "assets", "img"}:
        return None
    if rel.name in {"header.html", "footer.html", "404.html"}:
        return None
    if rel.suffix != ".html":
        return None
    if rel.name == "index.html" and rel.parent == ROOT:
        return f"https://{HOST}/"
    if rel.name == "index.html":
        return f"https://{HOST}/{rel.parent.as_posix().strip('/')}/"
    return f"https://{HOST}/{rel.with_suffix('').as_posix()}"


def urls_from_sitemaps() -> list[str]:
    urls: list[str] = []
    index = ROOT / "sitemap.xml"
    if not index.exists():
        return urls
    root = ET.parse(index).getroot()
    children = [el.text for el in root.findall("s:sitemap/s:loc", NS) if el.text]
    if not children:
        for loc in root.findall("s:url/s:loc", NS):
            if loc.text:
                urls.append(loc.text.strip())
        return sorted(set(urls))

    for loc in children:
        name = loc.rstrip("/").split("/")[-1]
        path = ROOT / "xml" / name if name.endswith(".xml") else None
        if path is None or not path.exists():
            candidate = ROOT / name
            path = candidate if candidate.exists() else None
        if path is None:
            m = re.search(r"/xml/([^/]+\.xml)$", loc)
            if m:
                path = ROOT / "xml" / m.group(1)
        if path is None or not path.exists():
            continue
        try:
            tree = ET.parse(path)
        except ET.ParseError:
            continue
        for u in tree.getroot().findall("s:url/s:loc", NS):
            if u.text:
                urls.append(u.text.strip())
    return sorted(set(urls))


def urls_from_git() -> list[str]:
    try:
        out = subprocess.check_output(
            ["git", "diff", "--name-only", "HEAD~1", "HEAD"],
            cwd=ROOT,
            text=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        out = subprocess.check_output(
            ["git", "status", "--porcelain"],
            cwd=ROOT,
            text=True,
        )
        files = []
        for line in out.splitlines():
            parts = line.strip().split(maxsplit=1)
            if len(parts) == 2:
                files.append(parts[1].replace(" -> ", " ").split()[-1])
        out = "\n".join(files)

    urls = []
    for line in out.splitlines():
        rel = Path(line.strip())
        url = html_to_url(rel)
        if url:
            urls.append(url)
    return sorted(set(urls))


def urls_from_args(paths: list[str]) -> list[str]:
    urls = []
    for p in paths:
        p = p.strip()
        if p.startswith("http"):
            urls.append(p)
        elif p.startswith("/"):
            urls.append(f"https://{HOST}{p}")
        else:
            url = html_to_url(Path(p))
            if url:
                urls.append(url)
    return sorted(set(urls))


def verify_key(key: str, key_file: Path) -> str:
    key_location = f"https://{HOST}/{key_file.name}"
    req = urllib.request.Request(
        key_location,
        headers={"User-Agent": "CloFix-IndexNow/1.0"},
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        body = resp.read().decode("utf-8", "ignore").strip()
        ctype = resp.headers.get("Content-Type", "")
    if body != key:
        raise SystemExit(
            f"Key file mismatch at {key_location}: got {body!r}, expected {key!r}"
        )
    if "text/html" in ctype.lower():
        print(f"Warning: keyLocation returned Content-Type {ctype}", file=sys.stderr)
    print(f"Key OK at {key_location}")
    return key_location


def post_endpoint(endpoint: str, payload: dict) -> tuple[int, str]:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "ignore")
    except urllib.error.URLError as e:
        return 0, str(e)


def submit(urls: list[str], key: str, key_file: Path, retries: int = 3) -> None:
    if not urls:
        print("No URLs to submit.")
        return
    key_location = f"https://{HOST}/{key_file.name}"
    ok_any = False
    for i in range(0, len(urls), 100):
        chunk = urls[i : i + 100]
        payload = {
            "host": HOST,
            "key": key,
            "keyLocation": key_location,
            "urlList": chunk,
        }
        for endpoint in ENDPOINTS:
            status, body = post_endpoint(endpoint, payload)
            if 200 <= status < 300:
                print(f"IndexNow OK {status} {endpoint} ({len(chunk)} URLs)")
                ok_any = True
            else:
                print(f"IndexNow {status} {endpoint}: {body}", file=sys.stderr)

        # Bing may 403 until it crawls a new key; retry once after a short wait
        if not ok_any and retries > 0:
            print("Waiting 45s for Bing key verification crawl...", file=sys.stderr)
            time.sleep(45)
            return submit(urls, key, key_file, retries=retries - 1)

    print(f"Submitted {len(urls)} URL(s). keyLocation={key_location}")
    if not ok_any:
        raise SystemExit(1)


def main() -> None:
    ap = argparse.ArgumentParser(description="Submit CloFix URLs to IndexNow")
    ap.add_argument("--git", action="store_true", help="Submit URLs for recently changed HTML")
    ap.add_argument("--sitemap", action="store_true", help="Submit all sitemap URLs")
    ap.add_argument("--skip-verify", action="store_true", help="Skip live keyLocation check")
    ap.add_argument("paths", nargs="*", help="Specific paths or full URLs")
    args = ap.parse_args()

    key, key_file = find_key()
    if not args.skip_verify:
        try:
            verify_key(key, key_file)
        except Exception as e:
            print(
                f"Key not live yet ({e}). Deploy {key_file.name} to the site root, then re-run.",
                file=sys.stderr,
            )
            raise SystemExit(2) from e

    if args.paths:
        urls = urls_from_args(args.paths)
    elif args.sitemap:
        urls = urls_from_sitemaps()
    elif args.git:
        urls = urls_from_git()
    else:
        urls = urls_from_git() or urls_from_sitemaps()
    submit(urls, key, key_file)


if __name__ == "__main__":
    main()

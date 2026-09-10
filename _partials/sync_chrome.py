#!/usr/bin/env python3
"""Sync header.html + footer.html into every page with correct relative asset paths."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
HEADER_SRC = (ROOT / "header.html").read_text(encoding="utf-8")
FOOTER_SRC = (ROOT / "footer.html").read_text(encoding="utf-8")

HEADER_BLOCK = re.compile(r"(?:<!-- CloFix shared header[\s\S]*?-->\s*)?<header\s+class=\"header\"[\s\S]*?</header>", re.I)
FOOTER_BLOCK = re.compile(r"(?:<!-- CloFix shared footer[\s\S]*?-->\s*)?<footer\s+class=\"footer\"[\s\S]*?</footer>", re.I)


def depth_prefix(rel: Path) -> str:
    depth = len(rel.parent.parts)
    if depth == 0:
        return "img"
    return "/".join([".."] * depth) + "/img"


def asset_prefix(rel: Path) -> str:
    depth = len(rel.parent.parts)
    if depth == 0:
        return ""
    return "/".join([".."] * depth) + "/"


def prepare(fragment: str, img_prefix: str) -> str:
    out = fragment.strip() + "\n"
    # normalize any absolute or prefixed img paths to the page-relative prefix
    out = re.sub(r'src="(?:\.\./)*img/', f'src="{img_prefix}/', out)
    out = re.sub(r"src='(?:\.\./)*img/", f"src='{img_prefix}/", out)
    out = re.sub(r'src="/img/', f'src="{img_prefix}/', out)
    return out


def fix_page_assets(text: str, prefix: str) -> str:
    # stylesheet
    text = re.sub(
        r'href="(?:\./|/)style\.css"',
        f'href="{prefix}style.css"',
        text,
    )
    text = re.sub(
        r"href='(?:\./|/)style\.css'",
        f"href='{prefix}style.css'",
        text,
    )
    # chrome js
    text = re.sub(
        r'src="(?:\./|/)js/chrome\.js"',
        f'src="{prefix}js/chrome.js"',
        text,
    )
    # leftover absolute img in page chrome already handled by fragment replace
    text = re.sub(r'src="/img/', f'src="{prefix}img/', text)
    return text


def main():
    updated = 0
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if rel.as_posix() in ("header.html", "footer.html") or rel.parts[0] == "_partials":
            continue

        img_prefix = depth_prefix(rel)
        prefix = asset_prefix(rel)
        header = prepare(HEADER_SRC, img_prefix)
        footer = prepare(FOOTER_SRC, img_prefix)

        text = path.read_text(encoding="utf-8", errors="replace")
        orig = text

        if HEADER_BLOCK.search(text):
            text = HEADER_BLOCK.sub(header, text, count=1)
        else:
            text = re.sub(r"(<body[^>]*>)", r"\1\n" + header, text, count=1, flags=re.I)

        if FOOTER_BLOCK.search(text):
            text = FOOTER_BLOCK.sub(footer, text, count=1)
        else:
            text = re.sub(r"</body>", footer + "</body>", text, count=1, flags=re.I)

        if "js/chrome.js" not in text:
            text = re.sub(
                r"</body>",
                f'<script src="{prefix}js/chrome.js" defer></script>\n</body>',
                text,
                count=1,
                flags=re.I,
            )

        text = fix_page_assets(text, prefix)

        if text != orig:
            path.write_text(text, encoding="utf-8")
            updated += 1
            print("updated", rel)

    print(f"Done. {updated} files updated.")


if __name__ == "__main__":
    main()

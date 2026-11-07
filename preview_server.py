#!/usr/bin/env python3
"""Local preview server: maps /path -> path.html (like production nginx)."""
from __future__ import annotations

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parent


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _redirect(self, location: str):
        self.send_response(302)
        self.send_header("Location", location)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

    def _map_extensionless(self) -> bool:
        """Rewrite self.path for extensionless pages. Return True if response already sent."""
        parts = urlsplit(self.path)
        path = parts.path

        # /features/ conflicts with features/ directory. Redirect to /features
        # so relative assets (style.css, img/, js/) resolve from site root.
        if path != "/" and path.endswith("/"):
            rel = path.strip("/")
            if rel and "/" not in rel:
                directory = ROOT / rel
                html = ROOT / f"{rel}.html"
                if directory.is_dir() and html.is_file() and not (directory / "index.html").is_file():
                    loc = f"/{rel}"
                    if parts.query:
                        loc += f"?{parts.query}"
                    self._redirect(loc)
                    return True
            return False

        if path == "/":
            return False

        name = Path(path).name
        if "." in name:
            return False

        candidate = ROOT / path.lstrip("/")
        html = candidate.with_suffix(".html")

        # /features -> features.html even if features/ directory exists
        if html.is_file() and (not candidate.exists() or candidate.is_dir()):
            if candidate.is_dir() and (candidate / "index.html").is_file():
                return False
            mapped = "/" + html.relative_to(ROOT).as_posix()
            self.path = urlunsplit(("", "", mapped, parts.query, parts.fragment))
        return False

    def do_GET(self):
        if self._map_extensionless():
            return
        return super().do_GET()

    def do_HEAD(self):
        if self._map_extensionless():
            return
        return super().do_HEAD()


def main():
    parser = argparse.ArgumentParser(description="CloFix local preview server")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), PreviewHandler)
    print(f"Serving {ROOT}")
    print(f"Open http://{args.host}:{args.port}/")
    print("Note: /features/ redirects to /features (CSS-safe)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()

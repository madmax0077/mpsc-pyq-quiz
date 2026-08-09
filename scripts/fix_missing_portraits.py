# -*- coding: utf-8 -*-
from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

UA = "mpscs.in-educational-notes/1.0"
OUT = Path(__file__).resolve().parents[1] / "public" / "notes" / "samajsudharak"


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for i in range(8):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception as e:
            print("retry", e)
            time.sleep(2 * (i + 1))
    raise RuntimeError(url)


def commons(title: str, w: int = 500) -> str | None:
    params = {
        "action": "query",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|mime",
        "iiurlwidth": w,
        "format": "json",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    d = json.loads(get(url).decode())
    for p in d.get("query", {}).get("pages", {}).values():
        if "imageinfo" in p:
            return p["imageinfo"][0].get("thumburl") or p["imageinfo"][0].get("url")
    return None


def write_svg(cid: str, initials: str, color: str) -> str:
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">'
        f'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'
        f'<stop offset="0%" stop-color="{color}"/>'
        '<stop offset="100%" stop-color="#1f2937"/></linearGradient></defs>'
        '<rect width="480" height="480" fill="url(#g)"/>'
        '<circle cx="240" cy="240" r="150" fill="rgba(255,255,255,0.12)"/>'
        f'<text x="240" y="268" text-anchor="middle" '
        'font-family="Noto Sans Devanagari, Segoe UI, sans-serif" '
        f'font-size="120" font-weight="700" fill="white">{initials}</text></svg>'
    )
    dest = OUT / f"{cid}.svg"
    dest.write_text(svg, encoding="utf-8")
    return f"/notes/samajsudharak/{dest.name}"


def main() -> None:
    manifest = json.loads((OUT / "manifest.json").read_text(encoding="utf-8"))
    jobs = {
        "agarkar": "File:Gopal Ganesh Agarkar.jpg",
        "sane-guruji": "File:Pandurang Sadashiv Sane 2001 stamp of India.jpg",
    }
    for cid, title in jobs.items():
        print(cid, title)
        time.sleep(1.5)
        u = commons(title)
        if not u:
            print("fail")
            continue
        data = get(u)
        print("bytes", len(data))
        if len(data) < 4000:
            continue
        dest = OUT / f"{cid}.jpg"
        dest.write_bytes(data)
        manifest[cid] = {
            "file": f"/notes/samajsudharak/{dest.name}",
            "commons": title,
            "bytes": len(data),
        }
        print("ok")

    if "agarkar" not in manifest or not (OUT / "agarkar.jpg").exists():
        path = write_svg("agarkar", "आ", "#a21caf")
        manifest["agarkar"] = {"file": path, "source": "generated-initials"}
        print("agarkar svg")
    if "sane-guruji" not in manifest or not (OUT / "sane-guruji.jpg").exists():
        path = write_svg("sane-guruji", "स", "#d97706")
        manifest["sane-guruji"] = {"file": path, "source": "generated-initials"}
        print("sane svg")

    (OUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("done", len(manifest))


if __name__ == "__main__":
    main()

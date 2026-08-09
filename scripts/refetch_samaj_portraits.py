# -*- coding: utf-8 -*-
from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

UA = "mpscs.in-educational-notes/1.0 (educational)"
OUT = Path(__file__).resolve().parents[1] / "public" / "notes" / "samajsudharak"


def get_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for i in range(8):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception as e:
            print("retry", type(e).__name__, e)
            time.sleep(2.5 * (i + 1))
    raise RuntimeError(url)


def wiki_thumb(lang: str, title: str, size: int = 500) -> tuple[str | None, str | None]:
    params = {
        "action": "query",
        "titles": title,
        "prop": "pageimages",
        "pithumbsize": size,
        "pilicense": "any",
        "format": "json",
    }
    url = f"https://{lang}.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
    d = json.loads(get_bytes(url).decode())
    for p in d.get("query", {}).get("pages", {}).values():
        t = p.get("thumbnail", {}).get("source")
        if t:
            return t, p.get("pageimage")
    return None, None


def commons_thumb(file_title: str, w: int = 500) -> str | None:
    params = {
        "action": "query",
        "titles": file_title,
        "prop": "imageinfo",
        "iiprop": "url|mime",
        "iiurlwidth": w,
        "format": "json",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    d = json.loads(get_bytes(url).decode())
    for p in d.get("query", {}).get("pages", {}).values():
        if "imageinfo" not in p:
            continue
        ii = p["imageinfo"][0]
        return ii.get("thumburl") or ii.get("url")
    return None


def write_svg(cid: str, initials: str, color: str) -> str:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{color}"/>
      <stop offset="100%" stop-color="#1f2937"/>
    </linearGradient>
  </defs>
  <rect width="480" height="480" fill="url(#g)"/>
  <circle cx="240" cy="240" r="150" fill="rgba(255,255,255,0.12)"/>
  <text x="240" y="268" text-anchor="middle"
        font-family="Noto Sans Devanagari, Segoe UI, sans-serif"
        font-size="120" font-weight="700" fill="white">{initials}</text>
</svg>
"""
    dest = OUT / f"{cid}.svg"
    dest.write_text(svg, encoding="utf-8")
    return f"/notes/samajsudharak/{dest.name}"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name in [
        "ranade.jpg",
        "bhaurao-patil.jpg",
        "jambhekar.jpg",
        "lokhitwadi.jpg",
        "agarkar.jpg",
    ]:
        p = OUT / name
        if p.exists():
            p.unlink()
            print("deleted", name)

    jobs: dict[str, tuple] = {
        "ambedkar": ("wiki", "en", "B. R. Ambedkar"),
        "vr-shinde": ("wiki", "en", "Vitthal Ramji Shinde"),
        "karve": ("wiki", "en", "Dhondo Keshav Karve"),
        "sane-guruji": ("wiki", "en", "Sane Guruji"),
        "ranade": ("wiki", "en", "Mahadev Govind Ranade"),
        "dadoba": ("commons", "File:Dadoba Pandurang.jpg"),
        "agarkar": ("wiki", "en", "Gopal Ganesh Agarkar"),
        "tilak": ("wiki", "en", "Bal Gangadhar Tilak"),
        "pandita-ramabai": ("wiki", "en", "Pandita Ramabai"),
        "ramabai-ranade": ("wiki", "en", "Ramabai Ranade"),
        "bhaurao-patil": ("wiki", "en", "Bhaurao Patil"),
        "gokhale-paranjpe": ("wiki", "en", "Gopal Krishna Gokhale"),
        "vishnubuva": ("commons", "File:Vishnubuva 3.jpg"),
        "shankarshet": ("wiki", "en", "Jagannath Shankarseth"),
        "bhau-daji": ("wiki", "en", "Bhau Daji"),
        "bhau-mahajan": ("commons", "File:Vishnushastri Pandit.jpg"),
        "phule": ("wiki", "en", "Jyotirao Phule"),
    }

    manifest: dict[str, dict] = {}
    for cid, job in jobs.items():
        print("===", cid, job)
        time.sleep(1.3)
        if job[0] == "wiki":
            url, pageimg = wiki_thumb(job[1], job[2])
            src = f"{job[1]}.wikipedia:{job[2]} / {pageimg}"
        else:
            url = commons_thumb(job[1])
            src = job[1]
        if not url:
            print(" FAIL")
            continue
        data = get_bytes(url)
        if len(data) < 3500:
            print(" too small", len(data))
            continue
        dest = OUT / f"{cid}.jpg"
        dest.write_bytes(data)
        manifest[cid] = {
            "file": f"/notes/samajsudharak/{dest.name}",
            "source": src,
            "bytes": len(data),
        }
        print(" OK", len(data))
        time.sleep(0.7)

    for cid, ini, color in [
        ("jambhekar", "बा", "#0e7490"),
        ("lokhitwadi", "लो", "#4d7c0f"),
        ("sarvajanik-kaka", "का", "#a16207"),
        ("lahuji", "ल", "#b91c1c"),
    ]:
        path = write_svg(cid, ini, color)
        manifest[cid] = {
            "file": path,
            "source": "generated-initials",
            "note": "No verified free portrait found on Wikimedia/Wikipedia",
        }
        print("SVG", cid)

    (OUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("TOTAL", len(manifest))


if __name__ == "__main__":
    main()

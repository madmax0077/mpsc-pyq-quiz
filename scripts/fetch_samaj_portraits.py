# -*- coding: utf-8 -*-
"""Download free Wikimedia Commons portraits for समाजसुधारक notes."""
from __future__ import annotations

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "notes" / "samajsudharak"
UA = "mpscs.in-educational-notes/1.0 (contact: dontknowacademy@gmail.com)"

# Known Commons files (public domain / free licenses). Stamp images OK as portraits.
FILES: dict[str, list[str]] = {
    "ambedkar": [
        "File:Dr. Bhimrao Ambedkar.jpg",
        "File:Bhimrao Ramji Ambedkar (cropped).jpg",
    ],
    "vr-shinde": [
        "File:Vitthal Ramji Shinde.jpg",
        "File:Maharshi Vitthal Ramaji Shinde.jpg",
    ],
    "karve": [
        "File:Dhondo Keshav Karve.jpg",
        "File:Maharshi Dhondo Keshav Karve.jpg",
    ],
    "sane-guruji": [
        "File:Pandurang Sadashiv Sane 2001 stamp of India.jpg",
        "File:Sane Guruji.jpg",
    ],
    "ranade": [
        "File:Mahadev Govind Ranade.jpg",
        "File:Justice Mahadev Govind Ranade.jpg",
    ],
    "sarvajanik-kaka": [
        "File:Ganesh Vasudeo Joshi.jpg",
        "File:Sarvajanik Kaka.jpg",
    ],
    "jambhekar": [
        "File:Balshastri Jambhekar.jpg",
        "File:Bal Gangadhar Jambhekar.jpg",
    ],
    "lokhitwadi": [
        "File:Gopal Hari Deshmukh.jpg",
        "File:Lokahitawadi.jpg",
    ],
    "dadoba": [
        "File:Dadoba Pandurang.jpg",
        "File:Dadoba Pandurang Tarkhadkar.jpg",
    ],
    "agarkar": [
        "File:Gopal Ganesh Agarkar.jpg",
        "File:G. G. Agarkar.jpg",
    ],
    "tilak": [
        "File:Bal Gangadhar Tilak.jpg",
        "File:Lokamanya Tilak.jpg",
    ],
    "pandita-ramabai": [
        "File:Pandita Ramabai Sarasvati.jpg",
        "File:Pandita Ramabai.jpg",
    ],
    "ramabai-ranade": [
        "File:Ramabai Ranade.jpg",
        "File:Ramabai Ranade portrait.jpg",
    ],
    "bhaurao-patil": [
        "File:Karmaveer Bhaurao Patil.jpg",
        "File:Bhaurao Patil.jpg",
    ],
    "gokhale-paranjpe": [
        "File:Gopal Krishna Gokhale.jpg",
        "File:Gopal Krishna Gokhale 1915.jpg",
    ],
    "vishnubuva": [
        "File:Vishnubuwa Brahmachari.jpg",
        "File:Vishnubuva Brahmachari.jpg",
    ],
    "shankarshet": [
        "File:Jagannath Shankarshet.jpg",
        "File:Nana Shankarsheth.jpg",
    ],
    "lahuji": [
        "File:Lahuji Salve.jpg",
        "File:Lahuji Vastad Salve.jpg",
    ],
    "bhau-daji": [
        "File:Bhau Daji Lad.jpg",
        "File:Bhau Daji.jpg",
    ],
    "bhau-mahajan": [
        "File:Vishnushastri Pandit.jpg",
        "File:Bhau Mahajan.jpg",
    ],
    "phule": [
        "File:Jyotirao Phule.jpg",
        "File:Mahatma Jyotirao Phule.jpg",
        "File:Jyotiba Phule.jpg",
    ],
}

SEARCH_FALLBACK: dict[str, str] = {
    "sarvajanik-kaka": "Sarvajanik Kaka Joshi",
    "jambhekar": "Balshastri Jambhekar",
    "lokhitwadi": "Gopal Hari Deshmukh",
    "dadoba": "Dadoba Pandurang",
    "agarkar": "Gopal Ganesh Agarkar",
    "bhaurao-patil": "Bhaurao Patil",
    "vishnubuva": "Vishnubuwa Brahmachari",
    "shankarshet": "Jagannath Shankarshet",
    "lahuji": "Lahuji Salve",
    "bhau-daji": "Bhau Daji",
    "bhau-mahajan": "Vishnushastri Pandit",
    "ramabai-ranade": "Ramabai Ranade",
    "vr-shinde": "Vitthal Ramji Shinde",
    "sane-guruji": "Sane Guruji",
}


def api_get(params: dict, retries: int = 5) -> dict:
    params = {**params, "format": "json"}
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for i in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                time.sleep(2.5 * (i + 1))
                continue
            raise
    raise RuntimeError(f"API failed for {params}")


def imageinfo(title: str) -> tuple[str | None, str | None]:
    data = api_get(
        {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|mime",
            "iiurlwidth": 480,
        }
    )
    for p in data.get("query", {}).get("pages", {}).values():
        if p.get("missing") is not None or "imageinfo" not in p:
            continue
        ii = p["imageinfo"][0]
        mime = ii.get("mime", "")
        if not mime.startswith("image/"):
            continue
        return ii.get("thumburl") or ii.get("url"), mime
    return None, None


def search(term: str) -> list[str]:
    data = api_get(
        {
            "action": "query",
            "list": "search",
            "srsearch": term,
            "srnamespace": 6,
            "srlimit": 8,
        }
    )
    return [x["title"] for x in data.get("query", {}).get("search", [])]


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())


def ext_for(mime: str | None, url: str) -> str:
    if mime and "png" in mime:
        return ".png"
    if mime and "webp" in mime:
        return ".webp"
    if mime and "jpeg" in mime or mime and "jpg" in mime:
        return ".jpg"
    if url.lower().endswith(".png"):
        return ".png"
    return ".jpg"


def resolve(cid: str) -> tuple[str, str, str] | None:
    for title in FILES.get(cid, []):
        url, mime = imageinfo(title)
        time.sleep(0.8)
        if url:
            return title, url, mime or "image/jpeg"
    q = SEARCH_FALLBACK.get(cid)
    if q:
        for title in search(q):
            url, mime = imageinfo(title)
            time.sleep(0.8)
            if url:
                return title, url, mime or "image/jpeg"
    return None


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict] = {}
    for cid in FILES:
        existing = list(OUT.glob(f"{cid}.*"))
        if existing and cid in manifest:
            continue
        # reuse if already downloaded
        if existing:
            print(f"skip existing {cid}: {existing[0].name}")
            manifest[cid] = {
                "file": f"/notes/samajsudharak/{existing[0].name}",
                "source": "local-cache",
            }
            continue
        print(f"resolve {cid}…")
        hit = resolve(cid)
        if not hit:
            print(f"  NOT FOUND: {cid}")
            continue
        title, url, mime = hit
        ext = ext_for(mime, url)
        dest = OUT / f"{cid}{ext}"
        print(f"  {title} -> {dest.name}")
        download(url, dest)
        manifest[cid] = {
            "file": f"/notes/samajsudharak/{dest.name}",
            "commons": title,
            "license": "Wikimedia Commons (check file page)",
        }
        time.sleep(1.0)

    (OUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"done · {len(manifest)} portraits · {OUT}")


if __name__ == "__main__":
    main()

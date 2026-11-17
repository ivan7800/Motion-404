#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import hashlib
import re
import mimetypes
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
CSS = ROOT / "styles.css"
JS = ROOT / "app.js"
OUTPUT = ROOT / "Motion-404-PORTABLE.html"


def csp_hash(text: str) -> str:
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    return "sha256-" + base64.b64encode(digest).decode("ascii")


def as_data_uri(relative_path: str) -> str:
    path = ROOT / relative_path
    if not path.exists():
        return relative_path
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def build() -> str:
    html = INDEX.read_text(encoding="utf-8")
    css = CSS.read_text(encoding="utf-8")
    js = JS.read_text(encoding="utf-8")

    html = re.sub(r"\s*<meta http-equiv=\"Content-Security-Policy\"[^>]*>", "", html, count=1)
    html = html.replace("<title>Motion 404 — Prompt Studio</title>", "<title>Motion 404 — Prompt Studio Portable</title>")
    html = re.sub(r"\s*<link rel=\"manifest\"[^>]*>", "", html, count=1)
    html = re.sub(r"\s*<link rel=\"icon\"[^>]*>", "", html, count=1)
    html = re.sub(r"\s*<link rel=\"apple-touch-icon\"[^>]*>", "", html, count=1)

    style_content = f"\n{css}\n  "
    script_content = f"\n{js}\n  "
    style_tag = f"\n  <style>{style_content}</style>"
    if '<link rel="stylesheet" href="styles.css">' not in html:
        raise RuntimeError("No se encontró la hoja de estilos principal en index.html")
    html = html.replace('<link rel="stylesheet" href="styles.css">', style_tag, 1)

    if '<script defer src="app.js"></script>' not in html:
        raise RuntimeError("No se encontró app.js en index.html")
    html = html.replace('<script defer src="app.js"></script>', f"<script>{script_content}</script>", 1)
    html = html.replace('<a href="README.md">Documentación</a>', '<button id="portableDocsButton" type="button">Documentación</button>', 1)
    html = html.replace('<body>', '<body>\n  <!-- Versión portátil generada automáticamente desde index.html, styles.css y app.js. -->', 1)

    # Incrusta todos los recursos visuales utilizados por HTML o JavaScript para que el archivo sea realmente autónomo.
    local_assets = sorted(set(re.findall(r"assets/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|svg)", html)))
    for relative_path in local_assets:
        html = html.replace(relative_path, as_data_uri(relative_path))

    actual_style = re.search(r"<style>(.*?)</style>", html, re.S)
    actual_script = re.search(r"<script>(.*?)</script>", html, re.S)
    if not actual_style or not actual_script:
        raise RuntimeError("No se pudieron localizar los bloques inline para calcular la CSP")
    csp = (
        "default-src 'none'; img-src data:; "
        f"style-src '{csp_hash(actual_style.group(1))}'; script-src '{csp_hash(actual_script.group(1))}'; "
        "connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
    )
    marker = '<meta name="color-scheme" content="dark light">'
    if marker not in html:
        raise RuntimeError("No se encontró el punto de inserción de CSP")
    html = html.replace(marker, marker + f'\n  <meta http-equiv="Content-Security-Policy" content="{csp}">', 1)
    return html


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera la versión portátil de Motion 404")
    parser.add_argument("--check", action="store_true", help="Comprueba que la versión generada está sincronizada")
    args = parser.parse_args()
    generated = build()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != generated:
            raise SystemExit("FAIL: Motion-404-PORTABLE.html no está sincronizado. Ejecuta tools/build_portable.py")
        print("PASS: portable build is synchronized with source files.")
        return
    OUTPUT.write_text(generated, encoding="utf-8")
    print(f"WROTE: {OUTPUT}")


if __name__ == "__main__":
    main()

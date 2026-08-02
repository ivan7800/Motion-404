#!/usr/bin/env python3
from __future__ import annotations

import contextlib
import http.server
import json
import os
import shutil
import socketserver
import threading
import time
from pathlib import Path

from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt: str, *args: object) -> None:
        pass

@contextlib.contextmanager
def server():
    handler = lambda *args, **kwargs: QuietHandler(*args, directory=str(ROOT), **kwargs)
    with ReusableTCPServer(("127.0.0.1", 0), handler) as httpd:
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        time.sleep(0.2)
        try:
            yield httpd.server_address[1]
        finally:
            httpd.shutdown()
            thread.join(timeout=2)


def main() -> None:
    page_errors: list[str] = []
    console_errors: list[str] = []
    with server() as port, sync_playwright() as p:
        chromium_path = os.environ.get("CHROMIUM_PATH") or shutil.which("chromium") or shutil.which("chromium-browser") or shutil.which("google-chrome")
        launch_options = {"headless": True, "args": ["--no-sandbox", "--disable-gpu", "--no-proxy-server"]}
        if chromium_path:
            launch_options["executable_path"] = chromium_path
        browser = p.chromium.launch(**launch_options)
        context = browser.new_context(viewport={"width": 1440, "height": 1000})
        context.grant_permissions(["clipboard-read", "clipboard-write"], origin=f"http://127.0.0.1:{port}")
        page = context.new_page()
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        try:
            page.goto(f"http://127.0.0.1:{port}/", wait_until="networkidle")
        except PlaywrightError as exc:
            if "ERR_BLOCKED_BY_ADMINISTRATOR" in str(exc):
                print("BLOCKED: Chromium no permite navegar a 127.0.0.1 por la política administrativa del entorno.")
                raise SystemExit(2) from None
            raise

        assert page.title() == "Motion 404 — Prompt Studio"
        assert page.locator("#promptCount").inner_text() == "180"
        assert page.locator(".prompt-card").count() == 12
        assert "180" in page.locator("#resultsCount").inner_text()

        page.locator("#searchInput").fill("Arquitectura")
        page.wait_for_timeout(100)
        filtered = int(page.locator("#resultsCount").inner_text().split()[0])
        assert 0 < filtered < 180
        assert page.locator(".prompt-card").count() > 0
        page.locator("#clearFilters").click()
        assert "180" in page.locator("#resultsCount").inner_text()

        first = page.locator(".prompt-card").first
        first.locator('[data-action="favorite"]').click()
        assert page.locator("#favoriteCount").inner_text() == "1"
        assert first.locator('[data-action="favorite"]').get_attribute("aria-pressed") == "true"
        first.locator('[data-action="copy"]').click()
        page.wait_for_function("[...document.querySelectorAll('.toast')].some(el => el.textContent.toLowerCase().includes('copiado'))")

        first.locator('[data-action="open"]').click()
        assert page.locator("#promptDialog").get_attribute("open") is not None
        assert "Prompt profesional" in page.locator("#dialogPrompt").inner_text()
        page.locator("#promptTab").focus()
        page.keyboard.press("ArrowRight")
        assert page.locator("#checklistTab").get_attribute("aria-selected") == "true"
        assert page.locator("#dialogChecklist li").count() == 8
        page.locator("[data-close-dialog]").first.click()

        page.locator('input[name="project"]').fill("Prueba Atlas")
        page.locator("#generatorForm button[type=submit]").click()
        assert page.locator("#generatedPanel").is_visible()
        assert "Prueba Atlas" in page.locator("#generatedPrompt").inner_text()
        page.locator("#saveGenerated").click()
        assert page.locator("#promptCount").inner_text() == "181"
        assert page.locator("#favoriteCount").inner_text() == "2"

        initial_theme = page.locator("html").get_attribute("data-theme")
        page.locator("#themeButton").click()
        assert page.locator("html").get_attribute("data-theme") != initial_theme
        assert page.locator("#themeColorMeta").get_attribute("content") == "#f0eee9"

        with page.expect_download() as download_info:
            page.locator("#downloadGenerated").click()
        assert download_info.value.suggested_filename == "prueba-atlas-prompt.md"

        manifest = page.request.get(f"http://127.0.0.1:{port}/manifest.webmanifest")
        assert manifest.ok
        manifest_data = json.loads(manifest.text())
        assert manifest_data["start_url"] == "./"
        assert len(manifest_data["icons"]) == 3

        sw = page.request.get(f"http://127.0.0.1:{port}/sw.js")
        assert sw.ok and "v1.1.1" in sw.text()

        page.locator("#clearFilters").click()
        page.locator("#loadMoreButton").click()
        assert page.locator(".prompt-card").count() == 24
        assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")

        mobile = context.new_page()
        mobile.set_viewport_size({"width": 390, "height": 844})
        mobile.goto(f"http://127.0.0.1:{port}/", wait_until="networkidle")
        assert mobile.locator("#hero-title").is_visible()
        assert mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
        mobile.locator("#catalogo").scroll_into_view_if_needed()
        assert mobile.locator(".prompt-card").first.is_visible()
        mobile.close()

        page.evaluate("navigator.serviceWorker.ready.then(() => true)")
        page.reload(wait_until="networkidle")
        assert page.evaluate("Boolean(navigator.serviceWorker.controller)")
        docs = context.new_page()
        docs.goto(f"http://127.0.0.1:{port}/README.md", wait_until="networkidle")
        assert "Motion 404" in docs.locator("body").inner_text()
        docs.close()
        context.set_offline(True)
        page.reload(wait_until="domcontentloaded")
        assert page.title() == "Motion 404 — Prompt Studio"
        assert page.locator(".prompt-card").count() == 12
        context.set_offline(False)

        context.close()
        browser.close()

    ignored = [msg for msg in console_errors if "favicon" in msg.lower()]
    real_console_errors = [msg for msg in console_errors if msg not in ignored]
    assert not page_errors, f"Page errors: {page_errors}"
    assert not real_console_errors, f"Console errors: {real_console_errors}"
    print("PASS: Motion 404 smoke test completed without page or console errors.")

if __name__ == "__main__":
    main()

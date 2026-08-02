#!/usr/bin/env python3
from __future__ import annotations

import os
import shutil
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    html = (ROOT / "Motion-404-PORTABLE.html").read_text(encoding="utf-8")
    page_errors: list[str] = []
    console_errors: list[str] = []

    with sync_playwright() as p:
        chromium_path = (
            os.environ.get("CHROMIUM_PATH")
            or shutil.which("chromium")
            or shutil.which("chromium-browser")
            or shutil.which("google-chrome")
        )
        launch_options: dict[str, object] = {
            "headless": True,
            "args": ["--no-sandbox", "--disable-gpu", "--no-proxy-server"],
        }
        if chromium_path:
            launch_options["executable_path"] = chromium_path

        browser = p.chromium.launch(**launch_options)
        context = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = context.new_page()
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))
        page.on(
            "console",
            lambda msg: console_errors.append(msg.text) if msg.type == "error" else None,
        )
        page.set_content(html, wait_until="load")
        page.wait_for_timeout(300)

        assert page.title() == "Motion 404 — Prompt Studio Portable"
        assert page.locator("#hero-title").is_visible()
        assert page.locator("#installButton").is_hidden(), "Install control must stay hidden until beforeinstallprompt fires."
        assert page.locator("#promptCount").inner_text() == "180"
        assert page.locator(".prompt-card").count() == 12
        assert "180" in page.locator("#resultsCount").inner_text()

        assert page.locator("#sectorCount").inner_text() == "17"
        for query in ("aplicacion", "automocion", "tipografia", "diseno"):
            page.locator("#searchInput").fill(query)
            page.wait_for_timeout(50)
            assert int(page.locator("#resultsCount").inner_text().split()[0]) > 0, query
        page.locator("#clearFilters").click()
        page.locator("#portableDocsButton").click()
        assert page.locator("#infoDialog").get_attribute("open") is not None
        assert "documentación" in page.locator("#infoDialog").inner_text().lower()
        page.locator("#infoDialog [data-close-dialog]").click()

        first = page.locator(".prompt-card").first
        first.locator('[data-action="favorite"]').click()
        assert page.locator("#favoriteCount").inner_text() == "1"
        first.locator('[data-action="open"]').click()
        assert page.locator("#promptDialog").get_attribute("open") is not None
        page.locator("[data-close-dialog]").first.click()

        page.locator('input[name="project"]').fill("Prueba local")
        page.locator("#generatorForm button[type=submit]").click()
        assert page.locator("#generatedPanel").is_visible()
        assert "Prueba local" in page.locator("#generatedPrompt").inner_text()
        assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")

        mobile = context.new_page()
        mobile.set_viewport_size({"width": 390, "height": 844})
        mobile.set_content(html, wait_until="load")
        mobile.wait_for_timeout(200)
        assert mobile.locator("#hero-title").is_visible()
        assert mobile.locator(".prompt-card").count() == 12
        assert mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
        mobile.close()

        context.close()
        browser.close()

    assert not page_errors, f"Page errors: {page_errors}"
    assert not console_errors, f"Console errors: {console_errors}"
    print("PASS: portable build renders and core interactions work without page or console errors.")


if __name__ == "__main__":
    main()

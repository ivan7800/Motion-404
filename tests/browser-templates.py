"""Browser QA for Web Templates Studio. Run against local MOTION_URL base."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get("MOTION_URL", "http://127.0.0.1:8080/").rstrip("/") + "/"
OUTPUT = Path(os.environ.get("MOTION_QA_OUTPUT", "/tmp/motion-templates-qa"))
OUTPUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    chrome = os.environ.get("CHROMIUM_PATH")
    browser = p.chromium.launch(headless=True, executable_path=chrome if chrome else None)
    page = browser.new_page(viewport={"width": 1440, "height": 900}, accept_downloads=True)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    response = page.goto(BASE + "templates/", wait_until="networkidle")
    assert response and response.status == 200
    assert page.locator(".template").count() == 8
    for name in ["Portfolio", "Ecommerce", "Dashboard", "Gaming", "Restaurante", "Viajes", "Automoción", "Arquitectura"]:
        page.get_by_role("button", name=name).click()
        assert page.locator(".template[aria-pressed=true]").count() == 1
        assert page.frame_locator("#preview").locator("h1").count() == 1
    page.locator("#siteName").fill("Mi Estudio")
    page.locator("#headline").fill("Mi nueva web")
    page.locator("#description").fill("Un diseño de prueba")
    page.locator("#target").fill("javascript:alert(1)")
    page.locator("#mobile").click()
    assert "mobile" in page.locator("#viewport").get_attribute("class")
    expect(page.frame_locator("#preview").locator("h1")).to_have_text("Mi nueva web", timeout=5000)
    expect(page.frame_locator("#preview").locator("a.cta")).to_have_attribute("href", "#explorar", timeout=5000)
    with page.expect_download() as download_info:
        page.locator("#download").click()
    download = download_info.value
    assert download.suggested_filename == "mi-estudio-motion404.html"
    path = OUTPUT / download.suggested_filename
    download.save_as(path)
    contents = path.read_text(encoding="utf-8")
    assert "Mi nueva web" in contents and "javascript:alert" not in contents
    page.screenshot(path=str(OUTPUT / "templates-desktop.png"), full_page=True)
    assert not errors, errors
    browser.close()
print("Web Templates Studio: 8 templates, editor, mobile, URL guard, HTML export OK")

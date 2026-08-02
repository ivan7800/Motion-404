#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import shutil
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


def browser_options() -> dict[str, object]:
    chromium_path = (
        os.environ.get("CHROMIUM_PATH")
        or shutil.which("chromium")
        or shutil.which("chromium-browser")
        or shutil.which("google-chrome")
    )
    options: dict[str, object] = {
        "headless": True,
        "args": ["--no-sandbox", "--disable-gpu", "--no-proxy-server"],
    }
    if chromium_path:
        options["executable_path"] = chromium_path
    return options


def main() -> None:
    html = (ROOT / "Motion-404-PORTABLE.html").read_text(encoding="utf-8")
    page_errors: list[str] = []
    console_errors: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(**browser_options())
        context = browser.new_context(viewport={"width": 1440, "height": 1000}, accept_downloads=True)
        page = context.new_page()
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("dialog", lambda dialog: dialog.accept())
        page.set_content(html, wait_until="load")
        page.wait_for_timeout(250)
        page.evaluate("""Object.defineProperty(window,'localStorage',{value:{
          getItem(key){return window.__storage?.[key] ?? null},
          setItem(key,value){window.__storage=window.__storage||{};window.__storage[key]=String(value)},
          removeItem(key){if(window.__storage)delete window.__storage[key]}
        }}); storageAvailable=true;""")

        # Arranque y accesibilidad básica.
        assert page.locator("#hero-title").is_visible()
        assert page.locator("#installButton").is_hidden(), "Install control must not be a dead button outside an installable context."
        assert page.locator(".prompt-card").count() == 12
        catalog_shape = page.evaluate("""({count:basePrompts.length,ids:new Set(basePrompts.map(item=>item.id)).size,titles:new Set(basePrompts.map(item=>item.title)).size,empty:basePrompts.filter(item=>!item.title||!item.prompt).length})""")
        assert catalog_shape == {"count": 180, "ids": 180, "titles": 180, "empty": 0}
        assert page.locator("#promptDialog").get_attribute("aria-labelledby") == "dialogTitle"
        assert page.locator("#infoDialog").get_attribute("aria-labelledby") == "infoDialogTitle"
        page.keyboard.press("Tab")
        assert page.evaluate("document.activeElement.classList.contains('skip-link')")

        # Búsqueda, vacío, restablecimiento y filtros.
        page.locator("#searchInput").fill("consulta-inexistente-404")
        assert page.locator("#emptyState").is_visible()
        page.locator("#emptyReset").click()
        assert "180" in page.locator("#resultsCount").inner_text()
        page.locator('[data-category="Arquitectura"]').click()
        architecture_count = int(page.locator("#resultsCount").inner_text().split()[0])
        assert 0 < architecture_count < 180
        page.locator("#clearFilters").click()
        page.locator("#stackFilter").select_option(label="React + Tailwind")
        stack_count = int(page.locator("#resultsCount").inner_text().split()[0])
        assert 0 < stack_count < 180
        page.locator("#levelFilter").select_option("Avanzado")
        assert int(page.locator("#resultsCount").inner_text().split()[0]) <= stack_count
        page.locator("#sortFilter").select_option("az")
        titles = page.locator(".prompt-card h3").all_inner_texts()
        assert titles == sorted(titles, key=str.casefold)
        page.locator("#clearFilters").click()

        # Favoritos, copia, selección aleatoria y diálogo.
        first = page.locator(".prompt-card").first
        first.locator('[data-action="favorite"]').click()
        assert page.locator("#favoriteCount").inner_text() == "1"
        assert page.evaluate("Boolean(window.__storage[STORAGE_KEY])")
        page.wait_for_timeout(50)
        assert page.evaluate("document.activeElement?.dataset?.action === 'favorite'"), "Favorite re-render must restore keyboard focus."
        page.locator("#favoritesToggle").click()
        assert page.locator(".prompt-card").count() == 1
        page.locator("#favoritesToggle").click()
        first = page.locator(".prompt-card").first
        first.locator('[data-action="copy"]').click()
        page.wait_for_function("[...document.querySelectorAll('.toast')].some(el => el.textContent.toLowerCase().includes('copiado'))")
        page.locator("#randomButton").click()
        assert page.locator("#promptDialog").get_attribute("open") is not None
        dialog_favorite_before = page.locator("#dialogFavorite").get_attribute("aria-pressed")
        page.locator("#dialogFavorite").click()
        assert page.locator("#dialogFavorite").get_attribute("aria-pressed") != dialog_favorite_before
        page.locator("#dialogCopy").click()
        page.wait_for_function("[...document.querySelectorAll('.toast')].some(el => el.textContent.toLowerCase().includes('copiado'))")
        page.locator("#promptTab").focus()
        page.keyboard.press("ArrowRight")
        assert page.locator("#checklistTab").get_attribute("aria-selected") == "true"
        assert page.locator("#checklistTab").get_attribute("tabindex") == "0"
        page.keyboard.press("ArrowRight")
        assert page.locator("#promptTab").get_attribute("aria-selected") == "true"
        page.keyboard.press("ArrowLeft")
        assert page.locator("#checklistTab").get_attribute("aria-selected") == "true"
        page.keyboard.press("Home")
        assert page.locator("#promptTab").get_attribute("aria-selected") == "true"
        page.keyboard.press("End")
        assert page.locator("#checklistTab").get_attribute("aria-selected") == "true"
        page.locator("[data-close-dialog]").first.click()

        # Generador, escaping, guardado y descarga.
        page.locator('input[name="project"]').fill("   ")
        page.locator("#generatorForm button[type=submit]").click()
        assert page.locator("#generatedPanel").is_hidden()
        assert page.locator('input[name="project"]').evaluate("element => Boolean(element.validationMessage)")
        page.locator('input[name="project"]').fill('<img src=x onerror=alert(1)> Atlas')
        page.locator('textarea[name="context"]').fill('<script>window.__xss = true</script> contexto')
        page.locator("#generatorForm button[type=submit]").click()
        assert page.locator("#generatedPanel").is_visible()
        assert page.evaluate("document.activeElement?.id === 'generatedTitle'"), "Generated result should receive focus."
        assert "<img" in page.locator("#generatedPrompt").inner_text()
        assert page.locator("#generatedPrompt img").count() == 0
        assert page.evaluate("window.__xss !== true")

        # Clipboard fallback must fail gracefully instead of creating an uncaught exception.
        page.evaluate("""(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText(){return Promise.reject(new Error('blocked'))}}}); document.execCommand=()=>{throw new Error('unsupported')}; return true;})()""")
        page.locator("#copyGenerated").click()
        page.wait_for_function("[...document.querySelectorAll('.toast')].some(el => el.textContent.includes('No se pudo copiar'))")
        page.locator("#saveGenerated").click()
        assert page.locator("#promptCount").inner_text() == "181"
        page.locator("#saveGenerated").click()
        assert page.locator("#promptCount").inner_text() == "181"
        with page.expect_download() as download_info:
            page.locator("#downloadGenerated").click()
        assert download_info.value.suggested_filename.endswith("-prompt.md")

        with page.expect_download() as export_info:
            page.locator("#exportDataButton").click()
        exported_path = export_info.value.path()
        exported = json.loads(Path(exported_path).read_text(encoding="utf-8"))
        assert exported["app"] == "Motion 404" and exported["schemaVersion"] == 1

        with page.expect_file_chooser() as chooser_info:
            page.locator("#importDataButton").click()
        chooser_info.value.set_files([])

        page.locator("#resetGenerator").click()
        page.wait_for_timeout(50)
        assert page.locator("#generatedPanel").is_hidden()
        assert page.locator('input[name="project"]').input_value() == ""

        # Tema y color del navegador.
        assert page.locator("html").get_attribute("data-theme") == "dark"
        page.locator("#themeButton").click()
        assert page.locator("html").get_attribute("data-theme") == "light"
        assert page.locator("#themeColorMeta").get_attribute("content") == "#f0eee9"

        # Información y documentación de la versión portátil.
        page.locator("#privacyButton").click()
        assert page.locator("#infoDialogTitle").inner_text() == "Sin rastreo."
        page.locator("#infoDialog [data-close-dialog]").click()
        page.locator("#aboutButton").click()
        assert page.locator("#infoDialogTitle").inner_text() == "Motion 404"
        page.locator("#infoDialog [data-close-dialog]").click()
        page.locator("#portableDocsButton").click()
        assert "versión portátil" in page.locator("#infoDialogTitle").inner_text().lower()
        page.locator("#infoDialog [data-close-dialog]").click()

        # Normalización de datos corruptos y XSS importado.
        normalized = page.evaluate("""normalizeState({
          version: 1,
          theme: 'malicioso',
          favorites: ['m404-001', 'inexistente'],
          customPrompts: [{id:'custom-x',title:'  <img onerror=alert(1)>  ',prompt:'contenido',category:'NO',stack:'NO',checklist:'NO'}]
        })""")
        assert normalized["theme"] == "dark"
        assert normalized["favorites"] == ["m404-001"]
        assert normalized["customPrompts"][0]["category"] == "Aplicación"
        assert isinstance(normalized["customPrompts"][0]["checklist"], list)

        with tempfile.TemporaryDirectory() as temp_dir:
            valid_file = Path(temp_dir) / "backup.json"
            valid_file.write_text(json.dumps({
                "app": "Motion 404",
                "schemaVersion": 1,
                "theme": "dark",
                "favorites": ["custom-importado"],
                "customPrompts": [{
                    "id": "custom-importado",
                    "title": "<img src=x onerror=alert(1)>",
                    "prompt": "Prompt importado",
                    "category": "Aplicación",
                    "industry": "IA y software",
                    "style": "Brutalismo editorial",
                    "motion": "Microinteracciones suaves",
                    "stack": "HTML + CSS + JS",
                    "checklist": ["Comprobar"]
                }]
            }), encoding="utf-8")
            page.locator("#importFileInput").set_input_files(str(valid_file))
            page.wait_for_timeout(150)
            assert page.locator("#promptCount").inner_text() == "181"
            assert page.locator(".prompt-card img.example-image").count() == 12
            assert page.locator('img[src="x"]').count() == 0
            assert page.evaluate("window.__xss !== true")

            invalid_file = Path(temp_dir) / "invalid.json"
            invalid_file.write_text('{"schemaVersion":1}', encoding="utf-8")
            page.locator("#importFileInput").set_input_files(str(invalid_file))
            page.wait_for_timeout(100)
            assert page.locator(".toast").filter(has_text="no corresponde").count() > 0

        # Borrado local y reinicio funcional.
        page.locator("#clearDataButton").click()
        page.wait_for_timeout(100)
        assert page.locator("#promptCount").inner_text() == "180"
        assert page.locator("#favoriteCount").inner_text() == "0"
        assert page.locator("html").get_attribute("data-theme") == "dark"
        assert page.evaluate("!window.__storage || !(STORAGE_KEY in window.__storage)")

        # Evicting the 201st custom prompt must not leave a stale favorite ID.
        stale_id = page.evaluate("""(() => {
          persisted.customPrompts=Array.from({length:MAX_CUSTOM_PROMPTS},(_,index)=>({
            id:`custom-limit-${index}`,title:`Prompt ${index}`,prompt:`Contenido ${index}`,custom:true,
            category:'Aplicación',industry:'IA y software',description:'Prueba',style:styles[0],motion:motions[0],
            stack:stacks[0],level:'Personalizado',featured:true,created:index,paletteIndex:0,checklist:[...checkItems]
          }));
          persisted.favorites=persisted.customPrompts.map(item=>item.id);
          state.generatedText='Prompt nuevo distinto';
          state.generatedMeta={project:'Prompt límite',type:'Aplicación web',industry:'IA y software',style:styles[0],motion:motions[0],stack:stacks[0]};
          const stale=persisted.customPrompts.at(-1).id;
          saveGenerated();
          return stale;
        })()""")
        assert page.evaluate("persisted.customPrompts.length === MAX_CUSTOM_PROMPTS")
        assert page.evaluate("stale => !persisted.favorites.includes(stale)", stale_id)
        assert page.evaluate("persisted.favorites.every(id => allPrompts().some(prompt => prompt.id === id))")
        page.locator("#clearDataButton").click()

        # Carga incremental y responsive extremo.
        page.locator("#loadMoreButton").click()
        assert page.locator(".prompt-card").count() == 24
        assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")

        narrow = context.new_page()
        narrow.set_viewport_size({"width": 320, "height": 800})
        narrow.set_content(html, wait_until="load")
        narrow.wait_for_timeout(150)
        assert narrow.locator("#hero-title").is_visible()
        assert narrow.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
        narrow.close()

        reduced_context = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        reduced = reduced_context.new_page()
        reduced.set_content(html, wait_until="load")
        reduced.wait_for_timeout(100)
        assert reduced.locator("#hero-title").is_visible()
        assert reduced.evaluate("parseFloat(getComputedStyle(document.querySelector('.kinetic-shape')).animationDuration) <= 0.001")
        reduced_context.close()

        no_script_context = browser.new_context(viewport={"width": 390, "height": 844}, java_script_enabled=False)
        no_script = no_script_context.new_page()
        no_script.set_content(html, wait_until="load")
        assert no_script.locator(".noscript-warning").is_visible()
        assert no_script.locator("#hero-title").is_visible(), "Static content must remain readable when JavaScript is disabled."
        no_script_context.close()

        valid_state = context.new_page()
        valid_state.evaluate("""(()=>{const seed=JSON.stringify({version:1,theme:'light',favorites:['m404-001'],customPrompts:[{id:'custom-seed',title:'Semilla',prompt:'Contenido',category:'Aplicación',industry:'IA y software',description:'Cargado',style:'Brutalismo editorial',motion:'Microinteracciones suaves',stack:'HTML + CSS + JS',checklist:['Comprobar']}]});Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(){return seed},setItem(){},removeItem(){}}});return true})()""")
        valid_state.set_content(html, wait_until="load")
        valid_state.wait_for_timeout(100)
        assert valid_state.locator("#promptCount").inner_text() == "181"
        assert valid_state.locator("#favoriteCount").inner_text() == "1"
        assert valid_state.locator("html").get_attribute("data-theme") == "light"
        valid_state.close()

        # Install control is hidden by default and becomes actionable only after the browser event.
        page.evaluate("""(()=>{const event=new Event('beforeinstallprompt',{cancelable:true});Object.defineProperties(event,{prompt:{value:()=>Promise.resolve()},userChoice:{value:Promise.resolve({outcome:'dismissed'})}});window.dispatchEvent(event);return true})()""")
        assert page.locator("#installButton").is_visible()
        page.locator("#installButton").click()
        page.wait_for_timeout(50)
        assert page.locator("#installButton").is_hidden()

        # Actual startup recovery paths, before the application script runs.
        corrupt = context.new_page()
        corrupt.evaluate("""(()=>{Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(){return '{bad-json'},setItem(){},removeItem(){window.__removed=true}}});return true})()""")
        corrupt.set_content(html, wait_until="load")
        corrupt.wait_for_timeout(100)
        assert corrupt.locator(".prompt-card").count() == 12
        assert corrupt.evaluate("window.__removed === true")
        corrupt.close()

        blocked = context.new_page()
        blocked.evaluate("""(()=>{Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('blocked','SecurityError')}});return true})()""")
        blocked.set_content(html, wait_until="load")
        blocked.wait_for_timeout(100)
        assert blocked.locator(".prompt-card").count() == 12
        assert blocked.locator(".toast").filter(has_text="solo esta sesión").count() > 0
        blocked.close()

        context.close()
        browser.close()

    assert not page_errors, f"Page errors: {page_errors}"
    assert not console_errors, f"Console errors: {console_errors}"
    print("PASS: extended functional, accessibility, validation, security and responsive audit completed.")


if __name__ == "__main__":
    main()

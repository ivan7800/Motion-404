#!/usr/bin/env python3
"""Servidor local MOTION-404 usando exclusivamente la biblioteca estandar Python."""
import functools
import http.server
import os
import pathlib
import socketserver
import sys
import threading
import webbrowser

ROOT = pathlib.Path(__file__).resolve().parent.parent

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.mjs': 'text/javascript; charset=utf-8'}
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        # The embedded original is framed only by this same-origin Ultimate application.
        legacy = self.path.split('?', 1)[0].rstrip('/') == '/original-runtime/index.html'
        self.send_header('Content-Security-Policy', "frame-ancestors 'self'" if legacy else "frame-ancestors 'none'")
        super().end_headers()

class Server(http.server.ThreadingHTTPServer):
    allow_reuse_address = True

def main():
    preferred = int(os.getenv('PORT', '8080'))
    try:
        server = Server(('127.0.0.1', preferred), Handler)
    except OSError as error:
        if error.errno not in (48, 98, 10048):
            raise
        print(f'Puerto {preferred} ocupado; buscando otro libre.', flush=True)
        server = Server(('127.0.0.1', 0), Handler)
    url = f'http://127.0.0.1:{server.server_address[1]}/'
    print(f'MOTION-404 ULTIMATE STUDIO — LISTO\n{url}\nPara cerrar: Ctrl+C', flush=True)
    if os.getenv('MOTION_OPEN_BROWSER') == '1':
        # Se abre solo cuando socket servidor ya está ligado; servir comienza inmediatamente.
        threading.Timer(0.3, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nCerrando servidor...')
    finally:
        server.server_close()

if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'ERROR de arranque: {exc}', file=sys.stderr)
        sys.exit(1)

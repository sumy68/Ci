"""Lokaler Testserver, der sich wie GitHub Pages verhält:
/impressum -> impressum.html, unbekannte Pfade -> 404.html (Status 404),
gzip für Textdateien (wie GitHub Pages), damit Lighthouse realistisch misst."""
import gzip
import http.server
import os
import sys
import urllib.parse

COMPRESSIBLE = ('.html', '.css', '.js', '.svg', '.xml', '.json', '.txt', '.webmanifest')


class Handler(http.server.SimpleHTTPRequestHandler):
    def _local(self):
        path = urllib.parse.urlsplit(self.path).path
        local = self.translate_path(path)
        if os.path.isdir(local):
            local = os.path.join(local, 'index.html')
        if not os.path.exists(local) and os.path.exists(local + '.html'):
            local = local + '.html'
        return local

    def do_GET(self):
        local = self._local()
        if not os.path.isfile(local):
            return self._send(os.path.join(os.getcwd(), '404.html'), 404)
        if local.endswith(COMPRESSIBLE) and 'gzip' in self.headers.get('Accept-Encoding', ''):
            return self._send(local, 200)
        return super().do_GET()

    def _send(self, file, status):
        with open(file, 'rb') as f:
            body = f.read()
        gz = 'gzip' in self.headers.get('Accept-Encoding', '')
        if gz:
            body = gzip.compress(body, 6)
        self.send_response(status)
        self.send_header('Content-Type', self.guess_type(file))
        if gz:
            self.send_header('Content-Encoding', 'gzip')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()

#!/usr/bin/env python3
"""
Simple HTTP server for the static site.
Run with: python3 serve.py
"""
import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # Handle SPA routing - serve index.html for all routes
        if not os.path.exists(self.translate_path(self.path)):
            if not self.path.startswith('/css') and not self.path.startswith('/js') and not self.path.startswith('/data') and not self.path.startswith('/svg') and not self.path.startswith('/png') and not self.path.startswith('/videos') and not self.path.startswith('/files'):
                self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

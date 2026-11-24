"""Converte o Markdown oficial em HTML imprimível; requer Python Markdown."""
from pathlib import Path
import markdown
import re

root = Path(__file__).resolve().parent
source = (root / 'relatorio-tecnico.md').read_text(encoding='utf-8')
body = markdown.markdown(source, extensions=['tables', 'fenced_code', 'attr_list', 'toc'])
body = re.sub(r'src="(evidencias/[^\"]+)"', lambda match: 'src="' + (root / match.group(1)).as_uri() + '"', body)
body = body.replace('<table>\n<thead>\n<tr>\n<th>ID</th>', '<table class="test-table">\n<thead>\n<tr>\n<th>ID</th>')
css = """
@page { size: A4; margin: 20mm 20mm 20mm 23mm; }
* { box-sizing: border-box; }
body { font-family: 'Segoe UI', Arial, sans-serif; color: #202020; font-size: 10.5pt; line-height: 1.43; margin: 0; }
h1 { font-size: 17pt; line-height: 1.2; margin: 8mm 0 5mm; padding-top: 1mm; color: #153e30; }
h2 { font-size: 12pt; margin: 6mm 0 2mm; } h3 { font-size: 11pt; }
h1,h2,h3 { break-after: avoid; }
p { margin: 0 0 3.2mm; orphans: 3; widows: 3; }
ul,ol { padding-left: 6mm; margin: 2mm 0 4mm; } li { margin-bottom: 1mm; }
a { color: #155b46; text-decoration: none; overflow-wrap: anywhere; }
strong { font-weight: 650; }
table { width: 100%; border-collapse: collapse; font-size: 8.8pt; line-height: 1.28; margin: 4mm 0; table-layout: auto; }
th,td { text-align: left; vertical-align: top; padding: 2mm; border: 0.3pt solid #bac7c0; overflow-wrap: anywhere; }
th { background: #edf2ef; font-weight: 650; } tr { break-inside: avoid; } thead { display: table-header-group; }
.test-table th:first-child, .test-table td:first-child { min-width: 9mm; white-space: nowrap; }
pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #f3f5f4; border: .4pt solid #d3dad6; padding: 3mm; font-size: 8.2pt; line-height: 1.4; break-inside: avoid; }
code { font-family: Consolas, 'Courier New', monospace; font-size: .92em; overflow-wrap: anywhere; }
img { display: block; max-width: 100%; max-height: 154mm; object-fit: contain; margin: 3mm auto; }
figure { padding: 0; margin: 5mm 0; break-inside: avoid; }
figure img { width: 100%; } figcaption { font-size: 9pt; line-height: 1.35; margin: 2mm 0 0; color: #3f4844; }
.figure-small img { max-height: 125mm; }
.page-break { break-before: page; }
.cover { height: 245mm; position: relative; text-align: center; break-after: page; padding-top: 8mm; }
.institution { font-size: 12pt; text-transform: uppercase; font-weight: 650; line-height: 1.7; }
.cover .author { margin-top: 24mm; font-size: 12pt; }
.cover .title { margin-top: 32mm; font-size: 25pt; font-weight: 650; color: #153e30; }
.cover .subtitle { font-size: 14pt; margin-top: 3mm; }
.cover .description { text-align: left; width: 104mm; margin: 26mm 0 0 auto; font-size: 10.5pt; }
.cover .date { position: absolute; bottom: 3mm; width: 100%; font-size: 11pt; }
.toc-page { break-after: page; } .toc-title { font-size: 17pt; margin: 0 0 8mm; font-weight: 650; color: #153e30; }
.toc-page li { margin-bottom: 4mm; }
.note { background: #f1f5f2; border-left: 3pt solid #31634b; padding: 3mm; margin: 4mm 0; }
.diagram { display: flex; align-items: center; justify-content: space-between; gap: 3mm; margin: 6mm 0; }
.diagram span { border: 1pt solid #638472; padding: 4mm 3mm; border-radius: 2mm; background: #f4f7f5; font-weight: 600; text-align: center; font-size: 10pt; }
"""
html = '<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>EcoWatt — Relatório Técnico</title><style>' + css + '</style></head><body>' + body + '</body></html>'
output = root / '.rendered'
output.mkdir(exist_ok=True)
(output / 'report.html').write_text(html, encoding='utf-8')
print(output / 'report.html')

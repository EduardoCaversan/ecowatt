import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(new URL('./.rendered/report.html', import.meta.url).href);
await page.evaluate(() => Promise.all([...document.images].map(image => image.decode())));
await page.pdf({
  path: fileURLToPath(new URL('./relatorio-tecnico.pdf', import.meta.url)),
  format: 'A4', printBackground: true, preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: '<div style="font-family:Arial;font-size:8px;color:#58655e;width:100%;margin:0 20mm 0 23mm;display:flex;justify-content:space-between"><span>EcoWatt · Operação Deploy · UTFPR</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  tagged: true, outline: true
});
console.log('PDF gerado: docs/relatorio-tecnico.pdf');
await browser.close();

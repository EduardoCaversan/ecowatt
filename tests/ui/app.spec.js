import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

async function capture(page, name) {
  if (!process.env.EVIDENCE_DIR) return;
  mkdirSync(process.env.EVIDENCE_DIR, { recursive: true });
  await page.screenshot({ path: path.join(process.env.EVIDENCE_DIR, `${name}.png`), fullPage: true });
}
async function add(page, name, power, hours, quantity) {
  await page.getByLabel('Nome do equipamento').fill(name);
  await page.getByLabel('Potência').fill(String(power));
  await page.getByLabel('Horas por dia').fill(String(hours));
  await page.getByLabel('Quantidade', { exact: true }).fill(String(quantity));
  await page.getByRole('button', { name: 'Adicionar equipamento' }).click();
}
async function exercise(page, label) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto('./');
  expect(response.status()).toBe(200);
  await expect(page.locator('#empty-state')).toBeVisible();
  await expect(page.locator('#version')).toContainText('v1.0.0');
  await capture(page, `${label}-01-vazio`);
  await add(page, 'Aquecedor', 1500, 4, 1);
  await expect(page.locator('#total-consumption')).toHaveText('180');
  await expect(page.locator('#total-cost')).toHaveText(/R\$\s162,00/);
  await add(page, 'Lâmpadas', 100, 5, 3);
  await expect(page.locator('#total-consumption')).toHaveText('225');
  await expect(page.locator('#total-cost')).toHaveText(/R\$\s202,50/);
  await expect(page.locator('#total-quantity')).toHaveText('4');
  await expect(page.locator('#largest-name')).toHaveText('Aquecedor');
  await expect(page.locator('.bar-label').first()).toContainText('80%');
  await capture(page, `${label}-02-cenario-c`);
  await page.reload();
  await expect(page.locator('#total-cost')).toHaveText(/R\$\s202,50/);
  await page.getByLabel('Tarifa (R$/kWh)').fill('1.2');
  await page.getByRole('button', { name: 'Atualizar', exact: true }).click();
  await expect(page.locator('#total-cost')).toHaveText(/R\$\s270,00/);
  await page.reload();
  await expect(page.getByLabel('Tarifa (R$/kWh)')).toHaveValue('1.2');
  await expect(page.locator('#total-cost')).toHaveText(/R\$\s270,00/);
  await add(page, 'Inválido', 100, 25, 1);
  await expect(page.locator('#form-error')).toContainText('24 horas');
  await expect(page.locator('#equipment-list tr')).toHaveCount(2);
  await capture(page, `${label}-03-validacao`);
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Excluir Aquecedor', exact: true }).click();
  await expect(page.locator('#equipment-list tr')).toHaveCount(2);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Excluir Aquecedor', exact: true }).click();
  await expect(page.locator('#total-consumption')).toHaveText('45');
  await expect(page.locator('#total-cost')).toHaveText(/R\$\s54,00/);
  await page.reload();
  await expect(page.locator('#equipment-list tr')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const versionResponse = await page.request.get(`version.json?verify=${Date.now()}`);
  expect(versionResponse.status()).toBe(200);
  const version = await versionResponse.json();
  if (process.env.EXPECTED_SHA) expect(version.commit).toBe(process.env.EXPECTED_SHA);
  await expect(page.locator('#version')).toContainText(version.commit.slice(0, 7));
  expect(errors).toEqual([]);
}

test('UI01 fluxo completo desktop, persistência, validações e versão', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await exercise(page, 'desktop');
});
test('UI02 fluxo completo mobile sem transbordamento de página', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await exercise(page, 'mobile');
});
test('UI03 protege dados corrompidos e renderiza texto sem executar HTML', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('ecowatt:v1', '{inválido'));
  await page.reload();
  await expect(page.locator('#storage-warning')).toContainText('preservados');
  await expect(page.getByRole('button', { name: 'Adicionar equipamento' })).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem('ecowatt:v1'))).toBe('{inválido');
  await capture(page, 'armazenamento-corrompido');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Descartar dados inválidos' }).click();
  expect(await page.evaluate(() => localStorage.getItem('ecowatt:v1'))).toBe('{inválido');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Descartar dados inválidos' }).click();
  await add(page, '<img src=x onerror="window.injected=true">', 10, 1, 1);
  await expect(page.locator('#equipment-list th')).toHaveText('<img src=x onerror="window.injected=true">');
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
  await expect(page.locator('#equipment-list img')).toHaveCount(0);
});
test('UI04 comunica acesso negado ao LocalStorage e permite sessão temporária', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } }));
  await page.goto('./');
  await expect(page.locator('#storage-warning')).toContainText('apenas nesta sessão');
  await add(page, 'Computador', 500, 4, 1);
  await expect(page.locator('#total-consumption')).toHaveText('60');
  await expect(page.locator('#status')).toContainText('apenas nesta sessão');
});
test('UI05 comunica falha de escrita sem informar que salvou', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.goto('./');
  await add(page, 'Computador', 500, 4, 1);
  await expect(page.locator('#storage-warning')).toContainText('Não foi possível salvar');
  await expect(page.locator('#status')).toContainText('apenas nesta sessão');
  await expect(page.locator('#total-consumption')).toHaveText('60');
});

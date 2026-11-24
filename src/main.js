import './styles.css';
import { summarize, removeEquipment } from './energy.js';
import { createStorage } from './storage.js';

const $ = id => document.getElementById(id);
const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const storage = createStorage();
const loaded = storage.load();
let state = loaded.state;

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function warn(message) {
  $('storage-message').textContent = message;
  $('storage-warning').hidden = !message;
}

function showError(id, message = '') {
  $(id).textContent = message;
  $(id).hidden = !message;
  if (message) $(id).focus();
}

function render() {
  const summary = summarize(state.equipment, state.tariff);
  $('total-quantity').textContent = number.format(summary.quantity);
  $('total-consumption').textContent = number.format(summary.consumption);
  $('total-cost').textContent = money.format(summary.cost);
  $('largest-name').textContent = summary.largest?.name ?? '—';
  $('largest-value').textContent = summary.largest ? `${number.format(summary.largest.consumption)} kWh/mês` : 'adicione um equipamento';
  $('group-count').textContent = `${summary.items.length} ${summary.items.length === 1 ? 'grupo' : 'grupos'}`;
  $('tariff').value = state.tariff;
  $('empty-state').hidden = summary.items.length > 0;
  $('table-container').hidden = !summary.items.length;
  $('distribution-empty').hidden = summary.items.length > 0;
  $('equipment-list').replaceChildren();
  $('distribution').replaceChildren();
  for (const item of summary.items) {
    const row = node('tr');
    const name = node('th', item.name); name.scope = 'row'; row.append(name);
    for (const value of [`${number.format(item.powerWatts)} W`, number.format(item.dailyHours), number.format(item.quantity), number.format(item.consumption), money.format(item.cost)]) row.append(node('td', value));
    const action = node('td');
    const button = node('button', 'Excluir', 'delete-button');
    button.type = 'button'; button.setAttribute('aria-label', `Excluir ${item.name}`);
    button.addEventListener('click', () => {
      if (!window.confirm(`Excluir o grupo “${item.name}” (${item.quantity} unidade(s))?`)) return;
      update({ ...state, equipment: removeEquipment(state.equipment, item.id) }, 'Equipamento excluído.');
      $('name').focus();
    });
    action.append(button); row.append(action); $('equipment-list').append(row);
    const share = item.consumption / summary.consumption * 100;
    const li = node('li');
    const label = node('div', undefined, 'bar-label');
    label.append(node('span', item.name), node('span', `${number.format(share)}% · ${number.format(item.consumption)} kWh`));
    const track = node('div', undefined, 'bar-track'); track.setAttribute('aria-hidden', 'true');
    const bar = node('div', undefined, 'bar-fill'); bar.style.width = `${share}%`;
    track.append(bar); li.append(label, track); $('distribution').append(li);
  }
}

function update(nextState, message) {
  // Valida inclusive os totais antes de modificar a sessão ou o armazenamento.
  summarize(nextState.equipment, nextState.tariff);
  state = nextState;
  let saved = true;
  try { storage.save(state); } catch (error) { saved = false; warn(error.message); }
  render();
  $('status').textContent = `${message} ${saved ? 'Dados salvos neste navegador.' : 'Alteração disponível apenas nesta sessão.'}`;
}

$('equipment-form').addEventListener('submit', event => {
  event.preventDefault(); showError('form-error');
  try {
    const item = { id: crypto.randomUUID(), name: $('name').value.trim(), powerWatts: Number($('power').value), dailyHours: Number($('hours').value), quantity: Number($('quantity').value) };
    update({ ...state, equipment: [...state.equipment, item] }, 'Equipamento adicionado.');
    $('equipment-form').reset(); $('name').focus();
  } catch (error) { showError('form-error', error.message); }
});
$('tariff-form').addEventListener('submit', event => {
  event.preventDefault(); showError('tariff-error');
  try { update({ ...state, tariff: Number($('tariff').value) }, 'Tarifa atualizada.'); }
  catch (error) { showError('tariff-error', error.message); }
});
$('reset-storage').addEventListener('click', () => {
  if (!window.confirm('Descartar permanentemente os dados inválidos deste navegador e começar com uma lista vazia?')) return;
  try {
    state = storage.reset(); warn('');
    $('equipment-fields').disabled = false; $('tariff-fields').disabled = false;
    $('reset-storage').hidden = true; render();
    $('status').textContent = 'Dados inválidos descartados após confirmação. Você pode começar novamente.';
  } catch (error) { warn(error.message); }
});
warn(loaded.warning);
$('equipment-fields').disabled = loaded.blocked;
$('tariff-fields').disabled = loaded.blocked;
$('reset-storage').hidden = !loaded.blocked;
render();

fetch(`${import.meta.env.BASE_URL}version.json`, { cache: 'no-store' })
  .then(response => { if (!response.ok) throw new Error('Versão indisponível'); return response.json(); })
  .then(version => { $('version').textContent = `v${version.version} · ${version.commit.slice(0, 7)}${version.dirty ? ' · alterações locais' : ''}`; })
  .catch(() => { $('version').textContent = 'Versão indisponível'; });

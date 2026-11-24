import { DEFAULT_TARIFF, summarize } from './energy.js';

export const STORAGE_KEY = 'ecowatt:v1';
export const emptyState = () => ({ schemaVersion: 1, equipment: [], tariff: DEFAULT_TARIFF });

export function validateState(state) {
  if (!state || state.schemaVersion !== 1 || !Array.isArray(state.equipment)) throw new Error('Formato de dados incompatível.');
  const ids = new Set();
  for (const item of state.equipment) {
    if (!item || typeof item.id !== 'string' || !item.id.trim() || item.id.length > 100 || ids.has(item.id)) {
      throw new Error('Identificadores de equipamentos inválidos ou duplicados.');
    }
    ids.add(item.id);
  }
  summarize(state.equipment, state.tariff);
  return state;
}

// O acesso ao objeto também pode lançar SecurityError; por isso ocorre dentro do try.
export function createStorage(getStorage = () => window.localStorage) {
  let protectedData = false;
  return {
    load() {
      let raw;
      try {
        raw = getStorage().getItem(STORAGE_KEY);
      } catch {
        protectedData = true;
        return { state: emptyState(), blocked: false, warning: 'Não foi possível acessar o armazenamento. Alterações ficarão apenas nesta sessão.' };
      }
      if (raw === null) return { state: emptyState(), blocked: false, warning: '' };
      try {
        const state = validateState(JSON.parse(raw));
        protectedData = false;
        return { state, blocked: false, warning: '' };
      } catch {
        protectedData = true;
        return { state: emptyState(), blocked: true, warning: 'Os dados salvos estão inválidos ou incompatíveis. Eles foram preservados. Para começar novamente, confirme o descarte abaixo.' };
      }
    },
    save(state) {
      validateState(state);
      if (protectedData) throw new Error('O armazenamento está protegido após uma falha de leitura. Os dados existentes não foram sobrescritos.');
      try { getStorage().setItem(STORAGE_KEY, JSON.stringify(state)); }
      catch { throw new Error('Não foi possível salvar. As alterações estão apenas nesta sessão; evite fechar a página.'); }
    },
    reset() {
      try { getStorage().removeItem(STORAGE_KEY); }
      catch { throw new Error('Não foi possível limpar o armazenamento. Verifique as permissões do navegador.'); }
      protectedData = false;
      return emptyState();
    }
  };
}

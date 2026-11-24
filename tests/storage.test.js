import { expect, it } from 'vitest';
import { createStorage, emptyState, STORAGE_KEY } from '../src/storage.js';

function memoryStorage(initial = null) {
  const data = new Map(initial === null ? [] : [[STORAGE_KEY, initial]]);
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
}
const state = { schemaVersion: 1, tariff: 1.2, equipment: [{ id: 'a', name: 'Computador', powerWatts: 500, dailyHours: 4, quantity: 1 }] };

it('T15 persiste e recupera equipamentos e tarifa', () => {
  const backing = memoryStorage();
  createStorage(() => backing).save(state);
  expect(createStorage(() => backing).load()).toEqual({ state, blocked: false, warning: '' });
});
it('T16 inicializa armazenamento ausente com lista vazia e tarifa ilustrativa', () => {
  expect(createStorage(() => memoryStorage()).load().state).toEqual(emptyState());
});
it('T17 preserva JSON inválido, vazio e estruturas incompatíveis até descarte explícito', () => {
  const invalidValues = ['', '{', 'null', '[]', '{}', JSON.stringify({ ...state, schemaVersion: 2 }), JSON.stringify({ ...state, equipment: [state.equipment[0], state.equipment[0]] }), JSON.stringify({ ...state, tariff: -1 })];
  for (const raw of invalidValues) {
    const backing = memoryStorage(raw);
    const storage = createStorage(() => backing);
    expect(storage.load().blocked).toBe(true);
    expect(() => storage.save(state)).toThrow();
    expect(backing.getItem(STORAGE_KEY)).toBe(raw);
    expect(storage.reset()).toEqual(emptyState());
    storage.save(state);
    expect(storage.load().state).toEqual(state);
  }
});
it('T18 comunica falhas de acesso e escrita sem fingir persistência', () => {
  const denied = createStorage(() => { throw new Error('SecurityError'); });
  expect(denied.load().warning).toContain('apenas nesta sessão');
  expect(() => denied.save(state)).toThrow();
  expect(() => denied.reset()).toThrow();
  const quota = createStorage(() => ({ getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); } }));
  quota.load();
  expect(() => quota.save(state)).toThrow('apenas nesta sessão');
});
it('T19 impede gravação de equipamento inválido', () => {
  const backing = memoryStorage();
  const storage = createStorage(() => backing);
  expect(() => storage.save({ ...state, equipment: [{ ...state.equipment[0], dailyHours: 25 }] })).toThrow();
  expect(backing.getItem(STORAGE_KEY)).toBeNull();
});

import { describe, expect, it } from 'vitest';
import { monthlyConsumption, monthlyCost, summarize, validateEquipment, validateTariff, removeEquipment } from '../src/energy.js';

const a = { id: 'a', name: 'Aquecedor', powerWatts: 1500, dailyHours: 4, quantity: 1 };
const b = { id: 'b', name: 'Lâmpadas', powerWatts: 100, dailyHours: 5, quantity: 3 };

describe('Regras energéticas', () => {
  it('T01 calcula 180 kWh mensais no cenário A', () => expect(monthlyConsumption(a)).toBe(180));
  it('T02 converte 1000 W em 1 kW e aceita horas fracionárias', () => {
    expect(monthlyConsumption({ ...a, powerWatts: 1000, dailyHours: 0.5 })).toBe(15);
  });
  it('T03 calcula R$ 162,00 no cenário A', () => expect(monthlyCost(monthlyConsumption(a), 0.9)).toBe(162));
  it('T04 considera três equipamentos iguais no cenário B', () => {
    expect(monthlyConsumption(b)).toBe(45);
    expect(monthlyCost(monthlyConsumption(b), 0.9)).toBe(40.5);
  });
  it('T05 soma consumo, custos e quantidades no cenário C', () => {
    expect(summarize([a, b], 0.9)).toMatchObject({ consumption: 225, cost: 202.5, quantity: 4 });
  });
  it('T06 identifica o maior consumidor e trata lista vazia', () => {
    expect(summarize([b, a], 0.9).largest.id).toBe('a');
    expect(summarize([], 0.9)).toMatchObject({ largest: null, consumption: 0, cost: 0, quantity: 0 });
  });
  it('T07 rejeita nomes vazios ou longos', () => {
    for (const name of ['', '   ', 'x'.repeat(101), null]) expect(() => validateEquipment({ ...a, name })).toThrow();
  });
  it('T08 rejeita potência não positiva, ausente ou não finita', () => {
    for (const powerWatts of [0, -1, NaN, Infinity, '', undefined]) expect(() => monthlyConsumption({ ...a, powerWatts })).toThrow();
  });
  it('T09 valida o intervalo de horas (0, 24]', () => {
    for (const dailyHours of [0, -1, 24.1, Infinity, NaN]) expect(() => monthlyConsumption({ ...a, dailyHours })).toThrow();
    expect(monthlyConsumption({ ...a, dailyHours: 24 })).toBe(1080);
  });
  it('T10 rejeita quantidade fracionária, não positiva ou insegura', () => {
    for (const quantity of [0, -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) expect(() => monthlyConsumption({ ...a, quantity })).toThrow();
  });
  it('T11 rejeita tarifa inválida', () => {
    for (const tariff of [0, -1, NaN, Infinity, '', null]) expect(() => validateTariff(tariff)).toThrow();
  });
  it('T12 atualiza totais após excluir um grupo sem alterar a lista original', () => {
    const equipment = [a, b];
    expect(summarize(removeEquipment(equipment, 'a'), 0.9)).toMatchObject({ consumption: 45, cost: 40.5, quantity: 3 });
    expect(equipment).toHaveLength(2);
  });
  it('T13 recalcula custos ao alterar tarifa sem modificar o consumo', () => {
    expect(summarize([a, b], 1.2)).toMatchObject({ consumption: 225, cost: 270 });
  });
  it('T14 rejeita overflow e underflow sem arredondar valores intermediários', () => {
    expect(() => monthlyConsumption({ ...a, powerWatts: Number.MAX_VALUE, quantity: 1000 })).toThrow();
    expect(() => monthlyConsumption({ ...a, powerWatts: Number.MIN_VALUE })).toThrow();
    expect(() => monthlyCost(180, Number.MAX_VALUE)).toThrow();
    expect(() => summarize([{ ...a, quantity: Number.MAX_SAFE_INTEGER }, b], 0.9)).toThrow();
    const small = { ...a, powerWatts: 1, dailyHours: 0.1 };
    expect(summarize([small, small], 0.9).cost).toBeCloseTo(0.0054, 12);
  });
});

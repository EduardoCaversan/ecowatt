export const DEFAULT_TARIFF = 0.9;

function positiveNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} deve ser um número finito maior que zero.`);
  }
}

export function validateTariff(tariff) {
  positiveNumber(tariff, 'A tarifa');
  return tariff;
}

export function validateEquipment(equipment) {
  if (!equipment || typeof equipment.name !== 'string' || !equipment.name.trim()) {
    throw new Error('Informe o nome do equipamento.');
  }
  if (equipment.name.trim().length > 100) throw new Error('O nome deve ter até 100 caracteres.');
  positiveNumber(equipment.powerWatts, 'A potência');
  positiveNumber(equipment.dailyHours, 'O tempo de utilização');
  if (equipment.dailyHours > 24) throw new Error('O tempo de utilização deve ser de até 24 horas por dia.');
  if (!Number.isSafeInteger(equipment.quantity) || equipment.quantity <= 0) {
    throw new Error('A quantidade deve ser um número inteiro positivo seguro.');
  }
  return equipment;
}

export function monthlyConsumption(equipment) {
  const { powerWatts, dailyHours, quantity } = validateEquipment(equipment);
  const consumption = (powerWatts / 1000) * dailyHours * quantity * 31;
  if (!Number.isFinite(consumption) || consumption <= 0) {
    throw new Error('Os valores informados produzem um consumo fora do intervalo suportado.');
  }
  return consumption;
}

export function monthlyCost(consumption, tariff) {
  validateTariff(tariff);
  if (!Number.isFinite(consumption) || consumption < 0) throw new Error('Consumo inválido.');
  const cost = consumption * tariff;
  if (!Number.isFinite(cost) || (consumption > 0 && cost <= 0)) {
    throw new Error('Os valores informados produzem um custo fora do intervalo suportado.');
  }
  return cost;
}

export function summarize(equipment, tariff) {
  validateTariff(tariff);
  const items = equipment.map(item => {
    const consumption = monthlyConsumption(item);
    return { ...item, consumption, cost: monthlyCost(consumption, tariff) };
  });
  const consumption = items.reduce((total, item) => total + item.consumption, 0);
  const cost = items.reduce((total, item) => total + item.cost, 0);
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  if (!Number.isFinite(consumption) || !Number.isFinite(cost) || !Number.isSafeInteger(quantity)) {
    throw new Error('O total dos equipamentos excede o intervalo suportado.');
  }
  const largest = items.reduce((max, item) => !max || item.consumption > max.consumption ? item : max, null);
  return { items, consumption, cost, quantity, largest };
}

export function removeEquipment(equipment, id) {
  return equipment.filter(item => item.id !== id);
}

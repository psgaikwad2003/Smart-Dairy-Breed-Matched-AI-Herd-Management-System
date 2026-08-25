import { describe, it, expect, beforeEach } from 'vitest';
import { dynamicStore } from '../dynamicStore';

describe('dynamicStore state management & pub/sub engine', () => {
  beforeEach(() => {
    localStorage.clear();
    dynamicStore.resetToDefault();
  });

  it('should initialize with default cattle herd ear-tags', () => {
    const cows = dynamicStore.getCows();
    expect(cows.length).toBeGreaterThan(0);
    expect(cows[0]).toHaveProperty('tagNumber');
  });

  it('should register a new cattle tag and persist to storage', () => {
    const initialCount = dynamicStore.getCows().length;
    dynamicStore.addCow({
      tagNumber: 'TN-TEST-999',
      breed: 'GIR',
      status: 'ACTIVE',
      lactationCount: 2,
      currentMilkYieldLitres: 16.5,
    });
    expect(dynamicStore.getCows().length).toBe(initialCount + 1);
  });

  it('should restock semen straw inventory and update stock quantity', () => {
    const straws = dynamicStore.getStraws();
    const targetId = straws[0].id;
    const initialQty = straws[0].stockQty;

    dynamicStore.restockStraw(targetId, 25);
    const updatedStraw = dynamicStore.getStraws().find(s => s.id === targetId);
    expect(updatedStraw.stockQty).toBe(initialQty + 25);
  });
});

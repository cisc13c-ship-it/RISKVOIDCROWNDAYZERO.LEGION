import { mulberry32, unit } from "./rng";

export type DiceResult = {
  attackDice: number[];
  defendDice: number[];
  attackLoss: number;
  defendLoss: number;
  rng: number;
};

function rollN(n: number, rng: number): { values: number[]; rng: number } {
  const values: number[] = [];
  let r = rng;
  for (let i = 0; i < n; i++) {
    r = mulberry32(r);
    values.push(1 + Math.floor(unit(r) * 6));
  }
  values.sort((a, b) => b - a);
  return { values, rng: r };
}

export function attackDiceCount(armies: number): number {
  return Math.max(1, Math.min(3, armies - 1));
}

export function defendDiceCount(armies: number): number {
  return Math.max(1, Math.min(2, armies));
}

export function resolveDice(attackArmies: number, defendArmies: number, rng: number): DiceResult {
  const aN = attackDiceCount(attackArmies);
  const dN = defendDiceCount(defendArmies);
  const a = rollN(aN, rng);
  const d = rollN(dN, a.rng);
  let attackLoss = 0;
  let defendLoss = 0;
  const cmp = Math.min(a.values.length, d.values.length);
  for (let i = 0; i < cmp; i++) {
    if (a.values[i] > d.values[i]) defendLoss += 1;
    else attackLoss += 1;
  }
  return {
    attackDice: a.values,
    defendDice: d.values,
    attackLoss,
    defendLoss,
    rng: d.rng,
  };
}

export const SET_BONUS = [4, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50];

export const fractionToPercent = (val: number) => numToUnit(val, '%');

export const numToUnit = (val: number, unit: "px" | "%" | "deg") => {
  if (unit === "%") {
    val *= 100;
  }
  return val + unit;
};

export const numIsUndefined = <T>(val?: number) =>
  val === undefined ? false : true;

export const getDecimalPortion = (val: number) => val % 1;

export const numIsEven = (num: number) => num % 2 === 0;

export const isOnClient = () => typeof window !== 'undefined';

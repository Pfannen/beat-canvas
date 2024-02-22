export const fractionToPercent = (val: number) => numToUnit(val, "%");

export const numToUnit = (val: number, unit: "px" | "%") => {
  if (unit === "%") {
    val *= 100;
  }
  return val + unit;
};

export const numIsUndefined = <T>(val?: number) =>
  val === undefined ? false : true;

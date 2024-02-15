export const numToPercent = (val: number) => val * 100 + "%";

export const numIsUndefined = <T>(val?: number) =>
  val === undefined ? false : true;

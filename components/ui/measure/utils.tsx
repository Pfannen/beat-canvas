import { ReactElement } from "react";

export type LedgerComponentRenderer = (
  yPos: number,
  isLine: boolean
) => ReactElement;

export const generateMeasureComponents = (
  belowBody: number,
  aboveBody: number,
  startWithLine: boolean,
  getComponent: LedgerComponentRenderer,
  bodyCt = 9
) => {
  const above = new Array(aboveBody);
  const body = new Array(bodyCt);
  const below = new Array(belowBody);
  const totalComponents = 9 + belowBody + aboveBody;

  for (let y = totalComponents - 1; y > -1; y--) {
    let isLine = y % 2 != 0;
    if (startWithLine) isLine = !isLine;
    if (y < belowBody) {
      below.push(getComponent(y, isLine));
    } else if (y < belowBody + bodyCt) {
      body.push(getComponent(y, isLine));
    } else {
      above.push(getComponent(y, isLine));
    }
  }
  return [above, body, below];
};

import { ReactElement } from "react";

export type LedgerComponentRenderer = (
  yPos: number,
  isLine: boolean,
  heightPercentage: string,
  isBodyComponent: boolean
) => ReactElement;

export const generateMeasureComponents = (
  belowBody: number,
  aboveBody: number,
  lineHeight: string,
  spaceHeight: string,
  startWithLine: boolean,
  getComponent: LedgerComponentRenderer,
  bodyCt = 7
) => {
  const above = new Array(aboveBody);
  const body = new Array(bodyCt);
  const below = new Array(belowBody);
  const totalComponents = bodyCt + belowBody + aboveBody;

  for (let y = totalComponents - 1; y > -1; y--) {
    let isLine = y % 2 != 0;

    if (startWithLine) isLine = !isLine;
    const height = isLine ? lineHeight : spaceHeight;
    if (y < belowBody) {
      below.push(getComponent(y, isLine, height, false));
    } else if (y < belowBody + bodyCt) {
      body.push(getComponent(y, isLine, height, true));
    } else {
      above.push(getComponent(y, isLine, height, false));
    }
  }
  return [above, body, below];
};

import { ReactElement } from "react";

export const generateMeasureComponents = (
  belowBody: number,
  aboveBody: number,
  getComponent: (yPos: number) => ReactElement
) => {
  const above = new Array(aboveBody);
  const body = new Array(9);
  const below = new Array(belowBody);
  const totalComponents = 9 + belowBody + aboveBody;
  for (let i = totalComponents - 1; i > -1; i--) {
    if (i < belowBody) {
      below.push(getComponent(i));
    } else if (i < belowBody + 9) {
      body.push(getComponent(i));
    } else {
      above.push(getComponent(i));
    }
  }
  return [above, body, below];
};

import { MeasureComponentValues } from "@/types/music-rendering";
import { numIsEven } from "@/utils";

export class MeasureComponents {
  private aboveBelowCount: number;
  private bodyCt: number;
  private bodyStartPosition: number;
  constructor(
    aboveBelowCount: number,
    bodyCt: number,
    bodyStartPosition: number
  ) {
    this.aboveBelowCount = aboveBelowCount;
    this.bodyCt = bodyCt;
    this.bodyStartPosition = bodyStartPosition;
  }

  //If startsWithLine is true this returns the number of lines
  private static getFirstComponentCount(componentsAboveBottom: number) {
    return Math.floor(componentsAboveBottom / 2) + 1;
  }

  //If startsWithLine is false this returns the number of lines
  private static getSecondComponentCount(componentsAboveBottom: number) {
    return Math.floor((componentsAboveBottom + 1) / 2);
  }

  private bottomComponentIsLine() {
    const bodyStartIsEven = numIsEven(this.bodyStartPosition);
    const bottomIsEven = numIsEven(this.aboveBelowCount);
    return bodyStartIsEven === bottomIsEven;
  }

  public getComponentCountsBelowPosition(
    position: number
  ): MeasureComponentValues {
    const startsWithLine = this.bottomComponentIsLine();
    let lineCount = MeasureComponents.getFirstComponentCount(position);
    let spaceCount = MeasureComponents.getSecondComponentCount(position) - 1;
    if (!startsWithLine) {
      const temp = lineCount;
      lineCount = spaceCount;
      spaceCount = temp;
    }
    return { line: lineCount, space: spaceCount };
  }

  public getMeasureComponentCounts(): MeasureComponentValues {
    const componentCount = this.aboveBelowCount * 2 + this.bodyCt;
    return this.getComponentCountsBelowPosition(componentCount);
  }

  public componentsBelowPosition(position: number) {
    return this.aboveBelowCount - this.bodyStartPosition + position;
  }

  public positionIsOnLine(position: number) {
    const bodyStartIsEven = numIsEven(this.bodyStartPosition);
    const positionIsEven = numIsEven(position - this.bodyStartPosition);
    return bodyStartIsEven === positionIsEven;
  }
}

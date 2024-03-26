import { MeasureComponentValues } from "@/types/music-rendering";
import { numIsEven } from "@/utils";

export class MeasureComponents {
  private aboveBelowCount: number;
  private bodyCt: number;
  constructor(aboveBelowCount: number, bodyCt: number) {
    this.aboveBelowCount = aboveBelowCount;
    this.bodyCt = bodyCt;
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
    return numIsEven(this.aboveBelowCount);
  }

  public getComponentCountsBelowYPos(yPos: number): MeasureComponentValues {
    const absolutePosition = yPos + this.aboveBelowCount;
    const startsWithLine = this.bottomComponentIsLine();
    let lineCount =
      MeasureComponents.getFirstComponentCount(absolutePosition) - 1;
    let spaceCount =
      MeasureComponents.getSecondComponentCount(absolutePosition);
    if (!startsWithLine) {
      const temp = lineCount;
      lineCount = spaceCount;
      spaceCount = temp;
    }
    return { line: lineCount, space: spaceCount };
  }

  public getMeasureComponentCounts(): MeasureComponentValues {
    return this.getComponentCountsBelowYPos(this.aboveBelowCount + this.bodyCt);
  }

  public componentsBelowYPos(yPos: number) {
    return this.aboveBelowCount + yPos;
  }

  public yPosIsOnLine(yPos: number) {
    return numIsEven(yPos);
  }
}

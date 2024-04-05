import { MeasureComponentValues } from "@/types/music-rendering";
import { MeasureComponents } from "./measure-components";

export class Measurements {
  private measureComponents: MeasureComponents;
  private componentFractionHeights: MeasureComponentValues;
  constructor(
    aboveBelowCount: number,
    bodyCt: number,
    lineToSpaceRatio: number
  ) {
    this.measureComponents = new MeasureComponents(aboveBelowCount, bodyCt);
    this.componentFractionHeights =
      this.getLedgerComponentFractions(lineToSpaceRatio);
  }

  private getLedgerComponentFractions(
    lineToSpaceRatio: number
  ): MeasureComponentValues {
    const { line: lineCount, space: spaceCount } =
      this.measureComponents.getMeasureComponentCounts();
    const componentCount = lineCount + spaceCount;
    const linePercentage = lineCount / componentCount; //The percentage of the container that ALL of the lines get
    const spacePercentage = 1 - linePercentage; //The percentage of the container that ALL of the spaces get

    const lineFraction =
      (1 / lineCount) *
      linePercentage *
      (1 - (lineToSpaceRatio / 2) * spacePercentage); //Apply half the ratio to downsize the line
    const spaceFraction =
      (1 / spaceCount) *
      spacePercentage *
      (1 + (lineToSpaceRatio / 2) * linePercentage); //Apply half the ratio to upsize the space
    return { line: lineFraction, space: spaceFraction };
  }

  public getYFractionOffset(yPos: number) {
    //We shall assume yPos: 0 is the first line of the body (if yPos is negative the position is below the body)
    let { line: lineCount, space: spaceCount } =
      this.measureComponents.getComponentCountsBelowYPos(yPos);
    console.log(yPos, lineCount, spaceCount);
    const isOnLine = this.measureComponents.yPosIsOnLine(yPos);
    isOnLine ? (lineCount -= 0.5) : (spaceCount -= 0.5);
    const { line: lineFraction, space: spaceFraction } =
      this.componentFractionHeights;
    return spaceCount * spaceFraction + lineCount * lineFraction;
  }

  public static getXFractionOffset(
    xPos: number,
    noteLength: number,
    beatsPerMeasure: number
  ) {
    const centerOfLength = noteLength / 2;
    return (xPos + centerOfLength) / beatsPerMeasure;
  }

  public getComponentFractions() {
    return this.componentFractionHeights;
  }

  //   public getYAbsolutePosition(yPos: number, measureHeight: number){
  //     const fractionOffset = this.getYFractionOffset(yPos);
  //     return fractionOffset
  //   }
}

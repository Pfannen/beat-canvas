import { numIsEven } from "@/utils";

export type NotePositionNote = { x: number; y: number; length: number };

export type Offset = { x: number; y: number };

export default class MeasurePositions {
  private bodyCt: number;
  heights: ComponentFractions;
  private segmentLength: number;
  private measureHeight: number;
  private aboveBelowCount: number;
  constructor(
    aboveBelowCount: number,
    bodyCt: number,
    wholeSegmentLength: number,
    measureHeight: number,
    lineToSpaceRatio = 3
  ) {
    this.bodyCt = bodyCt;
    const componentCount = aboveBelowCount * 2 + this.bodyCt;
    this.heights = MeasureUtils.getLedgerComponentFractions(
      componentCount,
      this.bodyCt,
      lineToSpaceRatio
    );
    this.aboveBelowCount = aboveBelowCount;
    this.measureHeight = measureHeight;
    this.segmentLength = wholeSegmentLength; //Will be .25 if 4/4 time (1/4)
    // this.startsWithLine = startWithLine;
    this.getYOffset = this.getYOffset.bind(this); //Since this method is passed as a delegate, "this" becomes undefined.
  }

  public getComponentFractions() {
    return this.heights;
  }

  private isOnLine(yPos: number) {
    return Math.floor(yPos) % 2 === 0;
  }

  //Returns the value that is in the center of the component (line or space) that yPos represents
  public getYOffset(yPos: number) {
    //We shall assume yPos: 0 is the first line of the body (if yPos is negative the position is below the body)
    const aboveBottomCount = yPos + this.aboveBelowCount;
    let { spaceCount, lineCount } = MeasureUtils.getComponentCountsBelow(
      aboveBottomCount,
      this.aboveBelowCount
    );
    this.isOnLine(yPos) ? (lineCount -= 0.5) : (spaceCount -= 0.5);
    const spaceHeight = this.heights.space * this.measureHeight;
    const lineHeight = this.heights.line * this.measureHeight;
    return spaceCount * spaceHeight + lineCount * lineHeight;
  }

  public getXOffset(xPos: number, length: number = 0) {
    const centerOfLength = length / 2;
    return (xPos + centerOfLength) * this.segmentLength;
  }

  public getNoteOffsets(notes: NotePositionNote[]): Offset[] {
    return notes.map((note) => {
      return this.getNoteOffset(note);
    });
  }

  public getNoteOffset(note: NotePositionNote): Offset {
    return {
      x: this.getXOffset(note.x, note.length),
      y: this.getYOffset(note.y),
    };
  }
}

export type ComponentFractions = { line: number; space: number };

export class MeasureUtils {
  //If startsWithLine is true this returns the number of lines
  private static getFirstComponentCount(componentsAboveBottom: number) {
    return Math.floor(componentsAboveBottom / 2) + 1;
  }

  //If startsWithLine is false this returns the number of lines
  private static getSecondComponentCount(componentsAboveBottom: number) {
    return Math.floor((componentsAboveBottom + 1) / 2);
  }
  /// Non-inclusive
  static getComponentCountsBelow(
    aboveBottomCount: number,
    aboveBelowCount: number,
    bodyStartPosition?: number
  ) {
    if (bodyStartPosition === undefined) bodyStartPosition = aboveBelowCount;
    const startsWithLine = this.bottomComponentIsLine(
      aboveBelowCount,
      bodyStartPosition
    );
    let lineCount = this.getFirstComponentCount(aboveBottomCount);
    let spaceCount = this.getSecondComponentCount(aboveBottomCount);
    if (startsWithLine) {
      const temp = lineCount;
      lineCount = spaceCount;
      spaceCount = temp;
    }
    return { lineCount, spaceCount };
  }

  static getMeasureComponentCounts(
    aboveBelowCount: number,
    bodyCt: number,
    bodyStartPosition?: number
  ) {
    if (bodyStartPosition === undefined) bodyStartPosition = aboveBelowCount;
    const componentCount = aboveBelowCount * 2 + bodyCt;
    const firstComponentIsLine = this.bottomComponentIsLine(aboveBelowCount, 0);
    const counts = this.getComponentCountsBelow(
      componentCount - 1,
      aboveBelowCount,
      bodyStartPosition
    );
    return { ...counts, firstComponentIsLine };
  }

  private static bottomComponentIsLine(
    aboveBelowCount: number,
    bodyStartPosition: number
  ) {
    const bodyStartIsEven = numIsEven(bodyStartPosition);
    const bottomIsEven = numIsEven(aboveBelowCount);
    return bodyStartIsEven === bottomIsEven;
  }

  static getLedgerComponentFractions(
    componentCount: number,
    bodyCt: number,
    lineToSpaceRatio: number
  ): ComponentFractions {
    const { lineCount, spaceCount } = MeasureUtils.getMeasureComponentCounts(
      componentCount - bodyCt,
      bodyCt
    );

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
}

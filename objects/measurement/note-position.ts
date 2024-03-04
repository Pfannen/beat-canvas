export type NotePositionNote = { x: number; y: number; length: number };

export type Offset = { x: number; y: number };

export default class MeasurePositions {
  heights: ComponentFractions;
  segmentLength: number;
  startsWithLine: boolean;
  measureHeight: number;
  componentsBelowBody: number;
  constructor(
    componentCount: number,
    componentsBelowBody: number,
    wholeSegmentLength: number,
    measureHeight: number,
    startWithLine = false,
    lineToSpaceRatio = 3
  ) {
    this.heights = MeasureUtils.getLedgerComponentFractions(
      componentCount,
      lineToSpaceRatio,
      startWithLine
    );
    this.componentsBelowBody = componentsBelowBody;
    this.measureHeight = measureHeight;
    this.segmentLength = wholeSegmentLength; //Will be .25 if 4/4 time (1/4)
    this.startsWithLine = startWithLine;
    this.getYOffset = this.getYOffset.bind(this); //Since this method is passed as a delegate, "this" becomes undefined.
  }

  private isOnLine(yPos: number) {
    return Math.floor(yPos) % 2 === 0;
  }

  //Returns the value that is in the center of the component (line or space) that yPos represents
  public getYOffset(yPos: number) {
    //We shall assume yPos: 0 is the first line of the body (if yPos is negative the position is below the body)
    const componentsAboveBottom = yPos + this.componentsBelowBody;
    let spaceCount = MeasureUtils.getSpaceCount(
      componentsAboveBottom,
      this.startsWithLine
    );
    let lineCount = MeasureUtils.getLineCount(
      componentsAboveBottom,
      this.startsWithLine
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

  static getSpaceCount(componentsAboveBottom: number, startsWithLine: boolean) {
    return startsWithLine
      ? this.getSecondComponentCount(componentsAboveBottom)
      : this.getFirstComponentCount(componentsAboveBottom);
  }

  static getLineCount(componentsAboveBottom: number, startsWithLine: boolean) {
    return startsWithLine
      ? this.getFirstComponentCount(componentsAboveBottom)
      : this.getSecondComponentCount(componentsAboveBottom);
  }

  static getLedgerComponentFractions(
    componentCount: number,
    lineToSpaceRatio: number,
    startWithLine: boolean
  ): ComponentFractions {
    const lineCount = MeasureUtils.getLineCount(
      componentCount - 1,
      startWithLine
    );
    const spaceCount = MeasureUtils.getSpaceCount(
      componentCount - 1,
      startWithLine
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

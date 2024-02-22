export type NotePositionNote = { x: number; y: number; length: number };

export type Offset = { x: number; y: number };

export default class NotePosition {
  heights: ComponentFractions;
  segmentLength: number;
  startsWithLine: boolean;
  measureHeight: number;
  constructor(
    componentCount: number,
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
    console.log(this.heights);
    this.measureHeight = measureHeight;
    this.segmentLength = wholeSegmentLength; //Will be 25 if 4/4 time (1/4 * 100)
    this.startsWithLine = startWithLine;
  }

  private isOnLine(yPos: number) {
    return this.startsWithLine ? yPos % 2 === 0 : yPos % 2 !== 0;
  }

  //Returns the value that is in the center of the component (line or space) that yPos represents
  private getYOffset(yPos: number) {
    let spaceCount = MeasureUtils.getSpaceCount(yPos, this.startsWithLine);
    let lineCount = MeasureUtils.getLineCount(yPos, this.startsWithLine);
    this.isOnLine(yPos) ? (lineCount -= 0.5) : (spaceCount -= 0.5);
    const spaceHeight = this.heights.space * this.measureHeight;
    const lineHeight = this.heights.line * this.measureHeight;
    return spaceCount * spaceHeight + lineCount * lineHeight;
  }

  private getXOffset(xPos: number, length: number) {
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
  private static getFirstComponentCount(yPos: number) {
    return Math.floor(yPos / 2) + 1;
  }

  //If startsWithLine is false this returns the number of lines
  private static getSecondComponentCount(yPos: number) {
    return Math.floor((yPos + 1) / 2);
  }

  static getSpaceCount(yPos: number, startsWithLine: boolean) {
    return startsWithLine
      ? this.getSecondComponentCount(yPos)
      : this.getFirstComponentCount(yPos);
  }

  static getLineCount(yPos: number, startsWithLine: boolean) {
    return startsWithLine
      ? this.getFirstComponentCount(yPos)
      : this.getSecondComponentCount(yPos);
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

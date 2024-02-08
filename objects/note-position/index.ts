type UnitMeasurement = "px" | "%";

type Note = { x: number; y: number; length: number };

export type Offset = { x: string; y: string };

export default class NotePosition {
  lineHeight: number;
  spaceHeight: number;
  segmentLength: number;
  unit: UnitMeasurement;
  startsWithLine: boolean;
  constructor(
    lineHeight: number,
    spaceHeight: number,
    segmentLength: number,
    unit: UnitMeasurement,
    startWithLine = false
  ) {
    this.lineHeight = lineHeight;
    this.spaceHeight = spaceHeight;
    this.segmentLength = segmentLength; //Will be 25 if 4/4 time (1/4 * 100) w/ % units
    this.unit = unit;
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
    const units = spaceCount * this.spaceHeight + lineCount * this.lineHeight;
    return units + this.unit;
  }

  private getXOffset(xPos: number, length: number) {
    const centerOfLength = length / 2;
    const center = (xPos + centerOfLength) * this.segmentLength;
    return center + this.unit;
  }

  public getNoteOffsets(notes: Note[]): Offset[] {
    return notes.map((note) => {
      return {
        x: this.getXOffset(note.x, note.length),
        y: this.getYOffset(note.y),
      };
    });
  }
}

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
}

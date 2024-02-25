import { MeasureUnitConverter } from "../measure-unit-converter";
import MeasurePositions, {
  MeasureUtils,
  NotePositionNote,
} from "../note-position";

export default class Measurement {
  private bodyCt = 9;
  private aboveBelowCount: number;
  private notePosition: MeasurePositions;
  private startsWithLine: boolean;
  private lineCount: number;
  private spaceCount: number;
  private unitConverter: MeasureUnitConverter;
  constructor(
    aboveBelowCount: number,
    wholeSegmentLength: number,
    measureHeight: number,
    lineToSpaceRatio?: number
  ) {
    this.aboveBelowCount = aboveBelowCount;
    this.startsWithLine = aboveBelowCount % 2 === 0;
    const componentCount = aboveBelowCount * 2 + this.bodyCt;
    this.lineCount = MeasureUtils.getLineCount(
      this.aboveBelowCount * 2 + this.bodyCt - 1,
      this.startsWithLine
    );
    this.spaceCount = MeasureUtils.getSpaceCount(
      this.aboveBelowCount * 2 + this.bodyCt - 1,
      this.startsWithLine
    );
    this.notePosition = new MeasurePositions(
      componentCount,
      aboveBelowCount,
      wholeSegmentLength,
      measureHeight,
      this.startsWithLine,
      lineToSpaceRatio
    );
    this.unitConverter = new MeasureUnitConverter({
      widthHeightRatio: 0.75,
      segmentFraction: wholeSegmentLength,
      height: measureHeight,
      getYOffset: this.notePosition.getYOffset,
      componentFractions: this.notePosition.heights,
    });
  }

  public getLineCount() {
    return this.lineCount;
  }

  public getSpaceCount() {
    return this.spaceCount;
  }

  public getAboveBelowLines() {
    return MeasureUtils.getLineCount(
      this.aboveBelowCount - 1,
      this.startsWithLine
    );
  }

  public getAboveBelowSpaces() {
    return MeasureUtils.getSpaceCount(
      this.aboveBelowCount - 1,
      this.startsWithLine
    );
  }

  public isBodyPosition(yPos: number) {
    return yPos < this.aboveBelowCount + this.bodyCt || yPos >= 0;
  }

  public getLineFraction() {
    return this.notePosition.heights.line;
  }

  public getSpaceFraction() {
    return this.notePosition.heights.space;
  }

  public getComponentFractions() {
    return this.notePosition.heights;
  }

  public getNoteOffset(note: NotePositionNote) {
    return this.notePosition.getNoteOffset(note);
  }

  public getNoteOffsets(notes: NotePositionNote[]) {
    return this.notePosition.getNoteOffsets(notes);
  }

  public getMiddleYPos() {
    return Math.floor(this.bodyCt / 2);
  }
}

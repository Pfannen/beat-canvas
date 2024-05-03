import { BODY_CT } from "@/constants/music-dimensions";
import { MeasureUnitConverter } from "./measure-unit-converter";
import MeasurePositions, {
  MeasureUtils,
  NotePositionNote,
} from "./note-position";

export default class Measurement {
  private aboveBelowCount: number;
  private notePosition: MeasurePositions;
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
    const { lineCount, spaceCount } = MeasureUtils.getMeasureComponentCounts(
      this.aboveBelowCount,
      BODY_CT
    );
    this.lineCount = lineCount;
    this.spaceCount = spaceCount;
    this.notePosition = new MeasurePositions(
      aboveBelowCount,
      BODY_CT,
      wholeSegmentLength,
      measureHeight,
      lineToSpaceRatio
    );
    this.unitConverter = new MeasureUnitConverter({
      widthHeightRatio: 4 / 3,
      segmentFraction: wholeSegmentLength,
      height: measureHeight,
      getYOffset: this.notePosition.getYOffset,
      componentFractions: this.notePosition.heights,
    });
  }

  public getComponentCounts() {
    return { lineCount: this.lineCount, spaceCount: this.spaceCount };
  }

  public getAboveBelowCounts() {
    return MeasureUtils.getComponentCountsBelow(
      this.aboveBelowCount,
      this.aboveBelowCount
    );
  }

  public isBodyPosition(yPos: number) {
    return yPos < this.aboveBelowCount + BODY_CT || yPos >= 0;
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
    return Math.floor(BODY_CT / 2);
  }

  public getUnitConverter() {
    return this.unitConverter;
  }

  public getNoteDirection(yPos: number) {
    return yPos < this.getMiddleYPos() ? "up" : "down";
  }
}

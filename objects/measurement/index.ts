import { MeasureUnitConverter } from "./measure-unit-converter";
import { NoteBeamCalculator } from "./note-beam-calculator";
import MeasurePositions, {
  MeasureUtils,
  NotePositionNote,
} from "./note-position";
import { NoteDirection } from "@/lib/notes/types";
import { BODY_CT } from "./constants";
import { NoteType } from "@/components/providers/music/types";

export type BeamableNoteData = {
  x: number;
  y: number;
  duration: number;
  type: NoteType;
  stemOffset?: number;
}; //stemOffset is in measureUnits

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

  public getNoteBeamData(
    notes: BeamableNoteData[],
    direction: NoteDirection,
    notesAreCentered = true
  ) {
    const coordinates = notes.map(({ x, y, duration, stemOffset }) => {
      const center = notesAreCentered ? duration / 2 : 0;
      const xPos = this.unitConverter.convert(
        "xPos",
        "measureUnit",
        x + center
      );
      const yPos = this.unitConverter.convert("yPos", "measureUnit", y);
      return { x: xPos, y: yPos + (stemOffset || 0) };
    });
    const data = NoteBeamCalculator.getPositionData(coordinates, direction, 25);
    data.beamLength = this.unitConverter.convert(
      "measureUnit",
      "measureSpace",
      data.beamLength
    );
    data.noteOffsets = data.noteOffsets.map((offset) => {
      return this.unitConverter.convert("measureUnit", "measureSpace", offset);
    });
    return data;
  }
}

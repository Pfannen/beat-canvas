import { NoteType, TimeSignature } from "@/components/providers/music/types";
import { Coordinate } from "@/objects/measurement/types";
import { MeasureAttributes } from "@/types/music";
import { BlockDirection } from "../../pdf";
import { NoteDirection } from "@/lib/notes/types";
import { MeasureComponent, MeasureComponentIterator } from "../..";
import { NoteDisplayData } from "@/types/music/draw-data";
import { NoteAnnotation } from "@/types/music/note-annotations";

export type StemOptions = {
  bodyWidth: number;
  bodyCenter: Coordinate;
  stemWidth: number;
  stemHeight: number;
  direction: NoteDirection;
};

export type BeamFlagOptions = {
  corner: Coordinate;
  angle: number;
  height: number;
  width: number;
};

export type MeasureLinesOptions = Pick<
  MeasureOptions,
  | "topLeft"
  | "lineHeight"
  | "spaceHeight"
  | "width"
  // | "spaceCount"
  // | "lineCount"
  // | "topComponentIsLine"
  // | "bodyEndPos"
  // | "bodyStartPos"
  | "measureIndex"
> & { componentIterator: MeasureComponentIterator };

export type BeatCanvasNoteDrawOptions = {
  noteBodyAspectRatio: number;
  noteBodyAngle: number;
  stemHeightBodyFraction: number;
  stemWidthBodyFraction: number;
  flagHeightBodyFraction: number;
  annotationDistanceBodyFraction: number;
  dotAnnotationAspectRatio: number;
};

export type BeatCanvasMeasureDrawOptions = {
  endBarWidthLineFraction: number;
};

export type BeatCanvasDrawOptions = {
  note: BeatCanvasNoteDrawOptions;
  measure: BeatCanvasMeasureDrawOptions;
};

export type NoteDrawData = {
  type: NoteType;
  bodyCenter: Coordinate;
  bodyHeight: number;
  measureIndex: number;
  noteIndex: number;
  annotations?: NoteAnnotation[];
};

export type NoteData = NoteDrawData & NoteDisplayData;

export type MeasureOptions = {
  topLeft: Coordinate;
  width: number;
  height: number;
  containerPadding: BlockDirection<number>;
  componentStartY: number;
  bodyStartY: number;
  bodyHeight: number;
  lineHeight: number;
  spaceHeight: number;
  // lineCount: number;
  // spaceCount: number;
  // bodyStartPos: number;
  // bodyEndPos: number;
  topComponentIsLine: boolean;
  measureIndex: number;
  componentIterator: MeasureComponentIterator;
  timeSignature?: TimeSignature;
  //keySignature?: KeySignature,
  attributes?: Partial<MeasureAttributes>;
};

export type RestOptions = {
  type: NoteType;
  center: Coordinate;
  noteBodyHeight: number;
};

export interface IBeatCanvas {
  drawNote(options: NoteData): any;
  drawMeasure(options: MeasureOptions): any;
  drawRest(options: RestOptions): any;
}

/* **** */
export type MeasureComponentContext = {
  width: number;
  height: number;
  // isLine: boolean;
  corner: Coordinate;
  // isBody: boolean;
};

export type MeasureComponentContextIterator = (
  measureComponent: MeasureComponent & MeasureComponentContext
) => void;

export type DirectionOffsets = {
  up: number;
  down: number;
  left: number;
  right: number;
};

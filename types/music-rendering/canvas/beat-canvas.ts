import {
  NoteDisplayData,
  NoteType,
  TimeSignature,
} from "@/components/providers/music/types";
import { NoteAttribute } from "@/lib/notes/ui/note-attributes";
import { Coordinate } from "@/objects/measurement/types";
import { MeasureAttributes } from "@/types/music";
import { BlockDirection } from "../pdf";
import { NoteDirection } from "@/lib/notes/types";

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

export type NoteAreaOptions = Pick<
  NoteOptions,
  "stemOffset" | "bodyHeight" | "bodyCenter"
>;

export type MeasureLinesOptions = Pick<
  MeasureOptions,
  | "topLeft"
  | "lineHeight"
  | "spaceHeight"
  | "width"
  | "spaceCount"
  | "lineCount"
  | "topComponentIsLine"
  | "bodyEndPos"
  | "bodyStartPos"
  | "measureIndex"
>;

export type MeasureAreaData = Pick<
  MeasureOptions,
  "containerPadding" | "spaceCount" | "lineCount" | "spaceHeight" | "lineHeight"
>;

export type BeatCanvasNoteDrawOptions = {
  noteBodyAspectRatio: number;
  noteBodyAngle: number;
  stemHeightBodyFraction: number;
  stemWidthBodyFraction: number;
  flagHeightBodyFraction: number;
};

export type BeatCanvasMeasureDrawOptions = {
  endBarWidthLineFraction: number;
};

export type BeatCanvasDrawOptions = {
  note: BeatCanvasNoteDrawOptions;
  measure: BeatCanvasMeasureDrawOptions;
};

export type NoteOptions = {
  type: NoteType;
  bodyCenter: Coordinate;
  bodyHeight: number;
  measureIndex: number;
  noteIndex: number;
  // stemWidth: number;
  // stemHeight: number;
  attributes?: NoteAttribute[];
} & NoteDisplayData;

export type MeasureOptions = {
  topLeft: Coordinate;
  width: number;
  height: number;
  containerPadding: BlockDirection<number>;
  lineHeight: number;
  spaceHeight: number;
  lineCount: number;
  spaceCount: number;
  bodyStartPos: number;
  bodyEndPos: number;
  topComponentIsLine: boolean;
  measureIndex: number;
  timeSignature?: TimeSignature;
  //keySignature?: KeySignature,
  attributes?: Partial<MeasureAttributes>;
};

export type RestOptions = {
  type: NoteType;
  center: Coordinate;
};

export interface IBeatCanvas {
  drawNote(options: NoteOptions): any;
  drawMeasure(options: MeasureOptions): any;
  drawRest(options: RestOptions): any;
}

/* **** */
export type MeasureLineContext = {
  width: number;
  height: number;
  isLine: boolean;
  corner: Coordinate;
  isBody: boolean;
  absoluteYPos: number;
};

export type MeasureLineIteratorDel = (context: MeasureLineContext) => void;

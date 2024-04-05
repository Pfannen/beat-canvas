import { NoteDirection } from "@/lib/notes/types";
import { Coordinate } from "@/objects/measurement/types";
import { MeasureOptions } from "@/types/music-rendering/canvas";

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
  | "spaceCount"
  | "lineCount"
  | "topComponentIsLine"
  | "bodyEndPos"
  | "bodyStartPos"
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

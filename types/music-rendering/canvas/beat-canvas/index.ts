import { NoteType, TimeSignature } from "@/components/providers/music/types";
import { Coordinate } from "@/types";
import { MeasureAttributes } from "@/types/music";
import { BlockDirection } from "../../pdf";
import { NoteDirection } from "@/lib/notes/types";
import {
  MeasureComponent,
  MeasureComponentIterator,
  MeasureComponentValues,
} from "../..";
import { NoteDisplayData } from "@/types/music-rendering/draw-data/note";
import { NoteAnnotation } from "@/types/music/note-annotations";
import { MeasureDisplayData } from "../../draw-data/measure";

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
  MeasureDrawData,
  | "topLeft"
  | "componentHeights"
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

export type NoteData = NoteDrawData & { displayData: NoteDisplayData };

export type MeasureDrawData = {
  topLeft: Coordinate;
  width: number;
  height: number;
  containerPadding: BlockDirection<number>;
  componentStartY: number;
  bodyStartY: number;
  bodyHeight: number;
  componentHeights: MeasureComponentValues;
  topComponentIsLine: boolean;
  measureIndex: number;
  componentIterator: MeasureComponentIterator;
  attributes?: Partial<MeasureAttributes>;
};

export type MeasureData = MeasureDrawData & {
  displayData?: MeasureDisplayData;
};

export type RestOptions = {
  type: NoteType;
  center: Coordinate;
  measureComponentHeights: MeasureComponentValues;
};

export interface IBeatCanvas {
  drawNote(options: NoteData): any;
  drawMeasure(options: MeasureData): any;
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

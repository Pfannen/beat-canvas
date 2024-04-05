import {
  NoteDisplayData,
  NoteType,
  TimeSignature,
} from "@/components/providers/music/types";
import { NoteAttribute } from "@/lib/notes/ui/note-attributes";
import { Coordinate } from "@/objects/measurement/types";
import { BlockDirection } from "../pdf";
import { MeasureAttributes } from "@/types/music";

export type LineOptions = {
  start: Coordinate;
  end: Coordinate;
  thickness: number;
};

export type RectangleOptions = {
  corner: Coordinate;
  width: number;
  height: number;
  degreeRotation?: number;
};

export type CircleOptions = { center: Coordinate; diameter: number };

export type EllipseOptions = CircleOptions & {
  aspectRatio: number;
  degreeRotation?: number;
};

export type SVGOptions = {};

export interface IDrawingCanvas {
  drawLine(options: LineOptions): void;
  drawCircle(options: CircleOptions): void;
  drawRectangle(options: RectangleOptions): void;
  drawEllipse(options: EllipseOptions): void;
  drawSVG(options: SVGOptions): void;
}

export type NoteOptions = {
  type: NoteType;
  bodyCenter: Coordinate;
  bodyHeight: number;
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
  drawNote(options: NoteOptions): void;
  drawMeasure(options: MeasureOptions): void;
  drawRest(options: RestOptions): void;
}

import { NoteType, TimeSignature } from "@/components/providers/music/types";
import { NoteDirection } from "@/lib/notes/types";
import { NoteAttribute } from "@/lib/notes/ui/note-attributes";
import { Coordinate } from "@/objects/measurement/types";
import { MeasureAttributes } from "../music";
import { BlockDirection } from "./pdf";

export type LineOptions = {
  start: Coordinate;
  end: Coordinate;
  thickness: number;
};

export type CircleOptions = { center: Coordinate; diameter: number };

export type OvalOptions = CircleOptions & {
  aspectRatio: number;
  height: number;
};

export interface IDrawingCanvas {
  drawLine(options: LineOptions): void;
  drawCircle(options: CircleOptions): void;
  drawOval(options: OvalOptions): void;
}

export type NoteOptions = {
  type: NoteType;
  bodyCenter: Coordinate;
  bodyHeight: number;
  stemWidth: number;
  stemHeight: number;
  direction: NoteDirection;
  attributes?: NoteAttribute[];
};

export type MeasureOptions = {
  topLeft: Coordinate;
  width: number;
  height: number;
  containerPadding: BlockDirection<number>;
  lineHeight: number;
  spaceHeight: number;
  bodyCount: number;
  aboveBelowComponentCount: number;

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

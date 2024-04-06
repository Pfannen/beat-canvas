import { Coordinate } from "@/objects/measurement/types";

export type DrawOptions = {
  color: string;
  opacity: number;
  degreeRotation: number;
};

export type OptionsWithDrawOptions<T> = T & {
  drawOptions?: Partial<DrawOptions>;
};

export type LineOptions = OptionsWithDrawOptions<{
  start: Coordinate;
  end: Coordinate;
  thickness: number;
}>;

export type RectangleOptions = OptionsWithDrawOptions<{
  corner: Coordinate;
  width: number;
  height: number;
}>;

export type CircleOptions = OptionsWithDrawOptions<{
  center: Coordinate;
  diameter: number;
}>;

export type EllipseOptions = CircleOptions & {
  aspectRatio: number;
};

export type SVGOptions = {};

export interface IDrawingCanvas {
  drawLine(options: LineOptions): void;
  drawCircle(options: CircleOptions): void;
  drawRectangle(options: RectangleOptions): void;
  drawEllipse(options: EllipseOptions): void;
  drawSVG(options: SVGOptions): void;
}

import { Coordinate } from "@/objects/measurement/types";

export type DrawOptions = {
  color: string;
  opacity: number;
  degreeRotation: number;
};

export type OptionsWithDrawOptions<T> = T & {
  drawOptions?: Partial<DrawOptions>;
};

export type LineOptions = {
  start: Coordinate;
  end: Coordinate;
  thickness: number;
};

export type LineDrawOptions = OptionsWithDrawOptions<LineOptions>;

export type RectangleOptions = {
  corner: Coordinate;
  width: number;
  height: number;
};

export type RectangleDrawOptions = OptionsWithDrawOptions<RectangleOptions>;

export type CircleOptions = {
  center: Coordinate;
  diameter: number;
};

export type CircleDrawOptions = OptionsWithDrawOptions<CircleOptions>;

export type EllipseOptions = CircleOptions & {
  aspectRatio: number;
};

export type EllipseDrawOptions = OptionsWithDrawOptions<EllipseOptions>;

export type SVGOptions = {};

export interface IDrawingCanvas {
  drawLine(options: LineDrawOptions): void;
  drawCircle(options: CircleDrawOptions): void;
  drawRectangle(options: RectangleDrawOptions): void;
  drawEllipse(options: EllipseDrawOptions): void;
  drawSVG(options: SVGOptions): void;
}

import { Coordinate } from "@/objects/measurement/types";

export type DrawOptions<T> = {
  color: string;
  opacity: number;
  degreeRotation: number;
} & T;

export type OptionsWithDrawOptions<T, U> = T & {
  drawOptions?: Partial<DrawOptions<U>>;
};

export type LineOptions = {
  start: Coordinate;
  end: Coordinate;
  thickness: number;
};

export type LineDrawOptions<T = {}> = OptionsWithDrawOptions<LineOptions, T>;

export type RectangleOptions = {
  corner: Coordinate;
  width: number;
  height: number;
};

export type RectangleDrawOptions<T = {}> = OptionsWithDrawOptions<
  RectangleOptions,
  T
>;

export type CircleOptions = {
  center: Coordinate;
  diameter: number;
};

export type CircleDrawOptions<T = {}> = OptionsWithDrawOptions<
  CircleOptions,
  T
>;

export type EllipseOptions = CircleOptions & {
  aspectRatio: number;
};

export type EllipseDrawOptions<T = {}> = OptionsWithDrawOptions<
  EllipseOptions,
  T
>;

export type SVGOptions = { center: Coordinate; path: string; scale?: number };

export type SVGDrawOptions<T = {}> = OptionsWithDrawOptions<SVGOptions, T>;

export interface IDrawingCanvas {
  drawLine(options: LineDrawOptions): void;
  drawCircle(options: CircleDrawOptions): void;
  drawRectangle(options: RectangleDrawOptions): void;
  drawEllipse(options: EllipseDrawOptions): void;
  drawSVG(options: SVGDrawOptions): void;
}

import { Coordinate } from "@/types";
import { SVGData } from "@/types/svg";

export type DrawOptions<T> = {
  color: string;
  opacity: number;
  degreeRotation: number;
} & T;

export type OptionsWithDrawOptions<T, U> = T & {
  drawOptions?: Partial<DrawOptions<U>>;
};

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

export type EllipseOptions = CircleOptions & {
  aspectRatio: number;
};

export type EllipseDrawOptions<T = {}> = OptionsWithDrawOptions<
  EllipseOptions,
  T
>;

export type SVGOptions = {
  x: number;
  y: number;
  center?: boolean;
  scale?: number;
} & SVGData;

export type SVGDrawOptions<T = {}> = OptionsWithDrawOptions<SVGOptions, T>;

export interface IDrawingCanvas {
  drawRectangle(options: RectangleDrawOptions): void;
  drawEllipse(options: EllipseDrawOptions): void;
  drawSVG(options: SVGDrawOptions): void;
}

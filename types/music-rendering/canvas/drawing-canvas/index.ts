import { Coordinate } from "@/types";
import { SVGData } from "@/types/svg";
import { PDFFont } from "pdf-lib";

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

export type DrawingCanvasFontFamily = "Times New Roman" | "Sonata";

export type DrawingCanvasTextPosition =
  | "center"
  // | "topCenter"
  | "bottomCenter"
  | "bottomLeft";
// | "topRight"
// | "topLeft";

export type DrawingCanvasFontUnit = "px" | "rem";

export type TextOptions = {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontUnit: DrawingCanvasFontUnit;
  fontFamily: DrawingCanvasFontFamily;
  position?: DrawingCanvasTextPosition;
};

export type TextDrawOptions<T = {}> = OptionsWithDrawOptions<TextOptions, T>;

export interface IDrawingCanvas {
  drawRectangle(options: RectangleDrawOptions): void;
  drawEllipse(options: EllipseDrawOptions): void;
  drawSVG(options: SVGDrawOptions): void;
  drawText(options: TextDrawOptions): void;
}

export type PDFFonts = Record<DrawingCanvasFontFamily, PDFFont>;

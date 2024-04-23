import { Coordinate } from "@/types";
import { MeasureRenderData } from "../music/render-data";
import { TimeSignature } from "@/components/providers/music/types";
import { IBeatCanvas } from "./canvas/beat-canvas";

export type MeasureDrawData = {
  start: Coordinate;
  end: Coordinate;
  width: number;
  pageNumber: number;
};

export interface IMeasureWidthCalculator {
  getMeasureWidth(
    measure: MeasureRenderData,
    timeSignature: TimeSignature
  ): number;
}

export type MeasureComponentValues<T = number> = { line: T; space: T };

export type BeatCanvasDel = (pageNumber: number) => IBeatCanvas;

export type MusicUnitConverter = (xValue: number) => number;

export type MeasureComponent = {
  isLine: boolean;
  isBody: boolean;
  yPos: number;
};

export type MeasureComponentIterator = (
  cb: (c: MeasureComponent) => void
) => void;

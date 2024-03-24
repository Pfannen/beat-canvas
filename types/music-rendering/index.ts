import { Coordinate } from "@/objects/measurement/types";
import { MeasureRenderData } from "../music/render-data";
import { TimeSignature } from "@/components/providers/music/types";

export type MeasureDrawData = {
  start: Coordinate;
  end: Coordinate;
  width: number;
  aspectRatio: number;
  pageNumber: number;
};

export interface IMeasureWidthCalculator {
  getMeasureWidth(
    measure: MeasureRenderData,
    timeSignature: TimeSignature
  ): number;
}

export type MeasureComponentValues<T = number> = { line: T; space: T };

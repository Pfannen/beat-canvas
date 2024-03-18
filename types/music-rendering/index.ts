import { Coordinate } from "@/objects/measurement/types";

export type MeasureDrawData = {
  start: Coordinate;
  end: Coordinate;
  width: number;
  aspectRatio: number;
};

import { Coordinate } from "@/objects/measurement/types";
import { BlockDirection, Margins, PageDimensions } from "./pdf";

export type MusicDimensionParams = {
  pageDimensions: PageDimensions;
  musicMargins: Margins;
  minHeaderSpace: number;
  measuresPerLine: number;
  linesPerPage: number;
  measurePaddingFractions: BlockDirection<number>;
};

export type MeasureDimensionData = {
  padding: BlockDirection<number>;
  noteYOffset: number;
  noteSpaceHeight: number;
  height: number;
  width: number;
};

export type PageDimensionData = {
  headerHeight: number;
  width: number;
  height: number;
  musicMargins: Margins;
  firstMeasureStart: Coordinate;
};

export type MusicDimensionData = {
  measureDimensions: MeasureDimensionData;
  pageDimensions: PageDimensionData;
};

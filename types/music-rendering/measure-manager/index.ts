import { Coordinate } from "@/objects/measurement/types";
import { MeasureSection, MeasureSectionMetadata } from "@/types/music";

export type MeasureSectionData<T extends MeasureSection> = {
  key: T;
  width: number;
  metadata: MeasureSectionMetadata[T];
};

export type MeasureManagerSection<T> = {
  startX: number;
  width: number;
  metadata: T;
};

export type MeasureManagerSections = Partial<{
  [K in MeasureSection]: MeasureManagerSection<MeasureSectionMetadata[K]>;
}>;

//#region Measure Outline Types
export type MeasureLine = {
  endPoint: Coordinate;
  startMeasureIndex: number;
  measures: number[]; //Start x position of measure
};

export type MeasureLineMeasure<T> = { startX: number; metadata?: T };

export type MeasureIndexData = {
  pageNumber: number;
  lineNumber: number;
  index: number;
};

export type IterateMeasuresArgs = {
  startMeasureIndex: number;
  measureCount: number;
  setMeasureWidth: (index: number, width: number) => void;
  getMeasureWidth: (index: number) => number;
};

export type IterateMeasuresCallback = (
  args: IterateMeasuresArgs,
  measureIndex: number
) => void;
//#endregion

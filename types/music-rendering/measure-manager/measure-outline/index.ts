import { Coordinate } from "@/types";

export type Section<T> = { key: T; width: number };

export type SectionArray<T extends string> = Array<Section<T>>;

export type CoordinateSection<T> = Section<T> & { startX: number };

export type CoordinateSectionArray<T extends string> = Array<
  CoordinateSection<T>
>;

export type MeasureLineMeasure<T> = { startX: number; metadata?: T };

export type MeasureLine<T> = {
  endPoint: Coordinate;
  startMeasureIndex: number;
  measures: MeasureLineMeasure<T>[];
};

export type UncommittedMeasure<T> = { width: number; sections?: T };

export type UncommittedLine<T> = {
  startPoint: Coordinate;
  startMeasureIndex: number;
  measures: UncommittedMeasure<T>[];
};

export type MeasureIndexData = {
  pageNumber: number;
  lineNumber: number;
  index: number;
};

export type IterateMeasuresArgs<T extends string> = {
  startMeasureIndex: number;
  measureCount: number;
  setSectionWidth: (
    measureIndex: number,
    sectionKey: T,
    newWidth: number
  ) => void;
  addToSectionWidth: (
    measureIndex: number,
    sectionKey: T,
    extraWidth: number
  ) => void;
  setMeasureWidth: (measureIndex: number, width: number) => void;
  getMeasureWidth: (measureIndex: number) => number;
};

export type IterateMeasuresCallback<T extends string> = (
  args: IterateMeasuresArgs<T>,
  measureIndex: number
) => void;

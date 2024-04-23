import { Coordinate } from "@/types";
import { MeasureSectionMetadata } from "@/types/music";

export type SectionData<T> = { width: number; metadata: T };

export type Section<TKey, TMetadata> = { key: TKey } & SectionData<TMetadata>;

export type SectionArray<T extends Record<string, any>> = {
  [K in keyof T]: Section<K, T[K]>;
}[keyof T][];

export type CoordinateSection<T> = {
  startX: number;
} & SectionData<T>;

export type MeasureSections = Partial<MeasureSectionMetadata> & {
  notes?: undefined;
};

export type CoordinateSections<T extends Record<string, any>> = {
  [K in keyof T]: CoordinateSection<T[K]>;
};

//#region Measure Outline Types
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

export type IterateMeasuresArgs = {
  startMeasureIndex: number;
  measureCount: number;
  updateSectionWidth: (
    index: number,
    sectionIndex: number,
    newWidth: number
  ) => void;
  setMeasureWidth: (index: number, width: number) => void;
  getMeasureWidth: (index: number) => number;
};

export type IterateMeasuresCallback = (
  args: IterateMeasuresArgs,
  measureIndex: number
) => void;
//#endregion

import { Coordinate } from "@/objects/measurement/types";
import { MeasureSection, MeasureSectionMetadata } from "@/types/music";

export type SectionData<T> = { width: number; metadata?: T };

export type Section<TKey, TMetadata> = { key: TKey } & SectionData<TMetadata>;

export type MeasureSectionData<T extends MeasureSection> = Section<
  T,
  MeasureSectionMetadata[T]
>;

export type BlockSection<T> = {
  startX: number;
} & SectionData<T>;

// export type MeasureManagerSections = Partial<{
//   [K in MeasureSection]: BlockSection<MeasureSectionMetadata[K]>;
// }>;

export type BlockSections<TMetadataMap> = {
  [K in keyof TMetadataMap]: BlockSection<TMetadataMap[K]>;
};

//#region Measure Outline Types
export type MeasureLineMeasure<T> = { startX: number; metadata?: T };

export type MeasureLine<T> = {
  endPoint: Coordinate;
  startMeasureIndex: number;
  measures: MeasureLineMeasure<T>[];
};

export type UncommittedMeasure<T> = { width: number; metadata?: T };

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
  setMeasureWidth: (index: number, width: number) => void;
  getMeasureWidth: (index: number) => number;
};

export type IterateMeasuresCallback = (
  args: IterateMeasuresArgs,
  measureIndex: number
) => void;
//#endregion

class YourClass<TMetadataMap> {
  // Function that expects an array with a specific structure
  yourFunction<Key extends keyof TMetadataMap>(
    arr: { key: Key; width: number; metadata: TMetadataMap[Key] }[]
  ) {
    // Your logic here
  }
}

const c = new YourClass<MeasureSectionMetadata>();

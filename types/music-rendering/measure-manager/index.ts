import { Coordinate } from "@/types";
import { MeasureSection, MeasureSectionMetadata } from "@/types/music";

export type RequiredMeasureSection = Exclude<
  MeasureSection,
  "timeSignature" | "repeat"
>; //These are the required section details that must be passed in (clef and key signature because if measure is rendered at the start of the line, they need to be displayed)

export type NonRequiredMeasureSection = Exclude<
  MeasureSection,
  RequiredMeasureSection
>;

export type RequiredSectionData<T> = SectionData<T> & {
  displayByDefault: boolean;
};

export type RequiredSectionsData<
  M extends Record<string, any>,
  K extends keyof M
> = {
  [key in K]: RequiredSectionData<M[K]>;
};

export type NonRequiredSectionsData<
  M extends Record<string, any>,
  K extends keyof M
> = Partial<{
  [key in K]: SectionData<M[K]>;
}>;

export type MeasureSections = {
  required: RequiredSectionsData<
    MeasureSectionMetadata,
    RequiredMeasureSection
  >;
  display?: NonRequiredSectionsData<
    MeasureSectionMetadata,
    NonRequiredMeasureSection
  >;
};

// const t: MeasureSections = {
//   required: {
//     clef: { width: 10, metadata: 1, displayByDefault: false },
//   },
// }; //Stuck here, metadata can be any required type

export const measureSectionOrder: Record<MeasureSection, number> = {
  clef: 0,
  keySignature: 1,
  timeSignature: 2,
  note: 3,
  repeat: 4,
};

export type SectionData<T> = { width: number; metadata: T };

export type Section<TKey, TMetadata> = { key: TKey } & SectionData<TMetadata>;

export type SectionArray<T extends Record<string, any>> = {
  [K in keyof T]: Section<K, T[K]>;
}[keyof T][];

export type CoordinateSection<TKey, TMetadata> = {
  startX: number;
} & Section<TKey, TMetadata>;

export type CooridinateSectionArray<T extends Record<string, any>> = {
  [K in keyof T]: CoordinateSection<K, T[K]>;
}[keyof T][];

// export type CoordinateSections<T extends Record<string, any>> = {
//   [K in keyof T]: CoordinateSection<T[K]>;
// };

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

export type IterateMeasuresArgs<T extends Record<string, any>> = {
  startMeasureIndex: number;
  measureCount: number;
  setSectionWidth: (
    measureIndex: number,
    sectionKey: keyof T,
    newWidth: number
  ) => void;
  addToSectionWidth: (
    measureIndex: number,
    sectionKey: keyof T,
    extraWidth: number
  ) => void;
  setMeasureWidth: (measureIndex: number, width: number) => void;
  getMeasureWidth: (measureIndex: number) => number;
};

export type IterateMeasuresCallback<T extends Record<string, any>> = (
  args: IterateMeasuresArgs<T>,
  measureIndex: number
) => void;
//#endregion

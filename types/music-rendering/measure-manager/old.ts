import { MeasureSection } from "@/types/music";

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

// export type RequiredSectionsData<
//   M extends Record<string, any>,
//   K extends keyof M
// > = {
//   [key in K]: RequiredSectionData<M[K]>;
// };

// export type NonRequiredSectionsData<
//   M extends Record<string, any>,
//   K extends keyof M
// > = Partial<{
//   [key in K]: SectionData<M[K]>;
// }>;
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

//#endregion

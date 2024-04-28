import { MeasureSection } from "@/types/music";
import { Section } from "./measure-outline";

export type RequiredMeasureSection = Exclude<
  MeasureSection,
  "timeSignature" | "repeat"
>; //These are the required section details that must be passed in (clef and key signature because if measure is rendered at the start of the line, they need to be displayed)

export type OptionalMeasureSection = Exclude<
  MeasureSection,
  RequiredMeasureSection
>;

export type MeasureOutlineSection<T> = Section<T> & {
  displayByDefault: boolean;
};

export type MeasureSectionArray<T extends string> = Array<
  MeasureOutlineSection<T>
>;

// export type RequiredMeasureSectionArray<T extends string> = Array<MeasureOutlineSection<T>> & {
//   [K in T]: MeasureOutlineSection<T> | undefined;
// };

export type MeasureSections = {
  required: MeasureSectionArray<RequiredMeasureSection>;
  optional: MeasureSectionArray<OptionalMeasureSection>;
};

export const measureSectionOrder: Record<MeasureSection, number> = {
  clef: 0,
  keySignature: 1,
  timeSignature: 2,
  note: 3,
  repeat: 4,
  repeatEndings: 5,
};

export type Tolerence = { width: number; height: number };

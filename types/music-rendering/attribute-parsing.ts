import { MeasureSectionMetadata } from "@/types/music";
import { InitialMeasureSectionArray } from "./canvas/beat-canvas/drawers/measure/measure-section";

export type MeasureSectionData = {
  sections: InitialMeasureSectionArray;
  attributes: MeasureSectionMetadata;
};

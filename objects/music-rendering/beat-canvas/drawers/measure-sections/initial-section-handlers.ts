import { MeasureSection } from "@/types/music";
import {
  InitialMeasureSectionArray,
  MeasureSectionWidthArgs,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";
import {
  MeasureOutlineSection,
  OptionalMeasureSection,
  RequiredMeasureSection,
} from "@/types/music-rendering/measure-manager";
import { getSectionWidthHandler } from "./width-handlers";

const requiredSections: { [K in MeasureSection]: boolean } = {
  clef: true,
  note: true,
  keySignature: true,
  timeSignature: false,
  forwardRepeat: false,
  backwardRepeat: false,
  repeatEndings: false,
};

const isRequiredSection = (section: MeasureSection) =>
  requiredSections[section];

export const formatInitialSections = (
  sections: InitialMeasureSectionArray,
  widthArgs: MeasureSectionWidthArgs
) => {
  const required: MeasureOutlineSection<RequiredMeasureSection>[] = [];
  const optional: MeasureOutlineSection<OptionalMeasureSection>[] = [];
  sections.forEach((section) => {
    const widthHandler = getSectionWidthHandler(section.key);
    const width = widthHandler(widthArgs, section.data as never);
    if (isRequiredSection(section.key)) {
      required.push({
        key: section.key as RequiredMeasureSection,
        displayByDefault: section.displayByDefault,
        width,
      });
    } else {
      optional.push({
        key: section.key as OptionalMeasureSection,
        displayByDefault: section.displayByDefault,
        width,
      });
    }
  });
  return { required, optional };
};

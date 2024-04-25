import { MeasureSectionWidthHandlers } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure-section";
import { getKeySignatureWidth } from "./key-signature/widths";
import { MeasureSection } from "@/types/music";

const sectionWidthHandlers: MeasureSectionWidthHandlers = {
  clef: () => 1,
  timeSignature: () => 1,
  keySignature: (args, data) =>
    getKeySignatureWidth(data, args.componentHeights.space),
  repeat: () => 1,
  note: () => 1,
};

export const getSectionWidthHandler = (section: MeasureSection) => {
  return sectionWidthHandlers[section];
};

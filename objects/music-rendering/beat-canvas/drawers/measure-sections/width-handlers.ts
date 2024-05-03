import {
  MeasureSectionWidthArgs,
  MeasureSectionWidthHandlers,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";
import { getKeySignatureWidth } from "./key-signature/widths";
import { MeasureSection, RepeatEndings } from "@/types/music";
import { getClefWidth } from "./clef/widths";

const repeatAspectRatio = 0.4;

const padding = 1.25;

export const getTimeSignatureWidth = (bodyHeight: number) => bodyHeight / 2;

const sectionWidthHandlers: MeasureSectionWidthHandlers = {
  clef: ({ bodyHeight }, clef) => getClefWidth(clef, bodyHeight) * padding,
  timeSignature: ({ bodyHeight }) =>
    getTimeSignatureWidth(bodyHeight) * padding,
  keySignature: ({ componentHeights, clef }, keySignature) =>
    getKeySignatureWidth(keySignature, clef, componentHeights.space) * padding,
  forwardRepeat: ({ bodyHeight }) => bodyHeight * repeatAspectRatio,
  backwardRepeat: ({ bodyHeight }) => bodyHeight * repeatAspectRatio,
  note: () => 1,
  repeatEndings: function (
    args: MeasureSectionWidthArgs,
    data: RepeatEndings | undefined
  ): number {
    return 0;
  },
};

export const getSectionWidthHandler = (section: MeasureSection) => {
  return sectionWidthHandlers[section];
};

import {
  MeasureSectionDrawerArgs,
  MeasureSectionDrawers,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";
import { MeasureSection } from "@/types/music";
import { CoordinateSection } from "@/types/music-rendering/measure-manager/measure-outline";
import { clefSectionDrawer } from "./clef/drawer";
import { keySignatureSectionDrawer } from "./key-signature/drawer";
import { timeSignatureSectionDrawer } from "./time-signature/drawer";
import {
  backwardRepeatSectionDrawer,
  forwardRepeatSectionDrawer,
} from "./repeat/drawer";

export const getSectionCenterX = (section: CoordinateSection<any>) =>
  section.startX + section.width / 2;

const sectionDrawers: MeasureSectionDrawers = {
  keySignature: keySignatureSectionDrawer,
  clef: clefSectionDrawer,
  timeSignature: timeSignatureSectionDrawer,
  forwardRepeat: forwardRepeatSectionDrawer,
  backwardRepeat: backwardRepeatSectionDrawer,
  note: () => {},
  repeatEndings: function (
    args: MeasureSectionDrawerArgs<"repeatEndings">
  ): void {},
};

export const getMeasureSectionDrawer = (section: MeasureSection) => {
  return sectionDrawers[section];
};

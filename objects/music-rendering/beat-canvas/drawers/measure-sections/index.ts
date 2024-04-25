import {
  MeasureSectionDrawer,
  MeasureSectionDrawerArgs,
  MeasureSectionDrawers,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure-section";
import { iterateSection } from "@/utils/music-rendering/section-calculation";
import { getAccidentalSVG } from "./key-signature/accidental-svgs";
import {
  calculateScaleToHeight,
  calculateScaleToWidth,
  convertWidthScaleToHeightScale,
} from "@/utils/svg";
import { MeasureSection } from "@/types/music";

export const keySignatureSectionDrawer: MeasureSectionDrawer<
  "keySignature"
> = ({ drawCanvas, data, componentHeights, section, yPosToAbsolute }) => {
  const symbol = "b";
  const svg = getAccidentalSVG(symbol);
  const symbolYPositions = [4, 7, 3, 6]; //Ab
  const widthPerSymbol = section.width / symbolYPositions.length;
  iterateSection(
    section.width,
    section.startX,
    symbolYPositions.length,
    true,
    (x, i) => {
      const widthScale = calculateScaleToWidth(svg.viewBox, widthPerSymbol);
      const scale =
        convertWidthScaleToHeightScale(svg.viewBox, widthScale) * 1.75;
      const y = yPosToAbsolute(symbolYPositions[i]);
      drawCanvas.drawSVG({
        path: svg.path,
        viewBox: svg.viewBox,
        x,
        y,
        center: true,
        scale,
      });
      x += widthPerSymbol;
    }
  );
};

const sectionDrawers: MeasureSectionDrawers = {
  keySignature: keySignatureSectionDrawer,
  clef: function (args: MeasureSectionDrawerArgs<"clef">): void {
    console.log("Draw clef", args.data);
  },
  timeSignature: function (
    args: MeasureSectionDrawerArgs<"timeSignature">
  ): void {
    console.log("Draw time", args.data);
  },
  repeat: function (args: MeasureSectionDrawerArgs<"repeat">): void {
    console.log("Draw repeat", args.data);
  },
  note: function (args: MeasureSectionDrawerArgs<"note">): void {
    console.log("Draw note", args.data);
  },
};

export const getMeasureSectionDrawer = (section: MeasureSection) => {
  return sectionDrawers[section];
};

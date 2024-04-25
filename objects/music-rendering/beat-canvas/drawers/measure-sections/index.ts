import {
  MeasureSectionDrawer,
  MeasureSectionDrawerArgs,
  MeasureSectionDrawers,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure-section";
import { iterateSection } from "@/utils/music-rendering/section-calculation";
import { getAccidentalSVG } from "./key-signature/accidental-svgs";
import {
  calculateScaleToWidth,
  convertWidthScaleToHeightScale,
} from "@/utils/svg";
import { MeasureSection } from "@/types/music";
import { getKeySignatureData } from "./key-signature/widths";

export const keySignatureSectionDrawer: MeasureSectionDrawer<
  "keySignature"
> = ({ drawCanvas, data, componentHeights, section, yPosToAbsolute }) => {
  const { symbol, symbolWidth, positions } = getKeySignatureData(
    data,
    componentHeights.space
  );
  const svg = getAccidentalSVG(symbol);
  iterateSection(
    section.width,
    section.startX,
    positions.length,
    true,
    (x, i) => {
      const widthScale = calculateScaleToWidth(svg.viewBox, symbolWidth);
      const scale =
        convertWidthScaleToHeightScale(svg.viewBox, widthScale) * 1.75;
      const y = yPosToAbsolute(positions[i]);
      drawCanvas.drawSVG({
        path: svg.path,
        viewBox: svg.viewBox,
        x,
        y,
        center: true,
        scale,
      });
      x += symbolWidth;
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

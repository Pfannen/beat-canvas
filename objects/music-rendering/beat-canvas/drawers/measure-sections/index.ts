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
import { getKeySignatureData } from "./key-signature/widths";
import { getTimeSignatureSVGs } from "./time-signature/number-svgs";
import { getClefSVG } from "./clef/clef-svgs";
import { getClefWidth } from "./clef/widths";
import { CoordinateSection } from "@/types/music-rendering/measure-manager/measure-outline";

const getSectionCenterX = (section: CoordinateSection<any>) =>
  section.startX + section.width / 2;

const keySignatureSectionDrawer: MeasureSectionDrawer<"keySignature"> = ({
  drawCanvas,
  data,
  componentHeights,
  section,
  yPosToAbsolute,
}) => {
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

const timeSignatureSectionDrawer: MeasureSectionDrawer<"timeSignature"> = ({
  drawCanvas,
  data,
  bodyHeight,
  section,
  yPosToAbsolute,
}) => {
  const { beatNote, beatsPerMeasure } = getTimeSignatureSVGs(data);
  const centerY = yPosToAbsolute(4);
  const x = getSectionCenterX(section);
  const svgHeight = bodyHeight / 2;

  const beatNoteScale = calculateScaleToHeight(beatNote.viewBox, svgHeight);
  const beatNoteCenterY = centerY + svgHeight / 2;

  const bpmScale = calculateScaleToHeight(beatsPerMeasure.viewBox, svgHeight);
  const bpmCenterY = centerY - svgHeight / 2;
  drawCanvas.drawSVG({
    path: beatNote.path,
    viewBox: beatNote.viewBox,
    x,
    y: beatNoteCenterY,
    center: true,
    scale: beatNoteScale,
  });

  drawCanvas.drawSVG({
    path: beatsPerMeasure.path,
    viewBox: beatsPerMeasure.viewBox,
    x,
    y: bpmCenterY,
    center: true,
    scale: bpmScale,
  });
};

const clefSectionDrawer: MeasureSectionDrawer<"clef"> = ({
  drawCanvas,
  data,
  bodyHeight,
  section,
  yPosToAbsolute,
}) => {
  const svg = getClefSVG(data);
  const width = getClefWidth(data, bodyHeight);
  const scale = calculateScaleToWidth(svg.viewBox, width);
  const y = yPosToAbsolute(4);
  const x = getSectionCenterX(section);
  drawCanvas.drawSVG({
    path: svg.path,
    viewBox: svg.viewBox,
    x,
    y,
    center: true,
    scale,
  });
};

const sectionDrawers: MeasureSectionDrawers = {
  keySignature: keySignatureSectionDrawer,
  clef: clefSectionDrawer,
  timeSignature: timeSignatureSectionDrawer,
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

import {
  MeasureSectionDrawer,
  MeasureSectionDrawerArgs,
  MeasureSectionDrawers,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure-section";
import { iterateSection } from "@/utils/music-rendering/section-calculation";
import {
  calculateScaleToHeight,
  calculateScaleToWidth,
  convertWidthScaleToHeightScale,
  getSVGCenterOffsetY,
} from "@/utils/svg";
import { MeasureSection } from "@/types/music";
import {
  getHeightForAccidentalSVG,
  getKeySignatureData,
} from "./key-signature/widths";
import {
  getClefWidth,
  getHeightForClefInfo,
  getWidthForClefInfo,
} from "./clef/widths";
import { CoordinateSection } from "@/types/music-rendering/measure-manager/measure-outline";
import { getTimeSignatureSVGs } from "@/SVG/measure/time-signature";
import { getAccidentalSVG } from "@/SVG/measure/key-signature";
import { getClefSVG } from "@/SVG/measure/clef";

const getSectionCenterX = (section: CoordinateSection<any>) =>
  section.startX + section.width / 2;

const keySignatureSectionDrawer: MeasureSectionDrawer<"keySignature"> = ({
  drawCanvas,
  data,
  componentHeights,
  section,
  yPosToAbsolute,
  clef,
}) => {
  const { symbol, symbolWidth, positions } = getKeySignatureData(
    data,
    clef,
    componentHeights.space
  );
  const svg = getAccidentalSVG(symbol);
  iterateSection(
    section.width,
    section.startX,
    positions.length,
    true,
    (x, i) => {
      const height = getHeightForAccidentalSVG(svg, componentHeights.space);
      const scale = calculateScaleToHeight(svg.viewBox, height);
      const centerYOffset = getSVGCenterOffsetY(svg, height);
      const y = yPosToAbsolute(positions[i]) + centerYOffset;
      drawCanvas.drawSVG({
        paths: svg.paths,
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
    paths: beatNote.paths,
    viewBox: beatNote.viewBox,
    x,
    y: beatNoteCenterY,
    center: true,
    scale: beatNoteScale,
  });

  drawCanvas.drawSVG({
    paths: beatsPerMeasure.paths,
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
  const height = getHeightForClefInfo(svg, bodyHeight);
  const scale = calculateScaleToHeight(svg.viewBox, height);
  const centerYOffset = getSVGCenterOffsetY(svg, height);
  const x = getSectionCenterX(section);
  let y = yPosToAbsolute(svg.centerY);
  y += centerYOffset;
  drawCanvas.drawSVG({
    paths: svg.paths,
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
  repeat: function (args: MeasureSectionDrawerArgs<"repeat">): void {},
  note: function (args: MeasureSectionDrawerArgs<"note">): void {},
  repeatEndings: function (
    args: MeasureSectionDrawerArgs<"repeatEndings">
  ): void {},
};

export const getMeasureSectionDrawer = (section: MeasureSection) => {
  return sectionDrawers[section];
};

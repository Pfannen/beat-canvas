import { getClefSVG } from "@/SVG/measure/clef";
import { MeasureSectionDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";
import { getHeightForClefInfo } from "./widths";
import { calculateScaleToHeight, getSVGCenterOffsetY } from "@/utils/svg";
import { getSectionCenterX } from "..";

export const clefSectionDrawer: MeasureSectionDrawer<"clef"> = ({
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

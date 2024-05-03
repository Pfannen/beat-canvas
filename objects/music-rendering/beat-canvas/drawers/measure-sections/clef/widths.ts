import { ClefInfoSVG, getClefSVG } from "@/SVG/measure/clef";
import { Clef } from "@/types/music";
import { getSVGAspectRatio } from "@/utils/svg";

export const getHeightForClefInfo = (clef: ClefInfoSVG, bodyHeight: number) => {
  const { fractionOfBodyHeight } = clef;
  return bodyHeight * fractionOfBodyHeight;
};

export const getWidthForClefInfo = (clef: ClefInfoSVG, bodyHeight: number) => {
  const { viewBox } = clef;
  const aspectRatio = getSVGAspectRatio(viewBox);
  return aspectRatio * getHeightForClefInfo(clef, bodyHeight);
};

export const getClefWidth = (clef: Clef, bodyHeight: number) => {
  const svg = getClefSVG(clef);
  return getWidthForClefInfo(svg, bodyHeight);
};

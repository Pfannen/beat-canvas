import { ViewBox } from "@/types/svg";

export const getSVGX = (viewBox: ViewBox) => viewBox[0];
export const getSVGY = (viewBox: ViewBox) => viewBox[1];
export const getSVGWidth = (viewBox: ViewBox) => viewBox[2];
export const getSVGHeight = (viewBox: ViewBox) => viewBox[3];

export const getSVGCenter = (viewBox: ViewBox, scale = 1) => {
  const x = getSVGX(viewBox) * scale;
  const y = getSVGY(viewBox) * scale;
  const width = getSVGWidth(viewBox) * scale;
  const height = getSVGHeight(viewBox) * scale;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  return { x: centerX, y: centerY };
};

export const calculateScaleToWidth = (viewBox: ViewBox, width = 1) => {
  const svgWidth = getSVGWidth(viewBox);
  const scale = width / svgWidth;
  return scale;
};

export const calculateScaleToHeight = (viewBox: ViewBox, height = 1) => {
  const svgHeight = getSVGHeight(viewBox);
  const scale = height / svgHeight;
  return scale;
};

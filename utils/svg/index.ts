import { SVGMetadata, ViewBox } from "@/types/svg";

const X_INDEX = 0;
const Y_INDEX = 1;
const WIDTH_INDEX = 2;
const HEIGHT_INDEX = 3;

export const getSVGX = (viewBox: ViewBox) => viewBox[X_INDEX];
export const getSVGY = (viewBox: ViewBox) => viewBox[Y_INDEX];
export const getSVGWidth = (viewBox: ViewBox) => viewBox[WIDTH_INDEX];
export const getSVGHeight = (viewBox: ViewBox) => viewBox[HEIGHT_INDEX];
export const getSVGAspectRatio = (viewBox: ViewBox) =>
  getSVGWidth(viewBox) / getSVGHeight(viewBox);
export const setSVGWidth = (viewBox: ViewBox, width: number) => {
  viewBox[WIDTH_INDEX] = width;
};

export const setSVGHeight = (viewBox: ViewBox, height: number) => {
  viewBox[HEIGHT_INDEX] = height;
};

export const getSVGCenter = (viewBox: ViewBox, scale = 1) => {
  const x = getSVGX(viewBox) * scale;
  const y = getSVGY(viewBox) * scale;
  const width = getSVGWidth(viewBox) * scale;
  const height = getSVGHeight(viewBox) * scale;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  return { x: centerX, y: centerY };
};

export const getSVGTopLeft = (viewBox: ViewBox, scale: number) => {
  const x = getSVGX(viewBox) * scale;
  const y = getSVGY(viewBox) * scale;
  return { x, y };
};

export const calculateScaleToWidth = (viewBox: ViewBox, width = 1) => {
  const svgWidth = getSVGWidth(viewBox);
  const scale = width / svgWidth;
  return scale;
};

export const convertWidthScaleToHeightScale = (
  viewBox: ViewBox,
  scale: number
) => {
  const aspectRatio = getSVGAspectRatio(viewBox);
  return scale * aspectRatio;
};

// Returns the scale factor to get the desired height
export const calculateScaleToHeight = (viewBox: ViewBox, height = 1) => {
  const svgHeight = getSVGHeight(viewBox);
  const scale = height / svgHeight;
  return scale;
};

export const getSVGCenterOffsetY = (svg: SVGMetadata, height: number) => {
  return height * -svg.centerFractionOffsetY;
};

import { MeasureSectionDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";

const outerWidthFraction = 0.3;
const innerWidthFraction = 0.075;
const circleWidthFraction = 0.2;

const getOuterWidth = (sectionWidth: number) => {
  return sectionWidth * outerWidthFraction;
};

const getOuterGap = (sectionWidth: number) => {
  return getOuterWidth(sectionWidth) * 2;
};

const getInnerWidth = (sectionWidth: number) => {
  return sectionWidth * innerWidthFraction;
};

const getInnerGap = (sectionWidth: number) => {
  return getInnerWidth(sectionWidth) * 5;
};

const getCircleDiameter = (sectionWidth: number) => {
  return sectionWidth * circleWidthFraction;
};

export const forwardRepeatSectionDrawer: MeasureSectionDrawer<
  "forwardRepeat"
> = ({ drawCanvas, bodyHeight, section, yPosToAbsolute, componentHeights }) => {
  const y = yPosToAbsolute(0) - componentHeights.line / 2;
  let x = section.startX;
  const outerWidth = getOuterWidth(section.width);
  const innerWidth = getInnerWidth(section.width);
  const circleDiameter = getCircleDiameter(section.width);

  drawCanvas.drawRectangle({
    corner: { x, y },
    width: outerWidth,
    height: bodyHeight,
  });
  x += getOuterGap(section.width);

  drawCanvas.drawRectangle({
    corner: { x, y },
    width: innerWidth,
    height: bodyHeight,
  });
  x += getInnerGap(section.width);

  drawCanvas.drawEllipse({
    center: { x, y: yPosToAbsolute(5) },
    diameter: circleDiameter,
    aspectRatio: 1,
  });
  drawCanvas.drawEllipse({
    center: { x, y: yPosToAbsolute(3) },
    diameter: circleDiameter,
    aspectRatio: 1,
  });
};

export const backwardRepeatSectionDrawer: MeasureSectionDrawer<
  "backwardRepeat"
> = ({ drawCanvas, bodyHeight, section, yPosToAbsolute, componentHeights }) => {
  const y = yPosToAbsolute(0) - componentHeights.line / 2;
  let x = section.startX;
  const outerWidth = getOuterWidth(section.width);
  const innerWidth = getInnerWidth(section.width);
  const circleDiameter = getCircleDiameter(section.width);

  drawCanvas.drawEllipse({
    center: { x, y: yPosToAbsolute(5) },
    diameter: circleDiameter,
    aspectRatio: 1,
  });
  drawCanvas.drawEllipse({
    center: { x, y: yPosToAbsolute(3) },
    diameter: circleDiameter,
    aspectRatio: 1,
  });

  x += getInnerGap(section.width);
  drawCanvas.drawRectangle({
    corner: { x, y },
    width: innerWidth,
    height: bodyHeight,
  });

  x += getOuterGap(section.width);
  drawCanvas.drawRectangle({
    corner: { x, y },
    width: outerWidth,
    height: bodyHeight,
  });
};

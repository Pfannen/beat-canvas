import { ComponentFractions } from "./note-position";

export type MeasureUnit = "xPos" | "yPos" | "height" | "width";

type Converter = (value: number, details: ConverterArgs) => number;

type ConverterArgs = {
  widthHeightRatio: number;
  segmentFraction: number;
  height: number;
  getYOffset: (yPos: number) => number;
  componentFractions: ComponentFractions;
};

export class MeasureUnitConverter {
  private converterArgs: ConverterArgs;
  constructor(measureDetails: ConverterArgs) {
    this.converterArgs = measureDetails;
  }
  public convert(unitOne: MeasureUnit, unitTwo: MeasureUnit, value: number) {
    const heightValue = unitToHeight[unitOne](value, this.converterArgs);
    const unitValue = heightToUnit[unitTwo](heightValue, this.converterArgs);
    return unitValue;
  }
}

const unitToHeight: { [unit in MeasureUnit]: Converter } = {
  xPos: (xPos, d) => {
    const widthFraction = xPos * d.segmentFraction;
    const measureWidth = heightToUnit["width"](d.height, d);
    const widthOffset = widthFraction * measureWidth;
    return unitToHeight["width"](widthOffset, d);
  },
  yPos: (yPos, { height, getYOffset }) => {
    return getYOffset(yPos) * height;
  },
  height: (height) => height,
  width: (width, { widthHeightRatio }) => width * (1 / widthHeightRatio), //1 / wH * W = H
};

const heightToUnit: { [unit in MeasureUnit]: Converter } = {
  xPos: (height, d) => {
    const width = heightToUnit["width"](height, d);
    const totalWidth = heightToUnit["width"](d.height, d);
    const segmentLength = totalWidth * d.segmentFraction;
    const xPos = width / segmentLength;
    return xPos;
  },
  yPos: (heightValue, { height, getYOffset, componentFractions }) => {
    const spaceHeight = height * componentFractions.space;
    const lineHeight = height * componentFractions.line;
    const spaceCount = Math.floor(heightValue / spaceHeight);
    const lineCount = Math.floor(heightValue / lineHeight);
    const yPosWhole = spaceCount + lineCount;
    const componentHeight = height * getYOffset(yPosWhole);
    const remainder = heightValue - componentHeight;
    return yPosWhole + remainder;
  },
  height: (height) => height,
  width: (height, { widthHeightRatio }) => height * widthHeightRatio, //wH * H = W
};

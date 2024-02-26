import { ComponentFractions } from "./note-position";

export type MeasureUnit = "xPos" | "yPos" | "measureUnit";

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
    const heightValue = unitToMeasureUnit[unitOne](value, this.converterArgs);
    const unitValue = measureUnitToUnit[unitTwo](
      heightValue,
      this.converterArgs
    );
    return unitValue;
  }

  public percentOfWidth(measureUnitValue: number) {
    return (
      measureUnitValue /
      getMeasureWidth(
        this.converterArgs.height,
        this.converterArgs.widthHeightRatio
      )
    );
  }

  public percentOfHeight(measureUnitValue: number) {
    return measureUnitValue / this.converterArgs.height;
  }
}

const unitToMeasureUnit: { [unit in MeasureUnit]: Converter } = {
  xPos: (xPos, d) => {
    const widthFraction = xPos * d.segmentFraction;
    const measureWidth = getMeasureWidth(d.height, d.widthHeightRatio);
    const measureUnitOffset = widthFraction * measureWidth;
    return measureUnitOffset;
  },
  yPos: (yPos, { height, getYOffset }) => {
    return getYOffset(yPos) * height;
  },
  measureUnit: (mUVal) => mUVal,
};

const measureUnitToUnit: { [unit in MeasureUnit]: Converter } = {
  xPos: (mUVal, d) => {
    const totalWidth = getMeasureWidth(d.height, d.widthHeightRatio);
    const segmentLength = totalWidth * d.segmentFraction;
    const xPos = mUVal / segmentLength;
    return xPos;
  },
  yPos: (mUVal, { height, getYOffset, componentFractions }) => {
    // const spaceHeight = height * componentFractions.space;
    // const lineHeight = height * componentFractions.line;
    // const spaceCount = Math.floor(mUVal / spaceHeight);
    // const lineCount = Math.floor(mUVal / lineHeight);
    // const yPosWhole = spaceCount + lineCount;
    // const componentHeight = height * getYOffset(yPosWhole);
    // const remainder = mUVal - componentHeight;
    // return yPosWhole + remainder;
    throw new Error("measureUnit to yPos is needed?");
  },
  measureUnit: (mUVal) => mUVal,
};

const getMeasureWidth = (height: number, widthHeightRatio: number) =>
  height * widthHeightRatio; //wH * H = W

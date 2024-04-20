import { MeasureOutline } from "./measure-outline";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import {
  MeasureTimeSignautreCallback,
  MeasureWidthCallback,
} from "@/types/music";
import { serializeTimeSignature } from "@/utils/music";
import { IterateMeasuresCallback } from "@/types/music-rendering/measure-manager";

type TimeSignatureWidths = { [timeSig: string]: number };

export class MeasureManager {
  private measureCount: number;
  private dimensionData: MusicDimensionData;
  private measureOutline: MeasureOutline;
  private getMeasureTimeSignature: MeasureTimeSignautreCallback;
  private getMeasureWidth: MeasureWidthCallback;
  private pxTolerence = 1;
  constructor(
    measureCount: number,
    dimensionData: MusicDimensionData,
    getMeasureWidth: MeasureWidthCallback,
    getMeasureTimeSignature: MeasureTimeSignautreCallback
  ) {
    this.measureCount = measureCount;
    this.dimensionData = dimensionData;
    this.measureOutline = new MeasureOutline(
      this.dimensionData.pageDimensions.firstMeasureStart
    );
    this.getMeasureTimeSignature = getMeasureTimeSignature;
    this.getMeasureWidth = getMeasureWidth;
    // const x = this.dimensionData.pageDimensions.firstMeasureStart.x;
    // const y = this.dimensionData.pageDimensions.firstMeasureStart.y;
    // this.measureOutline.addPage(x, y, false);
  }

  // Note: This doesn't take into account a measure who has a greater width due to time signature display, etc... (would need to know note display size and measure container size separately)
  private setMeasureWidths(widths: TimeSignatureWidths) {
    const cb: IterateMeasuresCallback = (args, measureIndex) => {
      const globalIndex = args.startMeasureIndex + measureIndex;
      const timeSignature = this.getMeasureTimeSignature(globalIndex);
      const serializedTimeSignature = serializeTimeSignature(timeSignature);
      const width = widths[serializedTimeSignature];
      args.setMeasureWidth(measureIndex, width);
    };
    this.measureOutline.iterateCurrentLine(cb);
  }

  private addWidthToMeasures(width: number) {
    const cb: IterateMeasuresCallback = (args, measureIndex) => {
      const widthToAdd = width / args.measureCount;
      const currentWidth = args.getMeasureWidth(measureIndex);
      const measureWidth = currentWidth + widthToAdd;
      args.setMeasureWidth(measureIndex, measureWidth);
    };
    this.measureOutline.iterateCurrentLine(cb);
  }

  private getFirstLineWidth() {
    const { pageDimensions } = this.dimensionData;
    const { musicMargins } = pageDimensions;
    let contentSpace =
      pageDimensions.width - (musicMargins.left + musicMargins.right);

    contentSpace -= pageDimensions.firstMeasureStart.x - musicMargins.left;

    return contentSpace;
  }

  private getLineWidth() {
    const { pageDimensions } = this.dimensionData;
    const { musicMargins } = pageDimensions;
    return pageDimensions.width - (musicMargins.left + musicMargins.right);
  }

  private getMeasureInfo(measureIndex: number) {
    const timeSignature = this.getMeasureTimeSignature(measureIndex);
    const width = this.getMeasureWidth(measureIndex);
    return { width, timeSignature };
  }

  private createNewLine(currentY: number) {
    const { pageDimensions, measureDimensions } = this.dimensionData;
    const pageYEnd = pageDimensions.musicMargins.bottom;
    const newLineXStart = pageDimensions.musicMargins.left;
    let nextLineYStart = currentY - measureDimensions.height;
    const nextLineYEnd = nextLineYStart - measureDimensions.height;
    if (nextLineYEnd < Math.floor(pageYEnd)) {
      nextLineYStart = pageDimensions.height - pageDimensions.musicMargins.top;
      this.measureOutline.addPage(newLineXStart, nextLineYStart);
    }
    this.measureOutline.addLine(newLineXStart, nextLineYStart);
    const startCoordinate = { x: newLineXStart, y: nextLineYStart };
    return startCoordinate;
  }

  private getWidthInfo(
    width: number,
    timeSig: string,
    maxMeasureWidths: TimeSignatureWidths
  ) {
    let updateWidths = false;
    const maxWidth = maxMeasureWidths[timeSig];
    if (width <= maxWidth) {
      width = maxWidth;
    } else {
      if (maxWidth !== undefined) {
        updateWidths = true;
      }
      maxMeasureWidths[timeSig] = width;
    }

    return { width, updateWidths };
  }

  public getMeasureData(measureIndex: number) {
    return this.measureOutline.getMeasureData(measureIndex);
  }

  public compute() {
    const { pageDimensions } = this.dimensionData;
    let currentCoordinate = { ...pageDimensions.firstMeasureStart };
    let remainingWidth = this.getFirstLineWidth();
    let maxMeasureWidths: TimeSignatureWidths = {};
    for (let i = 0; i < this.measureCount; i++) {
      let { width, timeSignature } = this.getMeasureInfo(i);
      const serialTimeSig = serializeTimeSignature(timeSignature);
      let createNewLine = false;
      if (!isWithinTolerence(remainingWidth, width, this.pxTolerence)) {
        createNewLine = true;
      } else {
        const { width: maxWidth, updateWidths } = this.getWidthInfo(
          width,
          serialTimeSig,
          maxMeasureWidths
        );
        if (!isWithinTolerence(remainingWidth, maxWidth, this.pxTolerence)) {
          createNewLine = true;
        } else {
          if (updateWidths) {
            this.setMeasureWidths(maxMeasureWidths);
          }
          width = maxWidth;
        }
      }
      if (createNewLine) {
        this.addWidthToMeasures(remainingWidth);
        const startCoordinate = this.createNewLine(currentCoordinate.y);

        currentCoordinate = startCoordinate;
        remainingWidth = this.getLineWidth();
        maxMeasureWidths = { [serialTimeSig]: width };
      }
      this.measureOutline.addMeasure(width);
      currentCoordinate.x += width;
      remainingWidth -= width;
    }
    this.measureOutline.commitCurrentLine();
  }
}

const isWithinTolerence = (
  valOne: number,
  valTwo: number,
  tolerence: number
) => {
  const difference = valOne - valTwo;
  if (difference < 0) return tolerence > -difference;
  return true;
};

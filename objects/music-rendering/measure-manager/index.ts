import { IterateMeasuresCallback, MeasureOutline } from "./measure-outline";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import {
  MeasureTimeSignautreCallback,
  MeasureWidthCallback,
} from "@/types/music";
import { serializeTimeSignature } from "@/utils/music";

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
    const { height } = this.dimensionData.measureDimensions;
    this.measureOutline = new MeasureOutline(height);
    this.getMeasureTimeSignature = getMeasureTimeSignature;
    // const firstMeasureTimeSig = getMeasureTimeSignature(0);
    this.getMeasureWidth = getMeasureWidth;
    // this.widthCalculator = new MeasureWidthCalculator(
    //   width,
    //   firstMeasureTimeSig
    // ); //Assuming 'width' is based on the time signature of first measure (maybe not the best idea? change later)
    this.measureOutline.addPage();
    const x = this.dimensionData.pageDimensions.firstMeasureStart.x;
    const y = this.dimensionData.pageDimensions.firstMeasureStart.y;
    this.measureOutline.addLine(x, y);
  }

  // Note: This doesn't take into account a measure who has a greater width due to time signature display, etc... (would need to know note display size and measure container size separately)
  private setMeasureWidths(
    widths: TimeSignatureWidths,
    pageNumber: number,
    lineNumber: number
  ) {
    const cb: IterateMeasuresCallback = (args, measureIndex) => {
      const globalIndex = args.startMeasureIndex + measureIndex;
      const timeSignature = this.getMeasureTimeSignature(globalIndex);
      const serializedTimeSignature = serializeTimeSignature(timeSignature);
      const width = widths[serializedTimeSignature];
      args.setMeasureWidth(measureIndex, width);
    };
    this.measureOutline.iterateMeasures(pageNumber, lineNumber, cb);
  }

  private addWidthToMeasures(
    width: number,
    pageNumber: number,
    lineNumber: number
  ) {
    const cb: IterateMeasuresCallback = (args, measureIndex) => {
      const widthToAdd = width / args.measureCount;
      const currentWidth = args.getMeasureWidth(measureIndex);
      const measureWidth = currentWidth + widthToAdd;
      args.setMeasureWidth(measureIndex, measureWidth);
    };
    this.measureOutline.iterateMeasures(pageNumber, lineNumber, cb);
  }

  private getLineWidth(pageNumber: number, lineNumber: number) {
    const { pageDimensions } = this.dimensionData;
    const { musicMargins } = pageDimensions;
    let contentSpace =
      pageDimensions.width - (musicMargins.left + musicMargins.right);
    if (pageNumber === 1 && lineNumber === 1) {
      contentSpace -= pageDimensions.firstMeasureStart.x - musicMargins.left;
    }
    return contentSpace;
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
    let isNewPage = false;
    if (nextLineYEnd < Math.floor(pageYEnd)) {
      nextLineYStart = pageDimensions.height - pageDimensions.musicMargins.top;
      this.measureOutline.addPage();
      isNewPage = true;
    }
    this.measureOutline.addLine(newLineXStart, nextLineYStart);
    const startCoordinate = { x: newLineXStart, y: nextLineYStart };
    return { startCoordinate, isNewPage };
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
    let currentCoordinate = pageDimensions.firstMeasureStart;
    let pageNumber = 1;
    let lineNumber = 1;
    let remainingWidth = this.getLineWidth(pageNumber, lineNumber);
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
            this.setMeasureWidths(maxMeasureWidths, pageNumber, lineNumber);
          }
          width = maxWidth;
        }
      }
      if (createNewLine) {
        this.addWidthToMeasures(remainingWidth, pageNumber, lineNumber);
        const { startCoordinate, isNewPage } = this.createNewLine(
          currentCoordinate.y
        );
        lineNumber++;
        if (isNewPage) {
          pageNumber++;
          lineNumber = 1;
        }
        currentCoordinate = startCoordinate;
        remainingWidth = this.getLineWidth(pageNumber, lineNumber);
        maxMeasureWidths = { [serialTimeSig]: width };
      }
      this.measureOutline.addMeasure(currentCoordinate.x, width);
      currentCoordinate.x += width;
      remainingWidth -= width;
    }
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

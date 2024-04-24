import { MeasureOutline } from "./measure-outline";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import {
  IterateMeasuresCallback,
  MeasureSectionData,
  MeasureSections,
} from "@/types/music-rendering/measure-manager";
import { MeasureSection } from "@/types/music";
import { TimeSignature } from "@/components/providers/music/types";
import { Coordinate } from "@/types";

export class MeasureManager {
  protected dimensionData: MusicDimensionData;
  protected measureOutline: MeasureOutline<MeasureSections>;
  private measureIndexToNoteSectionIndex: Record<number, number> = {};
  private widthOnLine: number;
  private startCoordinate: Coordinate;
  protected pxTolerence = 1;
  constructor(dimensionData: MusicDimensionData) {
    this.dimensionData = dimensionData;
    this.measureOutline = new MeasureOutline(
      this.dimensionData.pageDimensions.firstMeasureStart
    );
    this.widthOnLine = this.getFirstLineWidth();
    this.startCoordinate = this.dimensionData.pageDimensions.firstMeasureStart;
    // const x = this.dimensionData.pageDimensions.firstMeasureStart.x;
    // const y = this.dimensionData.pageDimensions.firstMeasureStart.y;
    // this.measureOutline.addPage(x, y, false);
  }

  private getMeasureWidths(...sections: MeasureSectionData<any>[]) {
    let displayWidth = 0;
    let nonDisplayWidth = 0;
    sections.forEach((section) => {
      if (section.display) displayWidth += section.width;
      else nonDisplayWidth += section.width;
    });
    return { displayWidth, nonDisplayWidth };
  }

  private isRoomOnLine(width: number) {
    return MeasureManager.isWithinTolerence(
      width,
      this.widthOnLine,
      this.pxTolerence
    );
  }

  protected addMeasure(
    measureIndex: number,
    noteSection: MeasureSectionData<undefined>,
    keySigSection: MeasureSectionData<number>,
    timeSigSection?: MeasureSectionData<TimeSignature>
  ) {
    const { displayWidth, nonDisplayWidth } = this.getMeasureWidths(
      noteSection,

      keySigSection
    );
    if (this.isRoomOnLine(displayWidth)) {
    } else {
      this.commitCurrentLine();
      //Get first-measure sections (clef, key)
      //Get before note display sections (timesig?)
      // Get note section
      // Get after note sections (repeat?)
      this.measureOutline.addMeasure(displayWidth, [{key: "clef", width: }])
    }
  }

  // Note: This doesn't take into account a measure who has a greater width due to time signature display, etc... (would need to know note display size and measure container size separately)
  // protected setMeasureWidths(width: number) {
  //   const cb: IterateMeasuresCallback = (args, measureIndex) => {
  //     const noteSectionIndex =
  //       this.measureIndexToNoteSectionIndex[measureIndex];
  //     args.updateSectionWidth(measureIndex, noteSectionIndex, width);
  //   };
  //   this.measureOutline.iterateCurrentLine(cb);
  // }

  private commitCurrentLine() {
    const cb: IterateMeasuresCallback = (args, measureIndex) => {
      const globalIndex = args.startMeasureIndex + measureIndex;
      const widthToAdd = this.widthOnLine / args.measureCount;
      const noteSectionIndex = this.measureIndexToNoteSectionIndex[globalIndex];
      args.addToSectionWidth(measureIndex, noteSectionIndex, widthToAdd);
    };
    this.measureOutline.iterateCurrentLine(cb);
    this.createNewLine();
    this.measureIndexToNoteSectionIndex = {};
  }

  private createNewLine() {
    const currentY = this.startCoordinate.y;
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
    this.startCoordinate = { x: newLineXStart, y: nextLineYStart };
  }

  // protected addWidthToMeasures(width: number) {
  //   const cb: IterateMeasuresCallback = (args, measureIndex) => {
  //     const widthToAdd = width / args.measureCount;
  //     const currentWidth = args.getMeasureWidth(measureIndex);
  //     const measureWidth = currentWidth + widthToAdd;
  //     args.setMeasureWidth(measureIndex, measureWidth);
  //   };
  //   this.measureOutline.iterateCurrentLine(cb);
  // }

  protected getFirstLineWidth() {
    const { pageDimensions } = this.dimensionData;
    const { musicMargins } = pageDimensions;
    let contentSpace =
      pageDimensions.width - (musicMargins.left + musicMargins.right);

    contentSpace -= pageDimensions.firstMeasureStart.x - musicMargins.left;

    return contentSpace;
  }

  protected getLineWidth() {
    const { pageDimensions } = this.dimensionData;
    const { musicMargins } = pageDimensions;
    return pageDimensions.width - (musicMargins.left + musicMargins.right);
  }

  private getWidthInfo(width: number, timeSig: string) {
    let updateWidths = false;
    const maxWidth = this.timeSignatureWidths[timeSig];
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

  protected static isWithinTolerence = (
    valOne: number,
    valTwo: number,
    tolerence: number
  ) => {
    const difference = valOne - valTwo;
    if (difference < 0) return tolerence > -difference;
    return true;
  };

  public getMeasureData(measureIndex: number) {
    return this.measureOutline.getMeasureData(measureIndex);
  }
}

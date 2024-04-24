import {
  MeasureTimeSignautreCallback,
  MeasureWidthCallback,
} from "@/types/music";
import { MeasureManager } from ".";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";

export class IterativeMeasureManager extends MeasureManager {
  private measureCount: number;
  private getMeasureTimeSignature: MeasureTimeSignautreCallback;
  private getMeasureWidth: MeasureWidthCallback;
  constructor(
    dimensionData: MusicDimensionData,
    measureCount: number,
    getMeasureWidth: MeasureWidthCallback,
    getMeasureTimeSignature: MeasureTimeSignautreCallback
  ) {
    super(dimensionData);
    this.measureCount = measureCount;
    this.getMeasureWidth = getMeasureWidth;
    this.getMeasureTimeSignature = getMeasureTimeSignature;
  }
  private getMeasureInfo(measureIndex: number) {
    const timeSignature = this.getMeasureTimeSignature(measureIndex);
    const width = this.getMeasureWidth(measureIndex);
    return { width, timeSignature };
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
      this.measureOutline.addMeasure(width, [
        { key: "notes", width, metadata: undefined },
      ]);
      currentCoordinate.x += width;
      remainingWidth -= width;
    }
    this.measureOutline.commitCurrentLine();
  }
}

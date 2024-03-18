import { Coordinate } from "@/objects/measurement/types";
import { MeasureDrawData } from "@/types/music-rendering";

type MeasureLine = {
  endPoint: Coordinate;
  startMeasureIndex: number;
  measures: number[];
};

type MeasureIndexData = {
  pageNumber: number;
  lineNumber: number;
  index: number;
};

export type IterateMeasuresArgs = {
  startMeasureIndex: number;
  overrideMeasureWidth: (index: number, width: number) => void;
  getMeasureWidth: (index: number) => number;
};

export type IterateMeasuresCallback = (
  args: IterateMeasuresArgs,
  measureIndex: number
) => void;

export class MeasureOutline {
  private measureHeight: number;
  private pages: MeasureLine[][] = [];
  private measureIndexData = new Map<number, MeasureIndexData>();
  constructor(measureHeight = 0) {
    this.measureHeight = measureHeight;
  }

  private getPage(pageNumber: number) {
    return this.pages[pageNumber - 1];
  }

  private getPageLine(pageNumber: number, lineNumber: number) {
    const page = this.getPage(pageNumber);
    return page[lineNumber - 1];
  }

  private getLastPage() {
    const pageCount = this.pages.length;
    if (!pageCount) throw new Error("MeasureOutline: No pages");
    return this.pages[this.pages.length - 1];
  }

  private getLastLine() {
    const lastPage = this.getLastPage();
    const lineCount = lastPage.length;
    if (!lineCount) throw new Error("MeasureOutline: No lines in last page");
    return lastPage[lastPage.length - 1];
  }

  private createEmptyLine(
    endPoint: Coordinate,
    startMeasureIndex: number
  ): MeasureLine {
    return { endPoint, startMeasureIndex, measures: [] };
  }

  private getMeasureCoordinates(
    line: MeasureLine,
    measureIndex: number
  ): { start: Coordinate; end: Coordinate } {
    const measureCount = line.measures.length;
    const startXPos = line.measures[measureIndex];
    let endXPos = line.endPoint.x;
    if (measureIndex < measureCount - 1) {
      endXPos = line.measures[measureIndex + 1];
    }
    return {
      start: { x: startXPos, y: line.endPoint.y },
      end: { x: endXPos, y: line.endPoint.y },
    };
  }

  public addPage() {
    this.pages.push([]);
  }

  public addLine(xPos: number, yPos?: number) {
    //If there was "addLineToPage", would need to recompute start measure indicies (don't see a need for that functionality)
    const lastPage = this.getLastPage();
    const prevLine = lastPage[lastPage.length - 1];
    if (yPos === undefined) {
      const prevLineY = prevLine?.endPoint.y || 0;
      yPos = prevLineY + this.measureHeight;
    }
    const startMeasureIndex =
      prevLine.startMeasureIndex + prevLine.measures.length;
    lastPage.push(
      this.createEmptyLine({ x: xPos, y: yPos }, startMeasureIndex)
    );
  }

  public addMeasure(startXPos: number) {
    const pageNumber = this.pages.length;
    const page = this.getLastPage();
    const lineNumber = page.length - 1;
    const lastLine = page[lineNumber - 1];
    lastLine.measures.push(startXPos);
    const index = lastLine.measures.length - 1;
    const measureIndex = lastLine.startMeasureIndex + index;
    this.measureIndexData.set(measureIndex, { pageNumber, lineNumber, index });
  }

  private overrideMeasure(
    line: MeasureLine,
    measureIndex: number,
    width: number
  ) {
    const measureCount = line.measures.length;
    if (measureIndex < measureCount - 1) {
      line.measures[measureIndex + 1] = line.measures[measureIndex] + width;
    } else {
      line.endPoint.x = line.measures[measureIndex] + width;
    }
  }

  /// Does not preserve other measure's widths but sets the measure at 'measureIndex' to the desired width
  public overrideMeasureWidth(
    pageNumber: number,
    lineNumber: number,
    measureIndex: number,
    width: number
  ) {
    const line = this.getPageLine(pageNumber, lineNumber);
    this.overrideMeasure(line, measureIndex, width);
  }

  private getWidth(line: MeasureLine, measureIndex: number) {
    const { start, end } = this.getMeasureCoordinates(line, measureIndex);
    return end.x - start.x;
  }

  public getMeasureWidth(
    pageNumber: number,
    lineNumber: number,
    measureIndex: number
  ) {
    const line = this.getPageLine(pageNumber, lineNumber);
    return this.getWidth(line, measureIndex);
  }

  public iterateMeasures(
    pageNumber: number,
    lineNumber: number,
    cb: IterateMeasuresCallback
  ) {
    const line = this.getPageLine(pageNumber, lineNumber);
    const args: IterateMeasuresArgs = {
      startMeasureIndex: line.startMeasureIndex,
      getMeasureWidth: this.getWidth.bind(this, line),
      overrideMeasureWidth: this.overrideMeasure.bind(this, line),
    };
    line.measures.forEach((_, i) => cb(args, i));
  }

  public getMeasureData(
    measureIndex: number,
    measureHeight?: number
  ): MeasureDrawData {
    const indexData = this.measureIndexData.get(measureIndex);
    if (!indexData) {
      throw new Error(`MeasureOutline: Invalid measure index ${measureIndex}`);
    }
    const line = this.getPageLine(indexData.pageNumber, indexData.lineNumber);
    const { start, end } = this.getMeasureCoordinates(line, indexData.index);
    const width = end.x - start.x;
    const aspectRatio = width / (measureHeight || this.measureHeight || 1);
    return { start, end, width, aspectRatio };
  }
}

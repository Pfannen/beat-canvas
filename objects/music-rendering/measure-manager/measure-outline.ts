import { Coordinate } from "@/objects/measurement/types";
import { MeasureDrawData } from "@/types/music-rendering";
import {
  IterateMeasuresArgs,
  IterateMeasuresCallback,
  MeasureIndexData,
  MeasureLine,
} from "@/types/music-rendering/measure-manager";

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

  private getNextMeasureIndex() {
    const lastPageNumber = this.pages.length;
    const lastPage = this.getPage(lastPageNumber);
    let lastLine;
    if (lastPage.length === 0) {
      const nextToLastPage = this.getPage(lastPageNumber - 1);
      if (nextToLastPage) {
        lastLine = nextToLastPage[nextToLastPage.length - 1];
      } else {
        return 0;
      }
    } else {
      lastLine = lastPage[lastPage.length - 1];
    }
    return lastLine.startMeasureIndex + lastLine.measures.length;
  }

  public addPage() {
    this.pages.push([]);
  }

  public addLine(xPos: number, yPos: number) {
    //If there was "addLineToPage", would need to recompute start measure indicies (don't see a need for that functionality)
    const lastPage = this.getLastPage();
    const startMeasureIndex = this.getNextMeasureIndex();
    lastPage.push(
      this.createEmptyLine({ x: xPos, y: yPos }, startMeasureIndex)
    );
  }

  public addMeasure(startXPos: number, width: number) {
    const pageNumber = this.pages.length;
    const page = this.getLastPage();
    const lineNumber = page.length;
    const lastLine = page[lineNumber - 1];
    lastLine.measures.push(startXPos);
    lastLine.endPoint.x = startXPos + width;
    const index = lastLine.measures.length - 1;
    const measureIndex = lastLine.startMeasureIndex + index;
    this.measureIndexData.set(measureIndex, { pageNumber, lineNumber, index });
  }

  private _setMeasureWidth(
    line: MeasureLine,
    measureIndex: number,
    width: number
  ) {
    const currentWidth = this.getWidth(line, measureIndex);
    const extraWidth = width - currentWidth;
    const measureCount = line.measures.length;
    line.endPoint.x += extraWidth;
    for (let i = measureCount - 1; i > measureIndex; i--) {
      line.measures[i] += extraWidth;
    }
  }

  /// Does not preserve other measure's widths but sets the measure at 'measureIndex' to the desired width
  public setMeasureWidth(
    pageNumber: number,
    lineNumber: number,
    measureIndex: number,
    width: number
  ) {
    const line = this.getPageLine(pageNumber, lineNumber);
    this._setMeasureWidth(line, measureIndex, width);
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
      measureCount: line.measures.length,
      getMeasureWidth: this.getWidth.bind(this, line),
      setMeasureWidth: this._setMeasureWidth.bind(this, line),
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
    return { start, end, width, aspectRatio, pageNumber: indexData.pageNumber };
  }
}

import { Coordinate } from "@/objects/measurement/types";
import { MeasureDrawData } from "@/types/music-rendering";
import {
  IterateMeasuresArgs,
  IterateMeasuresCallback,
  MeasureIndexData,
  MeasureLine,
  MeasureLineMeasure,
  UncommittedLine,
} from "@/types/music-rendering/measure-manager";

export class MeasureOutline<T = any> {
  private pages: MeasureLine<T>[][] = [[]];
  private measureIndexData = new Map<number, MeasureIndexData>();
  private currentLine?: UncommittedLine<T>;

  constructor(firstLineStart: Coordinate, startMeasureIndex = 0) {
    this.currentLine = this.createEmptyLine(firstLineStart, startMeasureIndex);
  }

  private getLastPageNumber() {
    return this.pages.length;
  }

  private getLastLineNumberForPage(pageNumber: number) {
    return this.pages[pageNumber - 1].length;
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

  private checkCurrentLine() {
    if (!this.currentLine) {
      throw new Error("MeasureOutline: No current line");
    }
  }

  private createEmptyLine(
    startPoint: Coordinate,
    startMeasureIndex: number
  ): UncommittedLine<T> {
    return { startPoint, startMeasureIndex, measures: [] };
  }

  public commitCurrentLine() {
    const pageNumber = this.getLastPageNumber();
    const lineNumber = this.getLastLineNumberForPage(pageNumber) + 1;
    const committedLine = this.commitMeasures(pageNumber, lineNumber);
    if (committedLine) {
      const lastPage = this.getLastPage();

      lastPage.push(committedLine);
      this.currentLine = undefined;
    }
  }

  private commitMeasures(pageNumber: number, lineNumber: number) {
    if (this.currentLine) {
      let { x, y } = this.currentLine.startPoint;

      const measures = this.currentLine.measures.map((measure, index) => {
        const measureIndex = this.currentLine!.startMeasureIndex + index;
        this.measureIndexData.set(measureIndex, {
          pageNumber,
          lineNumber,
          index,
        });
        x += measure.width;
        return {
          startX: x - measure.width,
          metadata: measure.metadata,
        } as MeasureLineMeasure<T>;
      });

      return {
        endPoint: { x, y },
        measures,
        startMeasureIndex: this.currentLine.startMeasureIndex,
      } as MeasureLine<T>;
    }
  }

  private getMeasureCoordinates(
    line: MeasureLine<T>,
    measureIndex: number
  ): { start: Coordinate; end: Coordinate } {
    const measureCount = line.measures.length;
    const startXPos = line.measures[measureIndex].startX;
    let endXPos = line.endPoint.x;
    if (measureIndex < measureCount - 1) {
      endXPos = line.measures[measureIndex + 1].startX;
    }
    return {
      start: { x: startXPos, y: line.endPoint.y },
      end: { x: endXPos, y: line.endPoint.y },
    };
  }

  private getNextMeasureIndex() {
    const lastPageNumber = this.getLastPageNumber();
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

  public addPage(lineXPos: number, lineYPos: number) {
    this.commitCurrentLine();
    this.pages.push([]);
    this.addLine(lineXPos, lineYPos);
  }

  public addLine(xPos: number, yPos: number) {
    //If there was "addLineToPage", would need to recompute start measure indicies (don't see a need for that functionality)
    this.commitCurrentLine();
    const startMeasureIndex = this.getNextMeasureIndex(); //Maybe store this in the metadata
    this.currentLine = this.createEmptyLine(
      { x: xPos, y: yPos },
      startMeasureIndex
    );
  }

  public addMeasure(width: number, metadata?: T) {
    this.checkCurrentLine();
    this.currentLine!.measures.push({ width, metadata });
  }

  private getCommittedMeasureWidth(line: MeasureLine<T>, measureIndex: number) {
    const { start, end } = this.getMeasureCoordinates(line, measureIndex);
    return end.x - start.x;
  }

  private static setUncommittedMeasureWidth(
    line: UncommittedLine<any>,
    measureIndex: number,
    newWidth: number
  ) {
    line.measures[measureIndex].width = newWidth;
  }

  private static getUncommittedMeasureWidth(
    line: UncommittedLine<any>,
    measureIndex: number
  ) {
    return line.measures[measureIndex].width;
  }

  public getMeasureWidth(
    pageNumber: number,
    lineNumber: number,
    measureIndex: number
  ) {
    const line = this.getPageLine(pageNumber, lineNumber);
    return this.getCommittedMeasureWidth(line, measureIndex);
  }

  public iterateCurrentLine(cb: IterateMeasuresCallback) {
    this.checkCurrentLine();
    const line = this.currentLine as UncommittedLine<T>;
    const args: IterateMeasuresArgs = {
      startMeasureIndex: line!.startMeasureIndex,
      measureCount: line!.measures.length,
      getMeasureWidth: MeasureOutline.getUncommittedMeasureWidth.bind(
        this,
        line
      ),
      setMeasureWidth: MeasureOutline.setUncommittedMeasureWidth.bind(
        this,
        line
      ),
    };
    line!.measures.forEach((_, i) => cb(args, i));
  }

  public getMeasureData(measureIndex: number): MeasureDrawData {
    const indexData = this.measureIndexData.get(measureIndex);
    if (!indexData) {
      throw new Error(`MeasureOutline: Invalid measure index ${measureIndex}`);
    }
    const line = this.getPageLine(indexData.pageNumber, indexData.lineNumber);
    const { start, end } = this.getMeasureCoordinates(line, indexData.index);
    const width = end.x - start.x;
    return { start, end, width, pageNumber: indexData.pageNumber };
  }
}

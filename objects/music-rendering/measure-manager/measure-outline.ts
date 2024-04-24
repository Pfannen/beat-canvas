import { Coordinate } from "@/types";
import {
  CoordinateSectionArray,
  IterateMeasuresArgs,
  IterateMeasuresCallback,
  MeasureIndexData,
  MeasureLine,
  MeasureLineMeasure,
  SectionArray,
  UncommittedLine,
} from "@/types/music-rendering/measure-manager/measure-outline";

export class MeasureOutline<T extends string> {
  private pages: MeasureLine<CoordinateSectionArray<T>>[][] = [[]];
  private measureIndexData = new Map<number, MeasureIndexData>();
  private measureIndexToSectionIndex = new Map<number, Record<T, number>>();
  private currentLine?: UncommittedLine<SectionArray<T>>;

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
  ): UncommittedLine<SectionArray<T>> {
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

  private convertSections(startX: number, sectionArray?: SectionArray<T>) {
    if (sectionArray) {
      const sections: CoordinateSectionArray<T> = [];
      sectionArray.forEach((section) => {
        sections.push({ ...section, startX });
        startX += section.width;
      });
      return sections;
    }
  }

  private commitMeasures(pageNumber: number, lineNumber: number) {
    if (this.currentLine) {
      let { x, y } = this.currentLine.startPoint;

      const measures = this.currentLine.measures.map((measure, index) => {
        const measureIndex = this.currentLine!.startMeasureIndex + index;
        const sections = this.convertSections(x, measure.sections);

        this.measureIndexData.set(measureIndex, {
          pageNumber,
          lineNumber,
          index,
        });

        x += measure.width;
        const committedMeasure: MeasureLineMeasure<CoordinateSectionArray<T>> =
          {
            startX: x - measure.width,
            metadata: sections,
          };
        return committedMeasure;
      });

      const committedLine: MeasureLine<CoordinateSectionArray<T>> = {
        endPoint: { x, y },
        measures,
        startMeasureIndex: this.currentLine.startMeasureIndex,
      };
      return committedLine;
    }
  }

  private getSectionIndex(globalMeasureIndex: number, sectionKey: T) {
    const sectionIndices =
      this.measureIndexToSectionIndex.get(globalMeasureIndex)!;
    return sectionIndices[sectionKey];
  }

  private setMeasureSectionWidth(
    measureIndex: number,
    sectionKey: T,
    newWidth: number
  ) {
    const line = this.currentLine!;
    const globalIndex = line.startMeasureIndex + measureIndex;
    const sections = line.measures[measureIndex].sections!;
    const sectionIndex = this.getSectionIndex(globalIndex, sectionKey);
    sections[sectionIndex].width = newWidth;
  }

  private addToMeasureSectionWidth(
    measureIndex: number,
    sectionKey: T,
    extraWidth: number
  ) {
    const line = this.currentLine!;
    const globalIndex = line.startMeasureIndex + measureIndex;
    const sections = line.measures[measureIndex].sections!;
    const sectionIndex = this.getSectionIndex(globalIndex, sectionKey);
    sections[sectionIndex].width += extraWidth;
  }

  private getCommittedMeasure(
    line: MeasureLine<CoordinateSectionArray<T>>,
    measureIndex: number
  ) {
    return line.measures[measureIndex];
  }

  private getMeasureCoordinates(
    line: MeasureLine<CoordinateSectionArray<T>>,
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
    this.commitCurrentLine();
    const startMeasureIndex = this.getNextMeasureIndex(); //Maybe store this in the metadata
    this.currentLine = this.createEmptyLine(
      { x: xPos, y: yPos },
      startMeasureIndex
    );
  }

  private insertSectionIndicies(
    measureIndex: number,
    sections?: SectionArray<T>
  ) {
    const keyToIndex = {} as Record<T, number>;
    sections?.forEach((section, i) => {
      keyToIndex[section.key] = i;
    });
    this.measureIndexToSectionIndex.set(measureIndex, keyToIndex);
  }

  public addMeasure(width: number, sections?: SectionArray<T>) {
    this.checkCurrentLine();
    const line = this.currentLine!;
    const measureIndex = line.startMeasureIndex + line.measures.length;
    this.insertSectionIndicies(measureIndex, sections);
    this.currentLine!.measures.push({ width, sections });
  }

  private getCommittedMeasureWidth(
    line: MeasureLine<CoordinateSectionArray<T>>,
    measureIndex: number
  ) {
    const { start, end } = this.getMeasureCoordinates(line, measureIndex);
    return end.x - start.x;
  }

  private setUncommittedMeasureWidth(measureIndex: number, newWidth: number) {
    this.currentLine!.measures[measureIndex].width = newWidth;
  }

  private getUncommittedMeasureWidth(measureIndex: number) {
    return this.currentLine!.measures[measureIndex].width;
  }

  public getMeasureWidth(
    pageNumber: number,
    lineNumber: number,
    measureIndex: number
  ) {
    const line = this.getPageLine(pageNumber, lineNumber);
    return this.getCommittedMeasureWidth(line, measureIndex);
  }

  private createIteraterArgs() {
    const line = this.currentLine as UncommittedLine<SectionArray<T>>;
    const args: IterateMeasuresArgs<T> = {
      startMeasureIndex: line!.startMeasureIndex,
      measureCount: line!.measures.length,
      getMeasureWidth: this.getUncommittedMeasureWidth.bind(this),
      setMeasureWidth: this.setUncommittedMeasureWidth.bind(this),
      setSectionWidth: this.setMeasureSectionWidth.bind(this),
      addToSectionWidth: this.addToMeasureSectionWidth.bind(this),
    };
    return args;
  }

  public iterateCurrentLine(cb: IterateMeasuresCallback<T>) {
    this.checkCurrentLine();
    const line = this.currentLine as UncommittedLine<SectionArray<T>>;
    const args = this.createIteraterArgs();
    line!.measures.forEach((_, i) => cb(args, i));
  }

  public getMeasureData(measureIndex: number) {
    const indexData = this.measureIndexData.get(measureIndex);
    if (!indexData) {
      throw new Error(`MeasureOutline: Invalid measure index ${measureIndex}`);
    }
    const line = this.getPageLine(indexData.pageNumber, indexData.lineNumber);
    const measure = this.getCommittedMeasure(line, indexData.index);
    const { start, end } = this.getMeasureCoordinates(line, indexData.index);
    const width = end.x - start.x;
    return {
      start,
      end,
      width,
      pageNumber: indexData.pageNumber,
      metadata: measure.metadata,
    };
  }
}

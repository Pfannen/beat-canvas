import { MeasureOutline } from "./measure-outline";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Coordinate } from "@/types";
import { MeasureSection } from "@/types/music";
import { SectionArray } from "@/types/music-rendering/measure-manager/measure-outline";
import {
  MeasureOutlineSection,
  MeasureSectionArray,
  MeasureSections,
  measureSectionOrder,
} from "@/types/music-rendering/measure-manager";

export class MeasureManager {
  protected dimensionData: MusicDimensionData;
  protected measureOutline: MeasureOutline<MeasureSection>;
  private widthOnLine: number;
  private startCoordinate: Coordinate;
  protected pxTolerence = 1;
  constructor(dimensionData: MusicDimensionData) {
    this.dimensionData = dimensionData;
    this.widthOnLine = this.getFirstLineWidth();
    this.startCoordinate = this.dimensionData.pageDimensions.firstMeasureStart;
    this.measureOutline = new MeasureOutline(this.startCoordinate);
  }

  private isRoomOnLine(width: number) {
    return MeasureManager.isWithinTolerence(
      width,
      this.widthOnLine,
      this.pxTolerence
    );
  }

  public addMeasure(sections: MeasureSections, isLastMeasure: boolean) {
    const sectionHelper = new MeasureSectionHelper(
      sections,
      measureSectionOrder
    );
    const { width, firstMeasureWidth } = sectionHelper.getWidths();
    if (this.isRoomOnLine(width)) {
      const measureSections = sectionHelper.getSortedSections(true);
      this.addMeasureToLine(width, measureSections);
    } else {
      this.commitCurrentLine(true);
      const measureSections = sectionHelper.getSortedSections(false);
      this.addMeasureToLine(firstMeasureWidth, measureSections);
    }
    if (isLastMeasure) {
      this.commitCurrentLine(false);
    }
  }

  private addMeasureToLine(width: number, sections: SectionArray<any>) {
    this.widthOnLine -= width;
    this.measureOutline.addMeasure(width, sections);
  }

  private commitCurrentLine(addRemainingWidth: boolean) {
    if (addRemainingWidth) {
      this.measureOutline.iterateCurrentLine((args, measureIndex) => {
        const widthToAdd = this.widthOnLine / args.measureCount;
        args.addToSectionWidth(measureIndex, "note", widthToAdd);
      });
    }

    this.createNewLine();
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

  protected static isWithinTolerence = (
    valOne: number,
    valTwo: number,
    tolerence: number
  ) => {
    const difference = valOne - valTwo;
    if (difference < 0) return tolerence > -difference;
    return true;
  };

  public getMeasureSection(measureIndex: number, section: MeasureSection) {
    return this.measureOutline.getMeasureSection(measureIndex, section);
  }

  public getMeasureData(measureIndex: number) {
    return this.measureOutline.getMeasureData(measureIndex);
  }
}

class MeasureSectionHelper {
  constructor(
    private sections: MeasureSections,
    private sectionSortMap: Record<MeasureSection, number>
  ) {}

  private iterateSections(
    reducer: (section: MeasureOutlineSection<any>, isRequired: boolean) => any
  ) {
    this.sections.required.forEach((section) => reducer(section, true));
    this.sections.optional.forEach((section) => reducer(section, false));
  }

  public getWidths() {
    let width = 0;
    let firstMeasureWidth = 0;
    this.iterateSections((section, isRequired) => {
      if (section.displayByDefault) width += section.width;
      firstMeasureWidth += section.width;
    });

    return { width, firstMeasureWidth };
  }

  public getSortedSections(filterRequired: boolean) {
    const combinedSections: MeasureSectionArray<MeasureSection> = [];
    this.iterateSections((section) => {
      if (!filterRequired || section.displayByDefault) {
        combinedSections.push(section);
      }
    });
    combinedSections.sort((a, b) => {
      return this.sectionSortMap[a.key] - this.sectionSortMap[b.key];
    });
    return combinedSections;
  }
}

import { MeasureOutline } from "./measure-outline";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Coordinate } from "@/types";
import { MeasureSection } from "@/types/music";
import { SectionArray } from "@/types/music-rendering/measure-manager/measure-outline";
import {
  MeasureOutlineSection,
  MeasureSectionArray,
  MeasureSections,
  Tolerence,
} from "@/types/music-rendering/measure-manager";
import { MeasureSectionToggle } from "@/types/music-rendering";
import { getMeasureSectionOrder } from "@/utils/music-rendering/measure-section";

export class MeasureManager {
  private dimensionData: MusicDimensionData;
  private measureOutline: MeasureOutline<MeasureSection>;
  private widthOnLine: number;
  private startCoordinate: Coordinate;
  private sectionToggleList?: MeasureSectionToggle;
  private tolerence: Tolerence;
  constructor(
    dimensionData: MusicDimensionData,
    sectionToggleList?: MeasureSectionToggle,
    tolerence?: Tolerence
  ) {
    this.dimensionData = dimensionData;
    this.widthOnLine = this.getFirstLineWidth();
    this.sectionToggleList = sectionToggleList;
    this.startCoordinate = this.dimensionData.pageDimensions.firstMeasureStart;
    this.measureOutline = new MeasureOutline(this.startCoordinate);
    this.tolerence = tolerence || { width: 1, height: 1 };
  }

  private isRoomOnLine(width: number) {
    return MeasureManager.isWithinTolerence(
      width,
      this.widthOnLine,
      this.tolerence.width
    );
  }

  public addMeasure(
    sections: MeasureSections,
    measureIndex: number,
    isLastMeasure: boolean
  ) {
    const sectionHelper = new MeasureSectionHelper(
      sections,
      this.sectionToggleList
    );
    const { width, firstMeasureWidth } = sectionHelper.getWidths();
    if (this.isRoomOnLine(width)) {
      const measureWidth = measureIndex === 0 ? firstMeasureWidth : width;
      const measureSections = sectionHelper.getSortedSections(
        measureIndex !== 0
      );
      this.addMeasureToLine(measureWidth, measureSections);
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

    if (nextLineYEnd < pageYEnd && nextLineYEnd < -this.tolerence.height) {
      nextLineYStart = pageDimensions.height - pageDimensions.musicMargins.top;
      this.measureOutline.addPage(newLineXStart, nextLineYStart);
    }
    this.measureOutline.addLine(newLineXStart, nextLineYStart);
    this.widthOnLine = this.getLineWidth();
    this.startCoordinate = { x: newLineXStart, y: nextLineYStart };
  }

  protected getFirstLineWidth() {
    const { pageDimensions } = this.dimensionData;
    const { musicMargins } = pageDimensions;
    let contentSpace = this.getLineWidth();

    contentSpace -= pageDimensions.firstMeasureStart.x - musicMargins.left;

    return contentSpace;
  }

  protected getLineWidth() {
    const { pageDimensions } = this.dimensionData;
    const { musicMargins } = pageDimensions;
    return pageDimensions.width - (musicMargins.left + musicMargins.right);
  }

  //Is valOne within tolerence of valTwo
  protected static isWithinTolerence = (
    valOne: number,
    valTwo: number,
    tolerence: number
  ) => {
    const difference = valTwo - valOne;
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
    private sectionToggleList?: MeasureSectionToggle
  ) {}

  private iterateSections(
    reducer: (
      section: MeasureOutlineSection<MeasureSection>,
      isRequired: boolean
    ) => any
  ) {
    this.sections.required.forEach((section) => reducer(section, true));
    this.sections.optional.forEach((section) => reducer(section, false));
  }

  private isSectionToggled(key: MeasureSection) {
    return !this.sectionToggleList || this.sectionToggleList[key];
  }

  public getWidths() {
    let width = 0;
    let firstMeasureWidth = 0;
    this.iterateSections((section, isRequired) => {
      if (this.isSectionToggled(section.key)) {
        if (section.displayByDefault) width += section.width;
        if (section.displayByDefault || isRequired)
          firstMeasureWidth += section.width;
      }
    });

    return { width, firstMeasureWidth };
  }

  public getSortedSections(filterRequired: boolean) {
    const combinedSections: MeasureSectionArray<MeasureSection> = [];
    this.iterateSections((section, isRequired) => {
      if (this.isSectionToggled(section.key)) {
        if (!filterRequired) {
          if (isRequired || section.displayByDefault) {
            combinedSections.push(section);
          }
        } else if (section.displayByDefault) {
          combinedSections.push(section);
        }
      }
    });
    combinedSections.sort((a, b) => {
      return getMeasureSectionOrder(a.key) - getMeasureSectionOrder(b.key);
    });
    return combinedSections;
  }
}

import { MeasureTransformer } from "@/objects/music/music-display-data/measure-transformer";
import { Music } from "@/objects/music/readonly-music";
import { MeasureManager } from "../measure-manager";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { MeasureSectionToggle, UnitConverters } from "@/types/music-rendering";
import { NoteAnnotation } from "@/types/music/note-annotations";
import {
  Measure,
  NoteType,
  TimeSignature,
} from "@/components/providers/music/types";
import {
  getNoteDuration,
  getNotePercentageOfMeasure,
} from "@/components/providers/music/utils";
import { CoordinateSection } from "@/types/music-rendering/measure-manager/measure-outline";
import {
  DynamicMeasureAttribute,
  MeasureAttributes,
  StaticMeasureAttribute,
  StaticMeasureAttributes,
} from "@/types/music";
import { InitialMeasureSectionArray } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";
import { formatInitialSections } from "../beat-canvas/drawers/measure-sections/initial-section-handlers";
import { noteAttributeGenerator } from "@/utils/music/measures/traversal";
import { ICanvasGetter } from "@/types/music-rendering/canvas/manager/canvas-manager";
import { Tolerence } from "@/types/music-rendering/measure-manager";
import { StaticAttributeParser } from "./parsers/static-parser";
import { isStaticMeasureAttribute } from "@/utils/music";
import { DynamicAttributeParser } from "./parsers/dynamic-parser";
import { MeasureSectionData } from "@/types/music-rendering/attribute-parsing";
import { DynamicAttributeData } from "@/types/music-rendering/canvas/beat-canvas";

export class MeasureRenderer {
  private measures: Measure[];

  private canvasManager: ICanvasGetter;
  private measureManager!: MeasureManager;
  private musicDimensions: MusicDimensionData;
  private measurements: Measurements;
  private unitConverters!: UnitConverters;
  private initialAttributes?: MeasureAttributes;
  constructor(
    measures: Measure[],
    musicDimensions: MusicDimensionData,
    canvasManager: ICanvasGetter,
    measurements: Measurements,
    sectionToggleList?: MeasureSectionToggle,
    unitConverters?: UnitConverters,
    measureTolerence?: Tolerence,
    initialAttributes?: MeasureAttributes
  ) {
    this.measures = measures;
    this.musicDimensions = musicDimensions;
    this.canvasManager = canvasManager;
    this.measureManager = new MeasureManager(
      this.musicDimensions,
      sectionToggleList,
      measureTolerence
    );
    this.measurements = measurements;
    this.initializeUnitConverters(unitConverters);
    this.initialAttributes = initialAttributes;
  }

  private initializeUnitConverters(unitConverters?: UnitConverters) {
    if (!unitConverters) {
      const unitConverter = (val: number) => val;
      this.unitConverters = { x: unitConverter, y: unitConverter };
    } else {
      this.unitConverters = unitConverters;
    }
  }

  private getMusicRenderData(
    music: Music,
    getMeasureNoteSpace: (measureIndex: number) => number
  ) {
    const transformer = new MeasureTransformer(music, this.measurements);
    transformer.computeDisplayData([
      { attacher: "non-body", context: undefined },
      {
        attacher: "beam-data",
        context: {
          unitConverters: this.unitConverters,
          getAbsolutePosition: (measureIndex, noteIndex) => {
            const note = this.measures[measureIndex].notes[noteIndex];
            const noteSpaceWidth = getMeasureNoteSpace(measureIndex);
            const timeSig = music.getMeasureTimeSignature(measureIndex);
            const duration = getNoteDuration(
              note.type,
              timeSig.beatNote,
              note.annotations?.dotted
            );
            const x =
              Measurements.getXFractionOffset(
                note.x,
                duration,
                timeSig.beatsPerMeasure
              ) * noteSpaceWidth;
            const y =
              this.measurements.getYFractionOffset(note.y) *
              this.musicDimensions.measureDimensions.noteSpaceHeight;
            return { x, y };
          },
        },
      },
    ]);
    return transformer.getMeasureRenderData();
  }

  private generateMeasureOutline(
    getMeasureMetadata: (measureIndex: number) => {
      sections: InitialMeasureSectionArray;
      attributes: StaticMeasureAttributes;
    }
  ) {
    const { measureDimensions } = this.musicDimensions;

    this.measures.forEach((measure, i) => {
      const data = getMeasureMetadata(i);
      const { required, optional } = formatInitialSections(data.sections, {
        bodyHeight: this.measurements.getBodyHeight(),
        componentHeights: this.measurements.getComponentHeights(),
        clef: data.attributes["clef"],
      });
      const noteSection = {
        key: "note",
        width: measureDimensions.width,
        displayByDefault: true,
      };
      required.push(noteSection as any);
      this.measureManager.addMeasure(
        {
          required,
          optional,
        },
        i,
        i === this.measures.length - 1
      );
    });
  }

  private generateMeasureAttributes() {
    const measureSections: MeasureSectionData[] = [];
    const dynamicAttributes: DynamicAttributeData[] = [];
    for (const locObj of noteAttributeGenerator(
      this.measures,
      this.initialAttributes
    )) {
      if (locObj.measureStart) {
        let measureDetails;
        if (locObj.measureIndex === 0) {
          measureDetails = combineMeasureSectionObjects(
            locObj.currentAttributes,
            locObj.currentAttributes
          ); //I need to treat the attributes as "new" if it is the first measure
        } else {
          measureDetails = combineMeasureSectionObjects(
            locObj.currentAttributes,
            locObj.newAttributes
          );
        }
        dynamicAttributes.push(measureDetails.dynamic);
        measureSections.push(measureDetails.static);
      }
    }
    return { sections: measureSections, dynamicAttributes };
  }

  private getContainerPositionData(measureIndex: number) {
    const measureData = this.measureManager.getMeasureData(measureIndex);
    const { padding, noteSpaceHeight } = this.musicDimensions.measureDimensions;

    const noteSpaceBottom = {
      x: measureData.start.x,
      y: measureData.start.y - padding.top - noteSpaceHeight,
    };
    return {
      measureData,
      noteSpaceBottom,
      noteSpaceHeight,
    };
  }

  private getContainerDimensionData() {
    const { height, padding, noteSpaceHeight } =
      this.musicDimensions.measureDimensions;

    const { line: lineFraction, space: spaceFraction } =
      this.measurements.getComponentFractions();
    const lineHeight = lineFraction * noteSpaceHeight;
    const spaceHeight = spaceFraction * noteSpaceHeight;
    const measureComponentHeights = { line: lineHeight, space: spaceHeight };
    return { measureComponentHeights, containerHeight: height, padding };
  }

  public render() {
    const measureDetails = this.generateMeasureAttributes();
    const music = new Music(
      this.measures,
      (i) => measureDetails.sections[i].attributes.timeSignature
    );
    this.generateMeasureOutline((i) => measureDetails.sections[i]);
    const renderData = this.getMusicRenderData(
      music,
      (i) => this.measureManager.getMeasureSection(i, "note")!.width
    );
    const containerData = this.getContainerDimensionData();
    renderData.forEach((measure, measureIndex) => {
      const positionData = this.getContainerPositionData(measureIndex);
      const timeSig =
        measureDetails.sections[measureIndex].attributes.timeSignature;
      const { measureData } = positionData;
      const beatCanvas = this.canvasManager.getCanvasForPage(
        measureData.pageNumber
      );

      const noteSection = this.measureManager.getMeasureSection(
        measureIndex,
        "note"
      )!;

      const componentHelper = new MeasureComponentHelper(
        timeSig,
        noteSection,
        positionData.noteSpaceBottom.y,
        positionData.noteSpaceHeight,
        this.measurements
      );
      let noteIndex = 0;
      measure.components.forEach((component) => {
        if (component.type === "note") {
          const { note, renderData } = component;
          const type = note.type;
          const bodyCenter = componentHelper.getCoordinates(
            note.type,
            note.x,
            note.y,
            !!note.annotations?.dotted
          );
          const noteAnnotations = music.getNoteAnnotations(
            measureIndex,
            noteIndex
          );
          let annotations: NoteAnnotation[] | undefined;
          if (noteAnnotations) {
            annotations = Object.keys(noteAnnotations) as NoteAnnotation[];
          }
          beatCanvas.drawNote({
            displayData: renderData,
            bodyCenter,
            type,
            bodyHeight: containerData.measureComponentHeights.space,
            noteIndex,
            measureIndex,
            pageNumber: measureData.pageNumber,
            annotations,
          });
          noteIndex++;
        } else {
          const { rest } = component;
          const center = componentHelper.getCoordinates(
            rest.type,
            rest.x,
            4,
            rest.isDotted
          );
          beatCanvas.drawRest({
            center,
            type: rest.type,
            measureComponentHeights: containerData.measureComponentHeights,
            isDotted: rest.isDotted,
          });
        }
      });
      beatCanvas.drawMeasure({
        topLeft: { ...measureData.start },
        sections: measureData.metadata!,
        totalWidth: measureData.width,
        measureIndex,
        pageNumber: measureData.pageNumber,
        noteStartX: noteSection.startX,
        sectionAttributes: measureDetails.sections[measureIndex].attributes,
        dynamicAttributes: measureDetails.dynamicAttributes[measureIndex],
        paddingValues: this.musicDimensions.measureDimensions.padding,
      });
    });
  }
}

class MeasureComponentHelper {
  constructor(
    private timeSignature: TimeSignature,
    private noteSection: CoordinateSection<any>,
    private bottomY: number,
    private height: number,
    private measurements: Measurements
  ) {}
  private getXOffset(xPos: number, duration = 0) {
    const fractionOffset = Measurements.getXFractionOffset(
      xPos,
      duration,
      this.timeSignature.beatsPerMeasure
    );
    return this.noteSection.width * fractionOffset;
  }

  private getNoteOffset(type: NoteType, xPos: number, isDotted: boolean) {
    const duration = getNoteDuration(
      type,
      this.timeSignature.beatNote,
      isDotted
    );
    return this.getXOffset(xPos, duration);
  }

  public getCoordinates(
    type: NoteType,
    xPos: number,
    yPos: number,
    isDotted: boolean
  ) {
    const { startX } = this.noteSection;
    const noteOffset = this.getNoteOffset(type, xPos, isDotted);
    const noteCenterX = startX + noteOffset;
    const yOffset = this.measurements.getYFractionOffset(yPos);
    const centerY = this.height * yOffset + this.bottomY;
    return { x: noteCenterX, y: centerY };
  }
}

const combineMeasureSectionObjects = (
  currentAttributes: MeasureAttributes,
  newAttributes?: Partial<MeasureAttributes>
) => {
  const staticParser = new StaticAttributeParser(
    currentAttributes,
    newAttributes
  );
  const dynamicParser = new DynamicAttributeParser(newAttributes);
  for (const key in newAttributes) {
    if (isStaticMeasureAttribute(key)) {
      staticParser.parseKey(key as StaticMeasureAttribute);
    }
    // else if (isDynamicMeasureAttribute(key)) {
    //   dynamicParser.parseKey(key as DynamicMeasureAttribute);
    // }
  }
  return { static: staticParser.get(), dynamic: dynamicParser.get() };
};

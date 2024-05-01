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
import { getNoteDuration } from "@/components/providers/music/utils";
import { CoordinateSection } from "@/types/music-rendering/measure-manager/measure-outline";
import {
  MeasureAttributes,
  MeasureSectionMetadata,
  StaticMeasureAttributes,
  staticMeasureAttributesKeys,
} from "@/types/music";
import { InitialMeasureSectionArray } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";
import { formatInitialSections } from "../beat-canvas/drawers/measure-sections/initial-section-handlers";
import { noteAttributeGenerator } from "@/utils/music/measures/traversal";
import { ICanvasGetter } from "@/types/music-rendering/canvas/manager/canvas-manager";
import { Tolerence } from "@/types/music-rendering/measure-manager";
import { getMeasureSectionData } from "@/utils/music-rendering/measure-section";

export class MeasureRenderer {
  private measures: Measure[];
  private music: Music;
  private canvasManager: ICanvasGetter;
  private transformer: MeasureTransformer;
  private measureManager!: MeasureManager;
  private musicDimensions: MusicDimensionData;
  private measurements: Measurements;
  private unitConverters!: UnitConverters;
  constructor(
    measures: Measure[],
    musicDimensions: MusicDimensionData,
    canvasManager: ICanvasGetter,
    measurements: Measurements,
    sectionToggleList?: MeasureSectionToggle,
    unitConverters?: UnitConverters,
    measureTolerence?: Tolerence
  ) {
    this.measures = measures;
    this.musicDimensions = musicDimensions;
    this.canvasManager = canvasManager;
    this.music = new Music();
    this.music.setMeasures(measures);
    this.transformer = new MeasureTransformer(this.music, measurements);
    this.measureManager = new MeasureManager(
      this.musicDimensions,
      sectionToggleList,
      measureTolerence
    );
    this.measurements = measurements;
    this.initializeUnitConverters(unitConverters);
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
    getMeasureData: (measureIndex: number) => {
      timeSig: TimeSignature;
      noteSpaceWidth: number;
    }
  ) {
    this.transformer.computeDisplayData([
      { attacher: "non-body", context: undefined },
      {
        attacher: "beam-data",
        context: {
          unitConverters: this.unitConverters,
          getAbsolutePosition: (measureIndex, noteIndex) => {
            const note = this.measures[measureIndex].notes[noteIndex];
            const { timeSig, noteSpaceWidth } = getMeasureData(measureIndex);
            const duration = getNoteDuration(note.type, timeSig.beatNote);
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
    return this.transformer.getMeasureRenderData();
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
    const measureSections: {
      sections: InitialMeasureSectionArray;
      attributes: MeasureSectionMetadata;
    }[] = [];
    for (const locObj of noteAttributeGenerator(this.measures)) {
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

        measureSections.push(measureDetails);
      }
    }
    return measureSections;
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
    this.generateMeasureOutline((i) => measureDetails[i]);
    const renderData = this.getMusicRenderData((i) => ({
      timeSig: measureDetails[i].attributes.timeSignature,
      noteSpaceWidth: this.measureManager.getMeasureSection(i, "note")!.width,
    }));
    const containerData = this.getContainerDimensionData();
    renderData.forEach((measure, measureIndex) => {
      const positionData = this.getContainerPositionData(measureIndex);
      const timeSig = measureDetails[measureIndex].attributes.timeSignature;
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
            note.y
          );
          const noteAnnotations = this.music.getNoteAnnotations(
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
          const center = componentHelper.getCoordinates(rest.type, rest.x, 4);
          beatCanvas.drawRest({
            center,
            type: rest.type,
            measureComponentHeights: containerData.measureComponentHeights,
          });
        }
      });
      beatCanvas.drawMeasure({
        topLeft: { ...measureData.start },
        sections: measureData.metadata!,
        totalWidth: measureData.width,
        measureIndex,
        pageNumber: measureData.pageNumber,
        sectionAttributes: measureDetails[measureIndex].attributes,
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

  private getNoteOffset(type: NoteType, xPos: number) {
    const duration = getNoteDuration(type, this.timeSignature.beatNote);
    return this.getXOffset(xPos, duration);
  }

  public getCoordinates(type: NoteType, xPos: number, yPos: number) {
    const { startX } = this.noteSection;
    const noteOffset = this.getNoteOffset(type, xPos);
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
  const attributes = {} as MeasureSectionMetadata;
  const sections: InitialMeasureSectionArray = [];
  if (newAttributes) {
    staticMeasureAttributesKeys.forEach((key) => {
      const newData = newAttributes[key];
      if (newData) {
        const section = getMeasureSectionData(key, newData);
        sections.push({
          key: section.key,
          displayByDefault: true,
          data: section.data,
        });
        attributes[section.key as never] = section.data as never;
      } else if (currentAttributes[key]) {
        const section = getMeasureSectionData(key, currentAttributes[key]);
        sections.push({
          key: section.key,
          displayByDefault: false,
          data: section.data,
        });
        attributes[section.key as never] = section.data as never;
      }
    });
  } else {
    staticMeasureAttributesKeys.forEach((key) => {
      const data = currentAttributes[key];
      if (data) {
        const section = getMeasureSectionData(key, currentAttributes[key]);
        sections.push({
          key: section.key,
          displayByDefault: false,
          data: section.data,
        });
        attributes[section.key as never] = section.data as never;
      }
    });
  }
  return { sections, attributes };
};

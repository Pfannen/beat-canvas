import { MeasureTransformer } from "@/objects/music/music-display-data/measure-transformer";
import { Music } from "@/objects/music/readonly-music";
import { MeasureManager } from "../measure-manager";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { BeatCanvasDel, MeasureSectionToggle } from "@/types/music-rendering";
import { NoteAnnotation } from "@/types/music/note-annotations";
import {
  Measure,
  NoteType,
  TimeSignature,
} from "@/components/providers/music/types";
import { getNoteDuration } from "@/components/providers/music/utils";
import { CoordinateSection } from "@/types/music-rendering/measure-manager/measure-outline";
import { MeasureSection, MeasureSectionMetadata } from "@/types/music";
import { InitialMeasureSectionArray } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure-section";
import { formatInitialSections } from "../beat-canvas/drawers/measure-sections/initial-section-handlers";

export class MeasureRenderer {
  private measures: Measure[];
  private music: Music;
  private getBeatCanvasForPage: BeatCanvasDel;
  private transformer: MeasureTransformer;
  private measureManager!: MeasureManager;
  private musicDimensions: MusicDimensionData;
  private measurements: Measurements;
  constructor(
    measures: Measure[],
    musicDimensions: MusicDimensionData,
    getBeatCanvasForPage: BeatCanvasDel,
    measurements: Measurements,
    sectionToggleList?: MeasureSectionToggle
  ) {
    this.measures = measures;
    this.musicDimensions = musicDimensions;
    this.getBeatCanvasForPage = getBeatCanvasForPage;
    this.music = new Music();
    this.music.setMeasures(measures);
    this.transformer = new MeasureTransformer(this.music);
    this.measureManager = new MeasureManager(
      this.musicDimensions,
      sectionToggleList
    );
    this.measurements = measurements;
  }

  private getMeasureDimensions(measureIndex: number) {
    const noteSection = this.measureManager.getMeasureSection(
      measureIndex,
      "note"
    )!;
    return {
      height: this.musicDimensions.measureDimensions.noteSpaceHeight,
      width: noteSection.width,
    };
  }

  private getMusicRenderData() {
    this.transformer.computeDisplayData([
      {
        attacher: "beam-data",
        context: {
          measurements: this.measurements,
          getMeasureDimensions: this.getMeasureDimensions.bind(this),
        },
      },
    ]);
    return this.transformer.getMeasureRenderData();
  }

  private generateMeasureOutline(
    getMeasureMetadata: (measureIndex: number) => InitialMeasureSectionArray
  ) {
    const { measureDimensions } = this.musicDimensions;
    this.measures.forEach((measure, i) => {
      const sections = getMeasureMetadata(i);
      const { required, optional } = formatInitialSections(sections, {
        bodyHeight: this.measurements.getBodyHeight(),
        componentHeights: this.measurements.getComponentHeights(),
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
    this.generateMeasureOutline(() => sections);
    const renderData = this.getMusicRenderData();
    const containerData = this.getContainerDimensionData();
    renderData.forEach((measure, measureIndex) => {
      const positionData = this.getContainerPositionData(measureIndex);
      const timeSig = this.music.getMeasureTimeSignature(measureIndex);
      const { measureData } = positionData;
      const beatCanvas = this.getBeatCanvasForPage(
        measureData.pageNumber,
        this.measurements
      );

      beatCanvas.drawMeasure({
        topLeft: { ...measureData.start },
        sections: measureData.metadata!,
        totalWidth: measureData.width,
        measureIndex,
        sectionAttributes: {
          keySignature: 0,
          clef: "alto",
          timeSignature: timeSig,
        },
      });

      // displayData: this.getMeasureDisplayData(
      //   measureMetadata,
      //   measureData.metadata!,
      //   {
      //     getYOffset: this.measurements.getYFractionOffset.bind(
      //       this.measurements
      //     ),
      //     noteSpaceBottomY: positionData.noteSpaceBottom.y,
      //     noteSpaceHeight: positionData.noteSpaceHeight,
      //     bodyHeight: this.measurements.getBodyHeight(),
      //   }
      // ),

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

const sections: InitialMeasureSectionArray = [
  { key: "clef", data: "alto", displayByDefault: true },
  { key: "keySignature", data: 0, displayByDefault: true },
  {
    key: "timeSignature",
    data: { beatNote: 4, beatsPerMeasure: 4 },
    displayByDefault: true,
  },
];

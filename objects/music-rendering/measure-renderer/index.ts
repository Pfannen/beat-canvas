import { MeasureTransformer } from "@/objects/music/music-display-data/measure-transformer";
import { Music } from "@/objects/music/readonly-music";
import { MeasureManager } from "../measure-manager";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import {
  BeatCanvasDel,
  MeasureComponentIterator,
} from "@/types/music-rendering";
import { NoteAnnotation } from "@/types/music/note-annotations";
import { getTimeSignatureDrawData } from "@/utils/music-rendering/draw-data/measure";
import { Measure } from "@/components/providers/music/types";

export class MeasureRenderer {
  private bodyCt: number;
  private measures: Measure[];
  private music: Music;
  private getBeatCanvasForPage: BeatCanvasDel;
  private transformer: MeasureTransformer;
  private measureManager!: MeasureManager;
  private musicDimensions: MusicDimensionData;
  private measurements: Measurements;
  private measureComponentIterator: MeasureComponentIterator;
  private measureBodyHeight: number;
  private componentStartOffset: number;
  private bodyOffset: number;
  constructor(
    measures: Measure[],
    musicDimensions: MusicDimensionData,
    getBeatCanvasForPage: BeatCanvasDel,
    measurements: Measurements,
    bodyCount: number,
    drawNonBodyComponents = false
  ) {
    this.measures = measures;
    this.musicDimensions = musicDimensions;
    this.getBeatCanvasForPage = getBeatCanvasForPage;
    this.music = new Music();
    this.music.setMeasures(measures);
    this.transformer = new MeasureTransformer(this.music);
    this.measureManager = new MeasureManager(this.musicDimensions);
    this.bodyCt = bodyCount;
    this.measurements = measurements;

    const measureComponents = this.measurements.getMeasureComponents();
    if (drawNonBodyComponents) {
      this.measureComponentIterator =
        measureComponents.iterateMeasureComponents.bind(measureComponents);
    } else {
      this.measureComponentIterator =
        measureComponents.iterateBodyComponents.bind(measureComponents);
    }
    const { padding } = this.musicDimensions.measureDimensions;
    const { bodyHeight, bodyOffset } =
      this.measurements.getMeasureDimensionData(
        musicDimensions.measureDimensions.noteSpaceHeight,
        this.bodyCt
      );
    this.bodyOffset = bodyOffset + padding.top;
    this.measureBodyHeight = bodyHeight;
    this.componentStartOffset = this.getComponentStartOffset(
      drawNonBodyComponents
    );
  }

  private getComponentStartOffset(drawNonBodyComponents: boolean) {
    const { measureDimensions } = this.musicDimensions;
    if (!drawNonBodyComponents) {
      return this.bodyOffset;
    }
    return measureDimensions.padding.top;
  }

  private getMeasureDimensions(measureIndex: number) {
    const { width } = this.measureManager.getMeasureData(measureIndex);
    return {
      height: this.musicDimensions.measureDimensions.noteSpaceHeight,
      width,
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
  private generateMeasureOutline() {
    const { measureDimensions } = this.musicDimensions;
    this.measures.forEach((measure, i) => {
      this.measureManager.addMeasure(
        {
          required: [
            {
              key: "note",
              width: measureDimensions.width,
              displayByDefault: true,
            },
            {
              key: "clef",
              width: measureDimensions.width / 6,
              displayByDefault: false,
            },
            {
              key: "keySignature",
              width: measureDimensions.width / 5,
              displayByDefault: false,
            },
          ],
          optional: [],
        },
        i === this.measures.length - 1
      );
    });
  }

  public render() {
    this.generateMeasureOutline();
    const renderData = this.getMusicRenderData();
    renderData.forEach((measure, measureIndex) => {
      const timeSig = this.music.getMeasureTimeSignature(measureIndex);
      const measureData = this.measureManager.getMeasureData(measureIndex);
      const { height, padding, noteSpaceHeight } =
        this.musicDimensions.measureDimensions;

      const { line: lineFraction, space: spaceFraction } =
        this.measurements.getComponentFractions();
      const lineHeight = lineFraction * noteSpaceHeight;
      const spaceHeight = spaceFraction * noteSpaceHeight;
      const measureComponentHeights = { line: lineHeight, space: spaceHeight };
      const beatCanvas = this.getBeatCanvasForPage(measureData.pageNumber);
      const measureBottom = {
        x: measureData.start.x,
        y: measureData.start.y - padding.top - noteSpaceHeight,
      };
      console.log(measureData.width);
      beatCanvas.drawMeasure({
        topLeft: { ...measureData.start },
        width: measureData.width,
        height,
        componentStartY: measureData.start.y - this.componentStartOffset,
        containerPadding: padding,
        componentHeights: measureComponentHeights,
        bodyHeight: this.measureBodyHeight,
        bodyStartY: measureData.start.y - this.bodyOffset,
        measureIndex,
        topComponentIsLine: this.measurements.topComponentIsLine(),
        componentIterator: this.measureComponentIterator,
        displayData: {
          timeSignature: getTimeSignatureDrawData(
            0,
            measureData.start.x,
            measureData.width,
            (yPos: number) =>
              this.measurements.getYFractionOffset(yPos) * noteSpaceHeight +
              measureBottom.y
          ),
        },
      });

      let noteIndex = 0;
      measure.components.forEach((component) => {
        if (component.type === "note") {
          const { note, renderData } = component;
          const type = note.type;
          const duration = this.music.getNoteDuration(measureIndex, noteIndex);
          const centerX =
            measureData.width *
              Measurements.getXFractionOffset(
                note.x,
                duration,
                timeSig.beatsPerMeasure
              ) +
            measureBottom.x;
          const offset = this.measurements.getYFractionOffset(note.y);
          const centerY = noteSpaceHeight * offset + measureBottom.y;
          const center = { x: centerX, y: centerY };
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
            bodyCenter: center,
            type,
            bodyHeight: spaceHeight,
            noteIndex,
            measureIndex,
            annotations,
          });
          noteIndex++;
        } else {
          const { rest } = component;
          const duration = this.music.getRestDuration(measureIndex, rest.type);
          const x =
            measureData.width *
              Measurements.getXFractionOffset(
                rest.x,
                duration,
                timeSig.beatsPerMeasure
              ) +
            measureBottom.x;
          const yOffset = this.measurements.getYFractionOffset(4);
          const y = noteSpaceHeight * yOffset + measureBottom.y;
          beatCanvas.drawRest({
            center: { x, y },
            type: rest.type,
            measureComponentHeights,
          });
        }
      });
    });
  }
}

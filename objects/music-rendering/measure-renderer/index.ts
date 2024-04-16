import { MeasureTransformer } from "@/objects/music/music-display-data/measure-transformer";
import { Music } from "@/objects/music/readonly-music";
import { MeasureManager } from "../measure-manager";
import { MeasureWidthCalculator } from "../measure-manager/measure-width-calculator";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import {
  BeatCanvasDel,
  MeasureComponentIterator,
} from "@/types/music-rendering";

export class MeasureRenderer {
  private bodyCt: number;
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
    music: Music,
    musicDimensions: MusicDimensionData,
    getBeatCanvasForPage: BeatCanvasDel,
    measurements: Measurements,
    bodyCount: number,
    drawNonBodyComponents = false
  ) {
    this.music = music;
    this.musicDimensions = musicDimensions;
    this.getBeatCanvasForPage = getBeatCanvasForPage;
    this.transformer = new MeasureTransformer(music);
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
    return { height: this.musicDimensions.measureDimensions.height, width };
  }

  private initializeMeasureManager() {
    const widthCalc = new MeasureWidthCalculator(
      this.musicDimensions.measureDimensions.width,
      this.music.getMeasureTimeSignature(0)
    );
    const getMeasureWidth = (measureIndex: number) => {
      return widthCalc.getMeasureWidth(
        { components: [] },
        { beatsPerMeasure: 4, beatNote: 4 }
      );
    };
    this.measureManager = new MeasureManager(
      this.music.getMeasureCount(),
      this.musicDimensions,
      getMeasureWidth,
      this.music.getMeasureTimeSignature.bind(this.music)
    );
    this.measureManager.compute();
    this.transformer.computeDisplayData([
      {
        attacher: "beam-data",
        context: {
          measurements: this.measurements,
          getMeasureDimensions: this.getMeasureDimensions.bind(this),
        },
      },
    ]);
  }

  public render() {
    this.initializeMeasureManager();
    const renderData = this.transformer.getMeasureRenderData();
    renderData.forEach((measure, measureIndex) => {
      const timeSig = this.music.getMeasureTimeSignature(measureIndex);
      const measureData = this.measureManager.getMeasureData(measureIndex);
      const { height, padding, noteSpaceHeight } =
        this.musicDimensions.measureDimensions;

      const { line: lineFraction, space: spaceFraction } =
        this.measurements.getComponentFractions();
      const lineHeight = lineFraction * noteSpaceHeight;
      const spaceHeight = spaceFraction * noteSpaceHeight;
      const beatCanvas = this.getBeatCanvasForPage(measureData.pageNumber);
      beatCanvas.drawMeasure({
        topLeft: { ...measureData.start },
        width: measureData.width,
        height,
        componentStartY: measureData.start.y - this.componentStartOffset,
        containerPadding: padding,
        lineHeight,
        spaceHeight,
        bodyHeight: this.measureBodyHeight,
        bodyStartY: measureData.start.y - this.bodyOffset,
        measureIndex,
        topComponentIsLine: this.measurements.topComponentIsLine(),
        componentIterator: this.measureComponentIterator,
      });
      const measureBottom = {
        x: measureData.start.x,
        y: measureData.start.y - padding.top - noteSpaceHeight,
      };
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
          beatCanvas.drawNote({
            ...renderData,
            bodyCenter: center,
            type,
            noteDirection: renderData.noteDirection,
            bodyHeight: spaceHeight,
            noteIndex,
            measureIndex,
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
          const y = noteContainerHeight * yOffset + measureBottom.y;
          beatCanvas.drawRest({ center: { x, y }, type: rest.type });
        }
      });
    });
  }
}

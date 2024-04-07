import { MeasureTransformer } from "@/objects/music/music-display-data/measure-transformer";
import { Music } from "@/objects/music/readonly-music";
import { MeasureManager } from "../measure-manager";
import { MeasureWidthCalculator } from "../measure-manager/measure-width-calculator";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { BODY_CT } from "@/objects/measurement/constants";
import { BeatCanvasDel, MusicUnitConverter } from "@/types/music-rendering";

export class MeasureRenderer {
  private bodyCt = BODY_CT;
  private aboveBelowCount: number;
  private music: Music;
  private getBeatCanvasForPage: BeatCanvasDel;
  private transformer: MeasureTransformer;
  private measureManager!: MeasureManager;
  private musicDimensions: MusicDimensionData;
  private measurements: Measurements;
  private unitConverter?: MusicUnitConverter;
  constructor(
    music: Music,
    aboveBelowCount: number,
    musicDimensions: MusicDimensionData,
    getBeatCanvasForPage: BeatCanvasDel,
    unitConverter?: MusicUnitConverter
  ) {
    this.music = music;
    this.musicDimensions = musicDimensions;
    this.getBeatCanvasForPage = getBeatCanvasForPage;
    this.unitConverter = unitConverter;
    this.transformer = new MeasureTransformer(music);
    this.aboveBelowCount = aboveBelowCount;
    this.measurements = new Measurements(aboveBelowCount, this.bodyCt, 3);
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
        { components: [], attributes: [] },
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
      const { height, padding } = this.musicDimensions.measureDimensions;
      const { line: lineFraction, space: spaceFraction } =
        this.measurements.getComponentFractions();
      const noteContainerHeight = height - padding.top - padding.bottom;
      const lineHeight = lineFraction * noteContainerHeight;
      const spaceHeight = spaceFraction * noteContainerHeight;
      const beatCanvas = this.getBeatCanvasForPage(measureData.pageNumber);
      const { line, space } = this.measurements.getMeasureComponentCounts();
      const componentCount = line + space;
      const bodyEndPos = componentCount - this.aboveBelowCount;
      const bodyStartPos = bodyEndPos - (this.bodyCt - 1);
      beatCanvas.drawMeasure({
        topLeft: measureData.start,
        width: measureData.width,
        height,
        containerPadding: padding,
        lineHeight,
        spaceHeight,
        lineCount: line,
        spaceCount: space,
        bodyEndPos,
        bodyStartPos,
        measureIndex,
        topComponentIsLine: this.measurements.topComponentIsLine(),
      });
      const measureBottom = {
        x: measureData.start.x,
        y: measureData.start.y - padding.top - noteContainerHeight,
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
          const centerY = noteContainerHeight * offset + measureBottom.y;
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
          // const {rest} = component;
          // this.beatCanvas.drawRest({type: rest.type, })
        }
      });
    });
  }
}

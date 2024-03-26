import { MeasureTransformer } from "@/objects/music/music-display-data/measure-transformer";
import { Music } from "@/objects/music/readonly-music";
import { MeasureManager } from "../measure-manager";
import { PageDimensionParams } from "../music-layout/page-dimension-params";
import { MusicLayout } from "../music-layout";
import { MeasureWidthCalculator } from "../measure-manager/measure-width-calculator";
import { BeatCanvas } from "../beat-canvas";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { BODY_CT } from "@/objects/measurement/constants";

type BeatCanvasDel = (pageNumber: number) => BeatCanvas;

export class MeasureRenderer {
  private bodyCt = BODY_CT;
  private aboveBelowCount: number;
  private music: Music;
  private getBeatCanvasForPage: BeatCanvasDel;
  private transformer: MeasureTransformer;
  private measureManager!: MeasureManager;
  private musicDimensions: MusicDimensionData;
  private measurements: Measurements;
  constructor(
    music: Music,
    aboveBelowCount: number,
    getBeatCanvasForPage: BeatCanvasDel
  ) {
    this.music = music;
    this.getBeatCanvasForPage = getBeatCanvasForPage;
    this.transformer = new MeasureTransformer(music);
    const pageParams = PageDimensionParams.genericSheetMusic();
    this.musicDimensions = MusicLayout.getDimensions(pageParams);
    this.aboveBelowCount = aboveBelowCount;
    this.measurements = new Measurements(aboveBelowCount, this.bodyCt, 3);
  }

  private initializeMeasureManager() {
    const renderData = this.transformer.getMeasureRenderData();
    const widthCalc = new MeasureWidthCalculator(
      this.musicDimensions.measureDimensions.width,
      this.music.getMeasureTimeSignature(0)
    );
    this.measureManager = new MeasureManager(
      renderData,
      this.musicDimensions,
      widthCalc,
      this.music.getMeasureTimeSignature.bind(this.music)
    );
    this.measureManager.compute();
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
      beatCanvas.drawMeasure({
        topLeft: measureData.start,
        width: measureData.width,
        height,
        containerPadding: padding,
        lineHeight,
        spaceHeight,
        bodyCount: this.bodyCt,
        aboveBelowComponentCount: this.aboveBelowCount,
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
            bodyCenter: center,
            type,
            direction: renderData.noteDirection,
            bodyHeight: spaceHeight,
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

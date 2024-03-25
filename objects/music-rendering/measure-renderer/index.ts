import { MeasureTransformer } from "@/objects/music/music-display-data/measure-transformer";
import { Music } from "@/objects/music/readonly-music";
import { MeasureManager } from "../measure-manager";
import { PageDimensionParams } from "../music-layout/page-dimension-params";
import { MusicLayout } from "../music-layout";
import { MeasureWidthCalculator } from "../measure-manager/measure-width-calculator";
import { BeatCanvas } from "../beat-canvas";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";

export class MeasureRenderer {
  private music: Music;
  private beatCanvas: BeatCanvas;
  private transformer: MeasureTransformer;
  private measureManager!: MeasureManager;
  private musicDimensions: MusicDimensionData;
  constructor(music: Music, beatCanvas: BeatCanvas) {
    this.music = music;
    this.beatCanvas = beatCanvas;
    this.transformer = new MeasureTransformer(music);
    const pageParams = PageDimensionParams.genericSheetMusic();
    this.musicDimensions = MusicLayout.getDimensions(pageParams);
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
  }

  public render() {
    this.initializeMeasureManager();
    const renderData = this.transformer.getMeasureRenderData();
    // renderData.forEach((measure, i) => {
    //     const
    // })
  }
}

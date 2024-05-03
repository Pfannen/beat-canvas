import { Measurements } from "@/objects/measurement/measurements";
import { MusicScore } from "@/types/music";
import { IScoreDrawerGetter } from "@/types/music-rendering/canvas/manager/score-manager";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { MeasureRenderer } from "../measure-renderer";

export class ScoreRenderer {
  private measureRenderer: MeasureRenderer;
  constructor(
    private score: MusicScore,
    private scoreGetter: IScoreDrawerGetter,
    private musicDimensions: MusicDimensionData,
    measurements: Measurements
  ) {
    this.measureRenderer = new MeasureRenderer(
      score.parts[0].measures,
      musicDimensions,
      scoreGetter,
      measurements
    );
  }

  private renderTitle() {
    const { pageDimensions } = this.musicDimensions;
    const y = pageDimensions.height - pageDimensions.musicMargins.top;
    const x = pageDimensions.width / 2;
    const scoreDrawer = this.scoreGetter.getScoreDrawerForPage(1);
    scoreDrawer.drawTitle({
      x,
      y,
      text: this.score.title,
      position: "bottomCenter",
    });
  }

  public render() {
    this.renderTitle();
    this.measureRenderer.render();
  }
}

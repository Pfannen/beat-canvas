import {
  IBeatCanvas,
  MeasureData,
} from "@/types/music-rendering/canvas/beat-canvas";
import { MeasureRenderer } from ".";
import { MeasureRenderDel } from "@/types/music-rendering";

export class MeasureOverlayRenderer extends MeasureRenderer {
  constructor(
    private onMeasureRender: MeasureRenderDel,
    ...args: ConstructorParameters<typeof MeasureRenderer>
  ) {
    super(...args);
  }

  protected drawMeasure(
    beatCanvas: IBeatCanvas,
    measureData: MeasureData
  ): void {
    this.onMeasureRender({
      measureIndex: measureData.measureIndex,
      width: measureData.totalWidth,
      height: this.musicDimensions.measureDimensions.height,
      topLeft: measureData.topLeft,
    });
    super.drawMeasure(beatCanvas, measureData);
  }
}

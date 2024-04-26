import { DeepPartial, UnitConverter } from "@/types";
import {
  BeatCanvasConstructor,
  BeatCanvasDrawOptions,
} from "@/types/music-rendering/canvas/beat-canvas";
import { RelativeClickableBeatCanvas } from ".";
import { ReactCanvasManager } from "../../drawing-canvas/react-drawing-canvas/manager";
import { BeatCanvasPropDelegates } from "@/types/music-rendering/canvas/beat-canvas/clickable-beat-canvas";
import { Measurements } from "@/objects/measurement/measurements";
import { ReactDrawingCanvas } from "../../drawing-canvas/react-drawing-canvas";

export class RelativeCanvasManager extends ReactCanvasManager {
  constructor(
    measurements: Measurements,
    private xValueConverter: UnitConverter<number, number>,
    private delegates?: BeatCanvasPropDelegates,
    private drawOptions?: DeepPartial<BeatCanvasDrawOptions>,
    private drawAboveBelow?: boolean
  ) {
    super("%", measurements);
  }

  protected getBeatCanvasConstructor(): BeatCanvasConstructor<ReactDrawingCanvas> {
    return (drawingCanvas, measurements) =>
      new RelativeClickableBeatCanvas(
        this.xValueConverter,
        drawingCanvas,
        measurements,
        this.delegates,
        this.drawOptions,
        this.drawAboveBelow
      );
  }
}

import { DeepPartial, UnitConverter } from "@/types";
import {
  BeatCanvasDrawOptions,
  IBeatCanvas,
} from "@/types/music-rendering/canvas/beat-canvas";
import { RelativeClickableBeatCanvas } from ".";
import { ReactCanvasManager } from "../../drawing-canvas/react-drawing-canvas/manager";
import { BeatCanvasPropDelegates } from "@/types/music-rendering/canvas/beat-canvas/clickable-beat-canvas";
import { Measurements } from "@/objects/measurement/measurements";

export class RelativeCanvasManager extends ReactCanvasManager {
  private beatCanvasPages: Map<number, RelativeClickableBeatCanvas> = new Map();
  constructor(
    measurements: Measurements,
    private xValueConverter: UnitConverter<number, number>,
    private delegates?: BeatCanvasPropDelegates,
    private drawOptions?: DeepPartial<BeatCanvasDrawOptions>,
    private drawAboveBelow?: boolean
  ) {
    super("%", measurements);
  }

  _getPage(pageNumber: number): IBeatCanvas {
    if (!this.beatCanvasPages.has(pageNumber)) {
      const drawingCanvas = this._getDrawingCanvasPage(pageNumber);
      const relativeCanvas = new RelativeClickableBeatCanvas(
        this.xValueConverter,
        drawingCanvas,
        this.measurements,
        this.delegates,
        this.drawOptions,
        this.drawAboveBelow
      );
      this.beatCanvasPages.set(pageNumber, relativeCanvas);
    }
    return this.beatCanvasPages.get(pageNumber)!;
  }
}

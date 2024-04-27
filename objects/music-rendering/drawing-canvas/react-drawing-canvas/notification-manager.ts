import { BeatCanvasConstructor } from "@/types/music-rendering/canvas/beat-canvas";
import { ReactDrawingCanvas } from ".";
import { ReactCanvasManager } from "./manager";
import { NotificationBeatCanvas } from "../../beat-canvas/notification-wrapper";
import { MeasureNotifier } from "@/types/music-rendering";

export class ReactNotificationManager extends ReactCanvasManager {
  constructor(
    private onMeasureDraw: MeasureNotifier,
    ...args: ConstructorParameters<typeof ReactCanvasManager>
  ) {
    super(...args);
  }
  public getBeatCanvasConstructor(): BeatCanvasConstructor<ReactDrawingCanvas> {
    return (drawingCanvas, measurements) => {
      const beatCanvas = super.getBeatCanvasConstructor()(
        drawingCanvas,
        measurements
      );
      return new NotificationBeatCanvas(beatCanvas, this.onMeasureDraw);
    };
  }
}

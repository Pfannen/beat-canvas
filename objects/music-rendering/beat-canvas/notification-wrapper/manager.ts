import { CanvasManager } from "@/types/music-rendering/canvas/canvas-manager";
import { IDrawingCanvas } from "@/types/music-rendering/canvas/drawing-canvas";
import { NotificationBeatCanvas } from ".";
import { MeasureNotifier } from "@/types/music-rendering";

export const withNotifications = <T extends IDrawingCanvas>(
  canvasManager: CanvasManager<T>,
  measureNotifier: MeasureNotifier
): CanvasManager<T> => {
  const originalGetBeatCanvasConstructor =
    canvasManager.getBeatCanvasConstructor;
  canvasManager.getBeatCanvasConstructor = () => (canvas, measurements) => {
    const constructor = originalGetBeatCanvasConstructor();
    const beatCanvas = constructor(canvas, measurements);
    return new NotificationBeatCanvas(beatCanvas, measureNotifier);
  };
  return canvasManager;
};

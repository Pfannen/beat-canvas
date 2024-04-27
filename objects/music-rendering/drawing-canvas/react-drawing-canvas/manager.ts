import { CanvasManager } from "@/types/music-rendering/canvas/canvas-manager";
import { ReactDrawingCanvas } from ".";
import { ReactNode } from "react";
import { Measurements } from "@/objects/measurement/measurements";
import { UnitMeasurement } from "@/types";
import { BeatCanvasConstructor } from "@/types/music-rendering/canvas/beat-canvas";

export class ReactCanvasManager extends CanvasManager<ReactDrawingCanvas> {
  constructor(
    measurements: Measurements,
    private unit: UnitMeasurement,
    beatCanvasConstructor?: BeatCanvasConstructor<ReactDrawingCanvas>
  ) {
    super(measurements);

    if (beatCanvasConstructor) {
      this.getBeatCanvasConstructor = () => (canvas, measurements) =>
        beatCanvasConstructor(canvas, measurements);
    }
  }

  createDrawingCanvas(): ReactDrawingCanvas {
    return new ReactDrawingCanvas(this.unit);
  }

  public createCanvas(
    pageNumber: number,
    ...args: Parameters<ReactDrawingCanvas["createCanvas"]>
  ) {
    return this.getDrawingCanvasPage(pageNumber)!.createCanvas(...args);
  }

  public getPages(...args: Parameters<ReactDrawingCanvas["createCanvas"]>) {
    const canvasCount = this.getPageCount();
    const canvases: ReactNode[] = [];
    for (let i = 0; i < canvasCount; i++) {
      canvases.push(this.createCanvas(i + 1, ...args));
    }
    return canvases;
  }
}

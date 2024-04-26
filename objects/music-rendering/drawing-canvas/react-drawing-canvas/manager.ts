import { CanvasManager } from "@/types/music-rendering/canvas/canvas-manager";
import { ReactDrawingCanvas } from ".";
import { ReactNode } from "react";
import { Measurements } from "@/objects/measurement/measurements";
import { UnitMeasurement } from "@/types";
import { BeatCanvasConstructor } from "@/types/music-rendering/canvas/beat-canvas";

export class ReactCanvasManager extends CanvasManager<ReactDrawingCanvas> {
  constructor(
    private unit: UnitMeasurement,
    private bCanvasConstructor: BeatCanvasConstructor<ReactDrawingCanvas>,
    measurements: Measurements
  ) {
    super(measurements);
  }

  protected getDrawingCanvasConstructor(): () => ReactDrawingCanvas {
    return () => {
      return new ReactDrawingCanvas(this.unit);
    };
  }

  protected getBeatCanvasConstructor(): BeatCanvasConstructor<ReactDrawingCanvas> {
    return this.bCanvasConstructor;
  }

  public createCanvas(
    pageNumber: number,
    ...args: Parameters<ReactDrawingCanvas["createCanvas"]>
  ) {
    return this._getDrawingCanvasPage(pageNumber)!.createCanvas(...args);
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

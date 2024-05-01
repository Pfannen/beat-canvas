import { Measurements } from "@/objects/measurement/measurements";
import { BeatCanvasConstructor, IBeatCanvas } from "../beat-canvas";
import { IDrawingCanvas } from "../drawing-canvas";
import { BeatCanvas } from "@/objects/music-rendering/beat-canvas";

export interface ICanvasGetter {
  getCanvasForPage(pageNumber: number): IBeatCanvas;
}

export abstract class CanvasManager<T extends IDrawingCanvas = IDrawingCanvas>
  implements ICanvasGetter
{
  private pages: T[] = [];
  public measurements: Measurements;
  constructor(measurements: Measurements) {
    this.measurements = measurements;
  }

  abstract createDrawingCanvas(): T;

  public getBeatCanvasConstructor(): BeatCanvasConstructor<T> {
    return (canvas, measurements) => {
      return new BeatCanvas(canvas, measurements);
    };
  }

  public addDrawingCanvasPage(): void {
    this.pages.push(this.createDrawingCanvas());
  }

  public getDrawingCanvasPage(pageNumber: number): T {
    return this.pages[pageNumber - 1];
  }

  public getPageCount(): number {
    return this.pages.length;
  }

  public getCanvasForPage(pageNumber: number) {
    const pageCount = this.getPageCount();
    for (let i = pageCount; i < pageNumber; i++) {
      this.addDrawingCanvasPage();
    }
    const beatCanvasConstructor = this.getBeatCanvasConstructor();
    return beatCanvasConstructor(
      this.getDrawingCanvasPage(pageNumber),
      this.measurements
    );
  }
}

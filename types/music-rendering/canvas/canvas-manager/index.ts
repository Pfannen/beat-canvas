import { Measurements } from "@/objects/measurement/measurements";
import { BeatCanvasConstructor } from "../beat-canvas";
import { IDrawingCanvas } from "../drawing-canvas";
import { BeatCanvas } from "@/objects/music-rendering/beat-canvas";

export abstract class CanvasManager<T extends IDrawingCanvas = IDrawingCanvas> {
  private beatCanvasConstructor!: BeatCanvasConstructor<T>;
  private drawingCanvasConstructor!: () => T;
  private pages: T[] = [];
  private measurements: Measurements;
  constructor(measurements: Measurements) {
    this.measurements = measurements;
    this.drawingCanvasConstructor = this.getDrawingCanvasConstructor();
    this.beatCanvasConstructor = this.getBeatCanvasConstructor();
  }

  protected abstract getDrawingCanvasConstructor(): () => T;

  protected getBeatCanvasConstructor(): BeatCanvasConstructor<T> {
    return (canvas, measurements) => new BeatCanvas(canvas, measurements);
  }

  private _addDrawingCanvasPage(): void {
    this.pages.push(this.drawingCanvasConstructor());
  }

  protected _getDrawingCanvasPage(pageNumber: number): T {
    return this.pages[pageNumber - 1];
  }

  public getPageCount(): number {
    return this.pages.length;
  }

  public getCanvasForPage(pageNumber: number) {
    const pageCount = this.getPageCount();
    for (let i = pageCount; i < pageNumber; i++) {
      this._addDrawingCanvasPage();
    }
    return this.beatCanvasConstructor(
      this._getDrawingCanvasPage(pageNumber),
      this.measurements
    );
  }
}

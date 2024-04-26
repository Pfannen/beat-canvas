import { Measurements } from "@/objects/measurement/measurements";
import { IBeatCanvas } from "../beat-canvas";

export abstract class CanvasManager {
  protected measurements: Measurements;
  constructor(beatCanvasMeasurements: Measurements) {
    this.measurements = beatCanvasMeasurements;
  }
  protected abstract _addPage(pageNumber: number): void;
  protected abstract _getPage(pageNumber: number): IBeatCanvas;
  abstract getPageCount(): number;

  getCanvasForPage(pageNumber: number) {
    const pageCount = this.getPageCount();
    for (let i = pageCount; i < pageNumber; i++) {
      this._addPage(i + 1);
    }
    return this._getPage(pageNumber);
  }
}

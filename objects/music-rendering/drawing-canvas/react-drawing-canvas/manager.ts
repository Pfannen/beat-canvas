import { UnitMeasurement } from "@/types";
import { IBeatCanvas } from "@/types/music-rendering/canvas/beat-canvas";
import { CanvasManager } from "@/types/music-rendering/canvas/canvas-manager";
import { ReactDrawingCanvas } from ".";
import { ReactNode } from "react";

export abstract class ReactCanvasManager extends CanvasManager {
  private pages: Map<number, ReactDrawingCanvas> = new Map();
  private unit: UnitMeasurement;
  constructor(
    unit: UnitMeasurement,
    ...args: ConstructorParameters<typeof CanvasManager>
  ) {
    super(...args);
    this.unit = unit;
  }

  protected _addPage(pageNumber: number): void {
    this.pages.set(pageNumber, new ReactDrawingCanvas(this.unit));
  }

  protected _getDrawingCanvasPage(pageNumber: number) {
    return this.pages.get(pageNumber)!;
  }

  abstract _getPage(pageNumber: number): IBeatCanvas;

  public getPageCount(): number {
    return this.pages.size;
  }

  public createCanvas(
    pageNumber: number,
    ...args: Parameters<ReactDrawingCanvas["createCanvas"]>
  ) {
    return this.pages.get(pageNumber)!.createCanvas(...args);
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

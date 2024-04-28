import { CanvasManager } from "@/types/music-rendering/canvas/canvas-manager";
import { CanvasDrawingCanvas } from ".";
import { ComponentProps, ReactNode } from "react";

export class CanvasCanvasManager extends CanvasManager<CanvasDrawingCanvas> {
  constructor(
    private canvasProps: ComponentProps<"canvas">,
    private height: number,
    ...args: ConstructorParameters<typeof CanvasManager>
  ) {
    super(...args);
  }

  createDrawingCanvas(): CanvasDrawingCanvas {
    return new CanvasDrawingCanvas(this.canvasProps, this.height);
  }

  public getPages() {
    const pageCount = this.getPageCount();
    const pages: ReactNode[] = [];
    for (let i = 0; i < pageCount; i++) {
      const drawingCanvas = this.getDrawingCanvasPage(i + 1);
      pages.push(drawingCanvas.getCanvas());
    }
    return pages;
  }
}

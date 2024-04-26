import { IDrawingCanvas } from "@/types/music-rendering/canvas/drawing-canvas";
import { PDFDocument } from "pdf-lib";
import { PDFLibDrawingCanvas } from ".";
import { BeatCanvas } from "../../beat-canvas";
import { CanvasManager } from "@/types/music-rendering/canvas/canvas-manager";

export class PDFLibCanvasManager extends CanvasManager {
  private pdfDoc?: PDFDocument;
  private pageSize: [number, number];
  private pages: Map<number, IDrawingCanvas> = new Map();
  constructor(
    pageSize: [number, number],
    ...args: ConstructorParameters<typeof CanvasManager>
  ) {
    super(...args);
    this.pageSize = pageSize;
  }

  protected _getPage(pageNumber: number) {
    const drawingCanvas = this.pages.get(pageNumber)!;
    return new BeatCanvas(drawingCanvas, this.measurements);
  }

  public getPageCount() {
    return this.pages.size;
  }

  private checkPDFDoc() {
    if (!this.pdfDoc) {
      throw new Error("PDFLibDrawingCanvasManager: Canvas not initialized");
    }
  }

  public async initializeCanvas() {
    this.pdfDoc = await PDFDocument.create();
  }

  protected _addPage(pageNumber: number) {
    this.checkPDFDoc();
    const newPage = this.pdfDoc!.addPage(this.pageSize);
    const drawCanvas = PDFLibDrawingCanvas.getDrawingCanvas(newPage);
    this.pages.set(pageNumber, drawCanvas);
  }

  public getPDF() {
    return this.pdfDoc;
  }
}

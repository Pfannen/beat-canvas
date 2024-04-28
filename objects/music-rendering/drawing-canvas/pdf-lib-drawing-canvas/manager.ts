import { PDFDocument } from "pdf-lib";
import { PDFLibDrawingCanvas } from ".";
import { CanvasManager } from "@/types/music-rendering/canvas/canvas-manager";
import { Measurements } from "@/objects/measurement/measurements";
import { IDrawingCanvas } from "@/types/music-rendering/canvas/drawing-canvas";

export class PDFLibCanvasManager extends CanvasManager {
  private pdfDoc?: PDFDocument;
  constructor(private pageSize: [number, number], measurements: Measurements) {
    super(measurements);
  }

  createDrawingCanvas(): IDrawingCanvas {
    this.checkPDFDoc();
    const newPage = this.pdfDoc!.addPage(this.pageSize);
    return PDFLibDrawingCanvas.getDrawingCanvas(newPage);
  }

  private checkPDFDoc() {
    if (!this.pdfDoc) {
      throw new Error("PDFLibDrawingCanvasManager: Canvas not initialized");
    }
  }

  public async initializeCanvas() {
    this.pdfDoc = await PDFDocument.create();
  }

  public getPDF() {
    return this.pdfDoc;
  }
}

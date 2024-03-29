import { IDrawingCanvas } from "@/types/music-rendering/canvas";
import { PDFDocument } from "pdf-lib";
import { PDFLibDrawingCanvas } from ".";
import { BeatCanvas } from "../../beat-canvas";

export class PDFLibDrawingCanvasManager {
  private pdfDoc?: PDFDocument;
  private pageSize: [number, number];
  private pageCount = 0;
  private pageIndexToCanvas: Map<number, IDrawingCanvas> = new Map();
  constructor(pageSize: [number, number]) {
    this.pageSize = pageSize;
  }

  private checkPDFDoc() {
    if (!this.pdfDoc) {
      throw new Error("PDFLibDrawingCanvasManager: Canvas not initialized");
    }
  }

  public async initializeCanvas() {
    this.pdfDoc = await PDFDocument.create();
  }

  public addPage() {
    this.checkPDFDoc();
    const newPage = this.pdfDoc!.addPage(this.pageSize);
    const drawCanvas = PDFLibDrawingCanvas.getDrawingCanvas(newPage);
    this.pageIndexToCanvas.set(this.pageCount, drawCanvas);
    this.pageCount++;
  }

  public getDrawingCanvasForPage(pageNumber: number) {
    this.checkPDFDoc();
    const pageGap = pageNumber - this.pageCount;
    for (let i = pageGap; i > 0; i--) {
      // Generate needed pages to get "pageNumber" number of pages
      this.addPage();
    }
    const pageIndex = pageNumber - 1;
    return this.pageIndexToCanvas.get(pageIndex)!;
  }

  public getBeatCanvasForPage(pageNumber: number) {
    const drawingCanvas = this.getDrawingCanvasForPage(pageNumber);
    return new BeatCanvas(drawingCanvas);
  }

  public getPDF() {
    return this.pdfDoc;
  }
}

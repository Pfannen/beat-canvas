import { PDFDocument, PageSizes } from "pdf-lib";
import { PDFLibDrawingCanvas } from "../pdf-lib-drawing-canvas";
import { BeatCanvas } from "../beat-canvas";

export const drawPDF = async () => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage(PageSizes.A4);

  const page = pdfDoc.getPage(0);
  const drawCanvas = PDFLibDrawingCanvas.getDrawingCanvas(page);
  const beatCanvas = new BeatCanvas(drawCanvas);
  const { width, height } = page.getSize();

  beatCanvas.drawNote({
    bodyCenter: { x: width / 2, y: height / 2 },
    bodyHeight: 10,
    direction: "up",
    type: "quarter",
  });

  // drawMeasureLines(drawCanvas, {
  //   start: { x: 0, y: height },
  //   length: 200,
  //   lineHeight: 3,
  //   spaceHeight: 20,
  // });

  return await pdfDoc.save();
};

export const pdfToUrl = (pdf: Uint8Array) => {
  const pdfArray: number[] = [];
  pdf.forEach((byte) => pdfArray.push(byte));
  const base64 = btoa(String.fromCharCode(...pdfArray));
  return `data:application/pdf;base64,${base64}`;
};

import { PDFDocument, PDFPage, PageSizes, drawLine } from "pdf-lib";
import { Coordinate } from "../measurement/types";

export const drawPDF = async () => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage(PageSizes.A4);

  const page = pdfDoc.getPage(0);
  const { width, height } = page.getSize();
  drawMeasureLines(page, {
    start: { x: 0, y: height - 1 },
    length: 50,
    lineHeight: 3,
    spaceHeight: 20,
  });

  return await pdfDoc.save();
};

export const pdfToUrl = (pdf: Uint8Array) => {
  const pdfArray: number[] = [];
  pdf.forEach((byte) => pdfArray.push(byte));
  const base64 = btoa(String.fromCharCode(...pdfArray));
  return `data:application/pdf;base64,${base64}`;
};

const drawMeasureLines = (
  page: PDFPage,
  args: {
    start: Coordinate;
    length: number;
    lineHeight: number;
    spaceHeight: number;
  }
) => {
  let start = args.start;
  for (let i = 0; i < 5; i++) {
    page.drawLine({
      start,
      end: { ...start, x: start.x + args.length },
      thickness: args.lineHeight,
    });
    start = { ...start, y: start.y - args.spaceHeight };
  }
};

import { PDFDocument, PageSizes } from "pdf-lib";
import { PDFLibDrawingCanvas } from "../pdf-lib-drawing-canvas";
import { BeatCanvas } from "../beat-canvas";
import { MeasureRenderer } from "../measure-renderer";
import { Music } from "@/objects/music/readonly-music";

export const drawPDF = async () => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage(PageSizes.A4);

  const page = pdfDoc.getPage(0);
  const drawCanvas = PDFLibDrawingCanvas.getDrawingCanvas(page);
  const beatCanvas = new BeatCanvas(drawCanvas);
  const music = new Music();
  music.setMeasures([
    {
      notes: [
        { x: 0, y: 0, type: "quarter" },
        { x: 1, y: 0, type: "quarter" },
        { x: 2, y: 0, type: "quarter" },
        { x: 3, y: 0, type: "quarter" },
      ],
    },
  ]);
  const renderer = new MeasureRenderer(music, beatCanvas, 6);
  renderer.render();
  // const { width, height } = page.getSize();

  // beatCanvas.drawNote({
  //   bodyCenter: { x: width / 2, y: height / 2 },
  //   bodyHeight: 10,
  //   direction: "up",
  //   type: "quarter",
  // });

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

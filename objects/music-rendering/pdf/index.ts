import { PageSizes } from "pdf-lib";
import { MeasureRenderer } from "../measure-renderer";
import { Music } from "@/objects/music/readonly-music";
import { Measure } from "@/components/providers/music/types";
import { PDFLibDrawingCanvasManager } from "../pdf-lib-drawing-canvas/manager";

export const drawPDF = async () => {
  const pdfLibManager = new PDFLibDrawingCanvasManager(PageSizes.A4);
  await pdfLibManager.initializeCanvas();
  const music = new Music();
  const measures: Measure[] = [];
  const measureCount = 26;
  for (let i = 0; i < measureCount; i++) {
    measures.push({
      notes: [
        { x: 0, y: 1, type: "quarter" },
        { x: 1, y: 2, type: "quarter" },
        { x: 2, y: 3, type: "quarter" },
        { x: 3, y: -1, type: "quarter" },
      ],
    });
  }
  music.setMeasures(measures);
  const renderer = new MeasureRenderer(
    music,
    6,
    pdfLibManager.getBeatCanvasForPage.bind(pdfLibManager)
  );
  renderer.render();

  return await pdfLibManager.getPDF()!.save();
};

export const pdfToUrl = (pdf: Uint8Array) => {
  const pdfArray: number[] = [];
  pdf.forEach((byte) => pdfArray.push(byte));
  const base64 = btoa(String.fromCharCode(...pdfArray));
  return `data:application/pdf;base64,${base64}`;
};

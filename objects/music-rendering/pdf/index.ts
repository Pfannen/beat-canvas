import { PageSizes } from "pdf-lib";
import { MeasureRenderer } from "../measure-renderer";
import { Music } from "@/objects/music/readonly-music";
import { Measure } from "@/components/providers/music/types";
import { PDFLibDrawingCanvasManager } from "../drawing-canvas/pdf-lib-drawing-canvas/manager";
import { PageDimensionParams } from "../music-layout/page-dimension-params";
import { MusicLayout } from "../music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { ABOVE_BELOW_CT, BODY_CT } from "@/objects/measurement/constants";

export const drawPDF = async () => {
  const pdfLibManager = new PDFLibDrawingCanvasManager(PageSizes.A4);
  await pdfLibManager.initializeCanvas();
  const music = new Music();
  const measures: Measure[] = [];
  const measureCount = 1;
  for (let i = 0; i < measureCount; i++) {
    measures.push({
      notes: [
        { x: 0, y: -2, type: "sixteenth" },
        { x: 0.25, y: -1, type: "sixteenth" },
        { x: 0.5, y: 0, type: "sixteenth" },
        { x: 0.75, y: 1, type: "sixteenth" },
        // { x: 0, y: -2, type: "eighth" },
        // { x: 0.5, y: 3, type: "eighth" },
        // { x: 1, y: 10, type: "quarter" },
        // { x: 2, y: -1, type: "eighth" },
        // { x: 2.5, y: -1, type: "eighth" },
        // { x: 3, y: -1, type: "eighth" },
        // { x: 3.5, y: -1, type: "eighth" },
      ],
    });
  }
  const pageParams = PageDimensionParams.genericSheetMusic();
  const dimensions = MusicLayout.getDimensions(pageParams);
  const measurements = new Measurements(ABOVE_BELOW_CT, BODY_CT, 3);
  music.setMeasures(measures);
  const renderer = new MeasureRenderer(
    music,
    dimensions,
    pdfLibManager.getBeatCanvasForPage.bind(pdfLibManager),
    measurements,
    BODY_CT
  );
  renderer.render();

  return await pdfLibManager.getPDF()!.save();
  // const pdfDoc = await PDFDocument.create();
  // pdfDoc.addPage([400, 400]);
  // pdfDoc.getPage(0).drawRectangle({
  //   x: 200,
  //   y: 200,
  //   width: 2,
  //   height: 25,
  //   rotate: degrees(-45),
  // });
  // pdfDoc.getPage(0).drawCircle({
  //   x: 200,
  //   y: 200,
  //   size: 5,
  // });

  // return pdfDoc.save();
};

export const pdfToUrl = (pdf: Uint8Array) => {
  const pdfArray: number[] = [];
  pdf.forEach((byte) => pdfArray.push(byte));
  const base64 = btoa(String.fromCharCode(...pdfArray));
  return `data:application/pdf;base64,${base64}`;
};

import { PDFDocument, PageSizes, degrees, rgb } from "pdf-lib";
import { MeasureRenderer } from "../measure-renderer";
import { Music } from "@/objects/music/readonly-music";
import { Measure, Note } from "@/components/providers/music/types";
import { PDFLibDrawingCanvasManager } from "../drawing-canvas/pdf-lib-drawing-canvas/manager";
import { PageDimensionParams } from "../music-layout/page-dimension-params";
import { MusicLayout } from "../music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { ABOVE_BELOW_CT, BODY_CT } from "@/objects/measurement/constants";

export const drawPDF = async () => {
  // const pdfLibManager = new PDFLibDrawingCanvasManager(PageSizes.A4);
  // await pdfLibManager.initializeCanvas();
  // const music = new Music();
  // const measures: Measure[] = [];
  // measures.push({ notes: increasingDown });
  // measures.push({ notes: increasingUp });
  // measures.push({ notes: decreasingDown });
  // measures.push({ notes: decreasingUp });
  // measures.push({ notes: constantUp });
  // measures.push({ notes: constantDown });
  // measures.push({ notes: nonOrderedUp });
  // measures.push({ notes: nonOrderedDown });
  // measures.push({ notes: [] });
  // const pageParams = PageDimensionParams.genericSheetMusic();
  // const dimensions = MusicLayout.getDimensions(pageParams);
  // const measurements = new Measurements(ABOVE_BELOW_CT, BODY_CT, 3);
  // music.setMeasures(measures);
  // const renderer = new MeasureRenderer(
  //   music,
  //   dimensions,
  //   pdfLibManager.getBeatCanvasForPage.bind(pdfLibManager),
  //   measurements,
  //   BODY_CT
  // );
  // renderer.render();

  // return await pdfLibManager.getPDF()!.save();
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([400, 400]);
  const page = pdfDoc.getPage(0);
  page.drawCircle({
    x: 200,
    y: 200,
    size: 5,
  });
  const aspectRatio = 0.5048;
  const scale = 5;
  const { x, y } = centerToTopLeft(200, 200, scale);

  page.drawSvgPath(
    "M0.751874 0.667827c-0.00133833 0.0588865 -0.0281049 0.108137 -0.0570128 0.156852 -0.0339936 0.0575482 -0.0819058 0.102248 -0.132227 0.144807 -0.0115096 0.00990364 -0.0238223 0.0195396 -0.0364026 0.0281049 -0.00374732 0.00240899 -0.010439 0.00321199 -0.0147216 0.001606 -0.0117773 -0.00455032 -0.0133833 -0.0141863 -0.00374732 -0.0224839 0.017666 -0.0155246 0.0364026 -0.0297109 0.0535332 -0.0455032 0.0396146 -0.0358672 0.0757495 -0.0741435 0.101713 -0.12152 0.0264989 -0.0479122 0.0372056 -0.0990364 0.0361349 -0.15364 -0.00107066 -0.0484475 -0.0206103 -0.0883298 -0.0481799 -0.126606 -0.0305139 -0.0420236 -0.0698608 -0.0741435 -0.111884 -0.103587 -0.0736081 -0.0516595 -0.140257 -0.0845824 -0.239293 -0.131424C0.27757 0.283994 0.259368 0.275696 0.247591 0.270343 0.247591 0.180139 0.247591 0.0902034 0.247859 0 0.262045 0 0.275696 0 0.289079 0.000267666c0.00187366 0 0.00455032 0.00347966 0.00535332 0.00588865 0.015257 0.0374732 0.0342612 0.0722698 0.0594218 0.103854 0.0374732 0.0468415 0.0805675 0.0880621 0.12955 0.122323 0.0473769 0.0331906 0.0926124 0.0687901 0.133565 0.109475 0.0610278 0.0602248 0.107334 0.129015 0.127141 0.213597 0.00856531 0.0372056 0.00883298 0.0746788 0.00776231 0.11242z",
    {
      scale: 40,
      x: 200 - (1 / aspectRatio) * scale * ((1 - aspectRatio) / 2),
      y: 200,
      color: rgb(1, 0, 0),
    }
  );
  page.drawSvgPath(
    "M18.84,24.95c-.05,2.2-1.05,4.04-2.13,5.86-1.27,2.15-3.06,3.82-4.94,5.41-.43.37-.89.73-1.36,1.05-.14.09-.39.12-.55.06-.44-.17-.5-.53-.14-.84.66-.58,1.36-1.11,2-1.7,1.48-1.34,2.83-2.77,3.8-4.54.99-1.79,1.39-3.7,1.35-5.74-.04-1.81-.77-3.3-1.8-4.73-1.14-1.57-2.61-2.77-4.18-3.87-2.75-1.93-5.24-3.16-8.94-4.91C1.12,10.61.44,10.3,0,10.1,0,6.73,0,3.37.01,0,.54,0,1.05,0,1.55.01c.07,0,.17.13.2.22.57,1.4,1.28,2.7,2.22,3.88,1.4,1.75,3.01,3.29,4.84,4.57,1.77,1.24,3.46,2.57,4.99,4.09,2.28,2.25,4.01,4.82,4.75,7.98.32,1.39.33,2.79.29,4.2Z",
    { x: 200, y: 200, scale: 1, color: rgb(0, 0, 0), rotate: degrees(90) }
  );

  return pdfDoc.save();
};

const centerToTopLeft = (x: number, y: number, scale: number) => {
  x -= scale / 2;
  y += scale / 2;
  return { x, y };
};

export const pdfToUrl = (pdf: Uint8Array) => {
  const pdfArray: number[] = [];
  pdf.forEach((byte) => pdfArray.push(byte));
  const base64 = btoa(String.fromCharCode(...pdfArray));
  return `data:application/pdf;base64,${base64}`;
};

const increasingDown: Note[] = [
  { x: 0, y: -2, type: "sixteenth" },
  { x: 0.25, y: -1, type: "sixteenth" },
  { x: 0.5, y: 4, type: "sixteenth" },
  { x: 0.75, y: 6, type: "sixteenth" },
];

const increasingUp: Note[] = [
  { x: 0, y: -3, type: "sixteenth" },
  { x: 0.25, y: 1, type: "sixteenth" },
  { x: 0.5, y: 2, type: "sixteenth" },
  { x: 0.75, y: 3, type: "sixteenth" },
];

const decreasingDown: Note[] = [
  { x: 0, y: 5, type: "sixteenth" },
  { x: 0.25, y: 4, type: "sixteenth" },
  { x: 0.5, y: -3, type: "sixteenth" },
  { x: 0.75, y: -4, type: "sixteenth" },
];

const decreasingUp: Note[] = [
  { x: 0, y: 3, type: "sixteenth" },
  { x: 0.25, y: 2, type: "sixteenth" },
  { x: 0.5, y: -1, type: "sixteenth" },
  { x: 0.75, y: -4, type: "sixteenth" },
];

const constantUp: Note[] = [
  { x: 0, y: 3, type: "sixteenth" },
  { x: 0.25, y: 3, type: "sixteenth" },
  { x: 0.5, y: 3, type: "sixteenth" },
  { x: 0.75, y: 3, type: "sixteenth" },
];

const constantDown: Note[] = [
  { x: 0, y: 4, type: "sixteenth" },
  { x: 0.25, y: 4, type: "sixteenth" },
  { x: 0.5, y: 4, type: "sixteenth" },
  { x: 0.75, y: 4, type: "sixteenth" },
];

const nonOrderedUp: Note[] = [
  { x: 0, y: 3, type: "sixteenth" },
  { x: 0.25, y: -4, type: "sixteenth" },
  { x: 0.5, y: -1, type: "sixteenth" },
  { x: 0.75, y: 3, type: "sixteenth" },
];

const nonOrderedDown: Note[] = [
  { x: 0, y: 6, type: "sixteenth" },
  { x: 0.25, y: 9, type: "sixteenth" },
  { x: 0.5, y: 7, type: "sixteenth" },
  { x: 0.75, y: 6, type: "sixteenth" },
];

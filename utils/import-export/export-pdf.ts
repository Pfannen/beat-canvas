"use server";

import { headers } from "next/headers";
import { Measure } from "@/components/providers/music/types";
import {
  ABOVE_BELOW_CT,
  BODY_CT,
  LINES_PER_PAGE,
  LINE_TO_SPACE_R,
  MEASURES_PER_LINE,
} from "@/constants/music-dimensions";
import { Measurements } from "@/objects/measurement/measurements";
import { PDFLibCanvasManager } from "@/objects/music-rendering/drawing-canvas/pdf-lib-drawing-canvas/manager";
import { MeasureRenderer } from "@/objects/music-rendering/measure-renderer";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { PageDimensionParams } from "@/objects/music-rendering/music-layout/page-dimension-params";
import { PageSizes } from "pdf-lib";

export const pdfToUrl = (pdf: Uint8Array) => {
  const pdfArray: number[] = [];
  pdf.forEach((byte) => pdfArray.push(byte));
  const base64 = btoa(String.fromCharCode(...pdfArray));
  return `data:application/pdf;base64,${base64}`;
};

export const createPDFFromMeasures = async (measures: Measure[]) => {
  const pageParams = PageDimensionParams.genericSheetMusic(
    MEASURES_PER_LINE,
    LINES_PER_PAGE
  );
  const dimensions = MusicLayout.getDimensions(pageParams);
  const measurements = new Measurements(
    ABOVE_BELOW_CT,
    BODY_CT,
    LINE_TO_SPACE_R,
    dimensions.measureDimensions
  );
  const pdfLibManager = new PDFLibCanvasManager(PageSizes.A4, measurements);
  await pdfLibManager.initializeCanvas();

  const renderer = new MeasureRenderer(
    measures,
    dimensions,
    pdfLibManager,
    measurements
  );
  renderer.render();

  return await pdfLibManager.getPDF()!.save();
};

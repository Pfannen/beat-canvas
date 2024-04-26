"use client";

import { Measure } from "@/components/providers/music/types";
import { ABOVE_BELOW_CT, BODY_CT } from "@/objects/measurement/constants";
import { Measurements } from "@/objects/measurement/measurements";
import { RelativeCanvasManager } from "@/objects/music-rendering/beat-canvas/relative-clickable-beat-canvas/manager";
import { ReactDrawingCanvas } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas";
import { MeasureRenderer } from "@/objects/music-rendering/measure-renderer";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { PageDimensionParams } from "@/objects/music-rendering/music-layout/page-dimension-params";
import { PropDelegates } from "@/types/music-rendering/canvas/beat-canvas/clickable-beat-canvas";
import { CanvasManager } from "@/types/music-rendering/canvas/canvas-manager";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { ReactNode } from "react";

export const renderMeasures = (measures: Measure[], manager: CanvasManager) => {
  const pageParams = PageDimensionParams.genericSheetMusic();
  const dimensions = MusicLayout.getDimensions(pageParams);
  const measurements = new Measurements(
    ABOVE_BELOW_CT,
    BODY_CT,
    3,
    dimensions.measureDimensions
  );
  const renderer = new MeasureRenderer(
    measures,
    dimensions,
    manager,
    measurements
  );
  renderer.render();
};

const createMockMeasures = () => {
  const measures: Measure[] = [];
  const measureCount = 2;
  for (let i = 0; i < measureCount; i++) {
    measures.push({
      notes: [
        { x: 0, y: -1, type: "eighth" },
        { x: 0.5, y: 1, type: "eighth" },
        { x: 1, y: 10, type: "quarter" },
        { x: 2, y: -1, type: "eighth" },
        { x: 2.5, y: -1, type: "eighth" },
        { x: 3, y: -1, type: "eighth" },
        { x: 3.5, y: -1, type: "eighth" },
      ],
    });
  }
  return measures;
};

export const getHTMLCanvas = (
  aspectRatio: number,
  measures: Measure[],
  musicDimensions: MusicDimensionData,
  delegates?: Partial<PropDelegates>,
  lineToSpaceRatio = 3
) => {
  const converter = (xValue: number) => xValue / aspectRatio;
  const measurements = new Measurements(
    ABOVE_BELOW_CT,
    BODY_CT,
    lineToSpaceRatio,
    musicDimensions.measureDimensions
  );

  const manager = new RelativeCanvasManager(
    measurements,
    converter,
    delegates,
    { note: { noteBodyAspectRatio: 1.5 / aspectRatio } },
    false
  );

  const renderer = new MeasureRenderer(
    measures,
    musicDimensions,
    manager,
    measurements
  );
  renderer.render();
  const canvasCount = manager.getPageCount();
  const canvases: ReactNode[] = [];
  for (let i = 0; i < canvasCount; i++) {
    canvases.push(
      manager.createCanvas(i, {
        style: { position: "relative", width: "100%", height: "100%" },
      })
    );
  }
  return canvases;
};

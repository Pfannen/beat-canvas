"use client";

import { Measure } from "@/components/providers/music/types";
import {
  ABOVE_BELOW_CT,
  BODY_CT,
  LINES_PER_PAGE,
  LINE_TO_SPACE_R,
  MEASURES_PER_LINE,
} from "@/constants/music-dimensions";
import { Measurements } from "@/objects/measurement/measurements";
import { MeasureRenderer } from "@/objects/music-rendering/measure-renderer";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { PageDimensionParams } from "@/objects/music-rendering/music-layout/page-dimension-params";
import { DeepPartial, UnitConverter } from "@/types";
import { UnitConverters } from "@/types/music-rendering";
import { BeatCanvasDrawOptions } from "@/types/music-rendering/canvas/beat-canvas";
import { CanvasManager } from "@/types/music-rendering/canvas/manager/canvas-manager";

export const renderMeasures = (measures: Measure[], manager: CanvasManager) => {
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
  const renderer = new MeasureRenderer(
    measures,
    dimensions,
    manager,
    measurements
  );
  renderer.render();
};

export const createXValueConverter = (
  aspectRatio: number
): UnitConverter<number, number> => {
  return (xValue: number) => xValue / aspectRatio;
};

export const createYValueConverter = (
  aspectRatio: number
): UnitConverter<number, number> => {
  return (yValue: number) => aspectRatio * yValue;
};

export const createUnitConverters = (aspectRatio: number): UnitConverters => {
  return {
    x: createXValueConverter(aspectRatio),
    y: createYValueConverter(aspectRatio),
  };
};

export const getRedundantConverter = (): UnitConverter<number, number> => {
  return (val) => val;
};

export const getRelativeCanvasDrawOptions = (
  aspectRatio: number
): DeepPartial<BeatCanvasDrawOptions> => {
  const xConverter = createXValueConverter(aspectRatio);
  console.log("here");
  return {
    note: {
      noteBodyAspectRatio: xConverter(1.5),
      dotAnnotationAspectRatio: xConverter(1),
      stemWidthBodyFraction: xConverter(0.15),
    },
    measure: {
      endBarWidthLineFraction: xConverter(1.25),
    },
  };
};

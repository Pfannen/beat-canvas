"use client";

import { FunctionComponent, useMemo } from "react";
import { Measure } from "@/components/providers/music/types";
import MusicCanvas from "..";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import {
  ABOVE_BELOW_CT,
  BODY_CT,
  LINE_TO_SPACE_R,
} from "@/constants/music-dimensions";
import {
  MeasureNotifierArgs,
  MeasureRenderArgs,
} from "@/types/music-rendering";
import { ReactCanvasManager } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas/manager";
import { withNotifications } from "@/objects/music-rendering/beat-canvas/notification-wrapper/manager";
import React from "react";
import { UnitMeasurement } from "@/types";
import { createUnitConverters } from "@/utils/music-rendering";

type MeasureSelectCanvasProps = {
  measures: Measure[];
  height: number;
  aspectRatio: number;
  unit: UnitMeasurement;
  onMeasureRendered: (args: MeasureRenderArgs) => void;
};

const MeasureSelectCanvas: FunctionComponent<MeasureSelectCanvasProps> = ({
  measures,
  height,
  aspectRatio,
  unit,
  onMeasureRendered,
}) => {
  const dimensions = useMemo(
    () =>
      MusicLayout.getMarginlessSheetMusic(
        height * aspectRatio,
        height,
        undefined,
        5
      ),
    []
  );
  const measurements = useMemo(
    () =>
      new Measurements(
        ABOVE_BELOW_CT,
        BODY_CT,
        LINE_TO_SPACE_R,
        dimensions.measureDimensions
      ),
    []
  );
  const onMeasureRender = (args: MeasureNotifierArgs) => {
    const renderArgs: MeasureRenderArgs = {
      ...args,
      height: dimensions.measureDimensions.height,
      unit,
    };
    onMeasureRendered(renderArgs);
  };

  const manager = new ReactCanvasManager(
    measurements,
    unit,
    aspectRatio,
    false
  );
  withNotifications(manager, onMeasureRender);
  const unitConverts =
    unit === "%" ? createUnitConverters(aspectRatio) : undefined;

  return (
    <MusicCanvas
      measures={measures}
      measurements={measurements}
      dimensions={dimensions}
      manager={manager}
      unitConverters={unitConverts}
      unit={unit}
    />
  );
};

export default MeasureSelectCanvas;

export const MemoizedMeasureSelectedCanvas = React.memo(
  MeasureSelectCanvas,
  (prevProps, nextProps) => prevProps.measures === nextProps.measures
);

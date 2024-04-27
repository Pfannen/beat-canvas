"use client";

import { FunctionComponent, useMemo } from "react";
import { Measure } from "@/components/providers/music/types";
import MusicCanvas from "..";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { ABOVE_BELOW_CT, BODY_CT } from "@/objects/measurement/constants";
import {
  MeasureNotifierArgs,
  MeasureRenderArgs,
} from "@/types/music-rendering";
import { toPercent } from "@/utils";
import { ReactCanvasManager } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas/manager";
import { withNotifications } from "@/objects/music-rendering/beat-canvas/notification-wrapper/manager";

type MeasureSelectCanvasProps = {
  measures: Measure[];
  aspectRatio: number;
  onMeasureRendered: (args: MeasureRenderArgs) => void;
};

const MeasureSelectCanvas: FunctionComponent<MeasureSelectCanvasProps> = ({
  measures,
  aspectRatio,
  onMeasureRendered,
}) => {
  const dimensions = useMemo(
    () => MusicLayout.getMarginlessSheetMusic(100, 100),
    []
  );
  const measurements = useMemo(
    () =>
      new Measurements(
        ABOVE_BELOW_CT,
        BODY_CT,
        3,
        dimensions.measureDimensions
      ),
    []
  );

  const onMeasureRender = (args: MeasureNotifierArgs) => {
    const renderArgs = {
      topLeft: {
        x: toPercent(args.topLeft.x),
        y: toPercent(100 - args.topLeft.y),
      },
      width: toPercent(args.width),
      height: toPercent(dimensions.measureDimensions.height),
      measureIndex: args.measureIndex,
    };
    onMeasureRendered(renderArgs);
  };

  const manager = new ReactCanvasManager(measurements, "%", aspectRatio, false);
  withNotifications(manager, onMeasureRender);

  return (
    <MusicCanvas
      measures={measures}
      measurements={measurements}
      dimensions={dimensions}
      manager={manager}
    />
  );
};

export default MeasureSelectCanvas;

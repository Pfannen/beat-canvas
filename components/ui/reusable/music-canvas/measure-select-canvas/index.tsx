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
import { ReactNotificationManager } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas/notification-manager";
import { getRelativeBeatCanvas } from "@/utils/music-rendering/react";
import { BeatCanvasConstructor } from "@/types/music-rendering/canvas/beat-canvas";
import { ReactDrawingCanvas } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas";
import { toPercent } from "@/utils";
import { ReactCanvasManager } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas/manager";
import { withNotifications } from "@/objects/music-rendering/beat-canvas/notification-wrapper/manager";

type MeasureSelectCanvasProps = {
  aspectRatio: number;
  measures: Measure[];
  onMeasureRendered: (args: MeasureRenderArgs) => void;
};

const MeasureSelectCanvas: FunctionComponent<MeasureSelectCanvasProps> = ({
  aspectRatio,
  measures,
  onMeasureRendered,
}) => {
  const dimensions = useMemo(
    () => MusicLayout.getMarginlessSheetMusic(aspectRatio),
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

  const relativeBeatCanvas: BeatCanvasConstructor<ReactDrawingCanvas> = (
    drawingCanvas,
    measurements
  ) => getRelativeBeatCanvas(drawingCanvas, aspectRatio, measurements);
  const manager = new ReactCanvasManager(measurements, "%", relativeBeatCanvas);
  withNotifications(manager, onMeasureRender);

  return (
    <MusicCanvas
      measures={measures}
      measurements={measurements}
      dimensions={MusicLayout.getMarginlessSheetMusic(aspectRatio)}
      manager={manager}
    />
  );
};

export default MeasureSelectCanvas;

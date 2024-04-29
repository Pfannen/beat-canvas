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
} from "@/objects/measurement/constants";
import {
  MeasureNotifierArgs,
  MeasureRenderArgs,
} from "@/types/music-rendering";
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
        LINE_TO_SPACE_R,
        dimensions.measureDimensions
      ),
    []
  );

  const onMeasureRender = (args: MeasureNotifierArgs) => {
    const renderArgs: MeasureRenderArgs = {
      ...args,
      height: dimensions.measureDimensions.height,
      unit: "%",
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
      aspectRatio={aspectRatio}
    />
  );
};

export default MeasureSelectCanvas;

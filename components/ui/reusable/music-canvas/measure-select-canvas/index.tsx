"use client";

import { FunctionComponent, useMemo } from "react";
import { MeasureIdentifier } from "@/types/music-rendering/canvas/beat-canvas/clickable-beat-canvas";
import { Measure } from "@/components/providers/music/types";
import MusicCanvas from "..";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { ABOVE_BELOW_CT, BODY_CT } from "@/objects/measurement/constants";
import { MeasureNotifier } from "@/types/music-rendering";
import { ReactNotificationManager } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas/notification-manager";
import { RelativeClickableBeatCanvas } from "@/objects/music-rendering/beat-canvas/relative-clickable-beat-canvas";
import { getRelativeBeatCanvas } from "@/utils/music-rendering/react";
import { BeatCanvasConstructor } from "@/types/music-rendering/canvas/beat-canvas";
import { ReactDrawingCanvas } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas";

type MeasureSelectCanvasProps = {
  aspectRatio: number;
  measures: Measure[];
  onMeasureRendered: MeasureNotifier;
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

  const relativeBeatCanvas: BeatCanvasConstructor<ReactDrawingCanvas> = (
    drawingCanvas,
    measurements
  ) => getRelativeBeatCanvas(drawingCanvas, aspectRatio, measurements);
  const manager = new ReactNotificationManager(
    onMeasureRendered,
    "%",
    relativeBeatCanvas,
    measurements
  );
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

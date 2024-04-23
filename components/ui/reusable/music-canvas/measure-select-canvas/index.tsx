"use client";

import { FunctionComponent, useMemo } from "react";
import { MeasureIdentifier } from "@/types/music-rendering/canvas/beat-canvas/clickable-beat-canvas";
import { Measure } from "@/components/providers/music/types";
import MusicCanvas from "..";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { ABOVE_BELOW_CT, BODY_CT } from "@/objects/measurement/constants";

type MeasureSelectCanvasProps = {
  aspectRatio: number;
  measures: Measure[];
  onMeasureClick: (identifier: MeasureIdentifier) => void;
  getMeasureClassName: (identifier: MeasureIdentifier) => string;
};

const MeasureSelectCanvas: FunctionComponent<MeasureSelectCanvasProps> = ({
  aspectRatio,
  measures,
  onMeasureClick,
  getMeasureClassName,
}) => {
  const measurements = useMemo(
    () => new Measurements(ABOVE_BELOW_CT, BODY_CT, 3),
    []
  );
  const getMeasureProps = (identifier: MeasureIdentifier) => {
    return {
      onClick: onMeasureClick.bind(null, identifier),
      className: getMeasureClassName(identifier),
    };
  };
  return (
    <MusicCanvas
      measures={measures}
      measurements={measurements}
      aspectRatio={aspectRatio}
      dimensions={MusicLayout.getMarginlessSheetMusic(aspectRatio)}
      propDelegates={{ getMeasureProps }}
    />
  );
};

export default MeasureSelectCanvas;

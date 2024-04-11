"use client";

import { FunctionComponent } from "react";
import { MeasureIdentifier } from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { Measure } from "@/components/providers/music/types";
import MusicCanvas from "..";
import { MusicLayout } from "@/objects/music-rendering/music-layout";

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
  const getMeasureProps = (identifier: MeasureIdentifier) => {
    return {
      onClick: onMeasureClick.bind(null, identifier),
      className: getMeasureClassName(identifier),
    };
  };
  return (
    <MusicCanvas
      measures={measures}
      aboveBelowCount={6}
      aspectRatio={aspectRatio}
      dimensions={MusicLayout.getMarginlessSheetMusic(aspectRatio)}
      lineToSpaceRatio={3}
      propDelegates={{ getMeasureProps }}
    />
  );
};

export default MeasureSelectCanvas;

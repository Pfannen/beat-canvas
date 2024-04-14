import { BeatCanvasPropDelegates } from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { FunctionComponent, ReactNode } from "react";
import { Measure } from "@/components/providers/music/types";
import {
  drawMeasures,
  getRelativeBeatCanvas,
} from "@/utils/music-rendering/react";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";

type MusicCanvasProps = {
  measures: Measure[];
  aboveBelowCount: number;
  aspectRatio: number;
  propDelegates?: BeatCanvasPropDelegates;
  dimensions: MusicDimensionData;
  lineToSpaceRatio: number;
  children?: ReactNode;
};

const MusicCanvas: FunctionComponent<MusicCanvasProps> = ({
  measures,
  aboveBelowCount,
  aspectRatio,
  propDelegates,
  dimensions,
  lineToSpaceRatio,
  children,
}) => {
  const beatCanvas = getRelativeBeatCanvas(aspectRatio, propDelegates);
  drawMeasures(
    measures,
    aboveBelowCount,
    dimensions,
    () => beatCanvas,
    lineToSpaceRatio
  );

  return beatCanvas.createCanvas({
    style: { position: "relative", width: "100%", height: "100%" },
    children,
  });
};

export default MusicCanvas;

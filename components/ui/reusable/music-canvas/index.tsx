import { BeatCanvasPropDelegates } from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { FunctionComponent, ReactNode } from "react";
import { Measure } from "@/components/providers/music/types";
import {
  drawMeasures,
  getRelativeBeatCanvas,
} from "@/utils/music-rendering/react";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";

type MusicCanvasProps = {
  measures: Measure[];
  aspectRatio: number;
  propDelegates?: BeatCanvasPropDelegates;
  dimensions: MusicDimensionData;
  measurements: Measurements;
  drawAboveBelow?: boolean;
  children?: ReactNode;
};

const MusicCanvas: FunctionComponent<MusicCanvasProps> = ({
  measures,
  aspectRatio,
  propDelegates,
  dimensions,
  measurements,
  drawAboveBelow = false,
  children,
}) => {
  const beatCanvas = getRelativeBeatCanvas(aspectRatio, propDelegates);
  drawMeasures(
    measures,
    dimensions,
    measurements,
    () => beatCanvas,
    drawAboveBelow
  );

  return beatCanvas.createCanvas({
    style: { position: "relative", width: "100%", height: "100%" },
    children,
  });
};

export default MusicCanvas;

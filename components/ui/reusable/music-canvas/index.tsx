import { BeatCanvasPropDelegates } from "@/types/music-rendering/canvas/beat-canvas/clickable-beat-canvas";
import { FunctionComponent, ReactNode } from "react";
import { Measure } from "@/components/providers/music/types";
import {
  drawMeasures,
  getRelativeBeatCanvas,
} from "@/utils/music-rendering/react";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { MeasureSectionToggle } from "@/types/music-rendering";

type MusicCanvasProps = {
  measures: Measure[];
  aspectRatio: number;
  propDelegates?: BeatCanvasPropDelegates;
  dimensions: MusicDimensionData;
  measurements: Measurements;
  sectionToggleList?: MeasureSectionToggle;
  drawAboveBelow?: boolean;
  children?: ReactNode;
};

const MusicCanvas: FunctionComponent<MusicCanvasProps> = ({
  measures,
  aspectRatio,
  propDelegates,
  dimensions,
  measurements,
  sectionToggleList,
  drawAboveBelow = false,
  children,
}) => {
  const beatCanvas = getRelativeBeatCanvas(
    aspectRatio,
    measurements,
    propDelegates
  );
  drawMeasures(
    measures,
    dimensions,
    measurements,
    () => beatCanvas,
    drawAboveBelow,
    sectionToggleList
  );

  return beatCanvas.createCanvas({
    style: { position: "relative", width: "100%", height: "100%" },
    children,
  });
};

export default MusicCanvas;

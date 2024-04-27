import { FunctionComponent, ReactNode } from "react";
import { Measure } from "@/components/providers/music/types";
import { drawMeasures } from "@/utils/music-rendering/react";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { MeasureSectionToggle } from "@/types/music-rendering";
import { ReactCanvasManager } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas/manager";
import { createUnitConverters } from "@/utils/music-rendering";

type MusicCanvasProps = {
  measures: Measure[];
  dimensions: MusicDimensionData;
  measurements: Measurements;
  manager: ReactCanvasManager;
  aspectRatio: number;
  sectionToggleList?: MeasureSectionToggle;
  children?: ReactNode;
};

const MusicCanvas: FunctionComponent<MusicCanvasProps> = ({
  measures,
  dimensions,
  measurements,
  manager,
  aspectRatio,
  sectionToggleList,
  children,
}) => {
  drawMeasures(
    measures,
    dimensions,
    manager,
    measurements,
    sectionToggleList,
    createUnitConverters(aspectRatio)
  );

  return manager.getPages({
    style: { position: "relative", width: "100%", height: "100%" },
    children,
  });
};

export default MusicCanvas;

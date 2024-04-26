import { FunctionComponent, ReactNode } from "react";
import { Measure } from "@/components/providers/music/types";
import { drawMeasures } from "@/utils/music-rendering/react";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { MeasureSectionToggle } from "@/types/music-rendering";
import { ReactCanvasManager } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas/manager";

type MusicCanvasProps = {
  measures: Measure[];
  dimensions: MusicDimensionData;
  measurements: Measurements;
  manager: ReactCanvasManager;
  sectionToggleList?: MeasureSectionToggle;
  children?: ReactNode;
};

const MusicCanvas: FunctionComponent<MusicCanvasProps> = ({
  measures,
  dimensions,
  measurements,
  manager,
  sectionToggleList,
  children,
}) => {
  drawMeasures(measures, dimensions, measurements, manager, sectionToggleList);

  return manager.getPages({
    style: { position: "relative", width: "100%", height: "100%" },
    children,
  });
};

export default MusicCanvas;

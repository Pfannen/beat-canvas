import { FunctionComponent, ReactNode } from "react";
import { Measure } from "@/components/providers/music/types";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";
import { MeasureSectionToggle, UnitConverters } from "@/types/music-rendering";
import { ReactCanvasManager } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas/manager";
import { drawMeasures } from "@/types/music-rendering/react";
import { UnitMeasurement } from "@/types";
import { appendUnit } from "@/utils";

type MusicCanvasProps = {
  measures: Measure[];
  dimensions: MusicDimensionData;
  measurements: Measurements;
  manager: ReactCanvasManager;
  unit: UnitMeasurement;
  sectionToggleList?: MeasureSectionToggle;
  children?: ReactNode;
  unitConverters?: UnitConverters;
};

const MusicCanvas: FunctionComponent<MusicCanvasProps> = ({
  measures,
  dimensions,
  measurements,
  manager,
  unit,
  sectionToggleList,
  children,
  unitConverters,
}) => {
  drawMeasures(
    measures,
    dimensions,
    manager,
    measurements,
    sectionToggleList,
    unitConverters
  );

  return manager.getPages({
    style: {
      position: "relative",
      width: appendUnit(dimensions.pageDimensions.width, unit),
      height: appendUnit(dimensions.pageDimensions.height, unit),
    },
    children,
  });
};

export default MusicCanvas;

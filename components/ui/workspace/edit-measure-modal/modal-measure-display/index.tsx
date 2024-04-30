import classes from "./index.module.css";

import { Measure } from "@/components/providers/music/types";
import { FunctionComponent, useMemo } from "react";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import SegmentedMeasures from "./segmented-measures";
import { Measurements } from "@/objects/measurement/measurements";
import { BODY_CT, LINE_TO_SPACE_R } from "@/constants/music-dimensions";
import MusicCanvas from "@/components/ui/reusable/music-canvas";
import { PositionData } from "@/types/ui/music-modal";
import { Coordinate, UnitMeasurement } from "@/types";
import { ReactCanvasManager } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas/manager";
import { createUnitConverters } from "@/utils/music-rendering";

type ModalMeasureDisplayProps = {
  measures: Measure[];
  aboveBelowCt: number;
  height: number;
  aspectRatio: number;
  unit: UnitMeasurement;
  lineToSpaceRatio: number;
  onPositionClick: (position: Coordinate, positionData: PositionData) => void;
  isYPosSelected: (measureIndex: number, xPos: number, yPos: number) => boolean;
  isSegmentSelected: (measureIndex: number, xPos: number) => boolean;
};

const ModalMeasureDisplay: FunctionComponent<ModalMeasureDisplayProps> = ({
  measures,
  aboveBelowCt,
  height,
  aspectRatio,
  unit,
  lineToSpaceRatio,
  onPositionClick,
  isSegmentSelected,
  isYPosSelected,
}) => {
  const dimensions = useMemo(
    () =>
      MusicLayout.getMarginlessSheetMusic(
        height * aspectRatio,
        height,
        1,
        measures.length
      ),
    [measures.length]
  );
  const measurements = useMemo(
    () =>
      new Measurements(
        aboveBelowCt,
        BODY_CT,
        lineToSpaceRatio,
        dimensions.measureDimensions
      ),
    []
  );
  const measureComponents = measurements.getMeasureComponents();
  return (
    <MusicCanvas
      measures={measures}
      dimensions={dimensions}
      measurements={measurements}
      sectionToggleList={{ note: true }}
      manager={new ReactCanvasManager(measurements, unit, aspectRatio, true)}
      unit={unit}
      unitConverters={undefined} //If relative, maybe?
    >
      <SegmentedMeasures
        measures={measures}
        componentFractions={measurements.getComponentFractions()}
        onPositionClick={onPositionClick}
        componentIterator={measureComponents.iterateMeasureComponents.bind(
          measureComponents
        )}
        isYPosSelected={isYPosSelected}
        noteOffset={dimensions.measureDimensions.noteYOffset + unit}
        noteHeight={dimensions.measureDimensions.noteSpaceHeight + unit}
        isSegmentSelected={isSegmentSelected}
      />
    </MusicCanvas>
  );
};

export default ModalMeasureDisplay;

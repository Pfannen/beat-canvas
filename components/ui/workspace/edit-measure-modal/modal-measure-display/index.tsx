import classes from "./index.module.css";

import { Measure } from "@/components/providers/music/types";
import { FunctionComponent, useMemo } from "react";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import SegmentedMeasures from "./segmented-measures";
import { Measurements } from "@/objects/measurement/measurements";
import { BODY_CT } from "@/objects/measurement/constants";
import MusicCanvas from "@/components/ui/reusable/music-canvas";
import { PositionData } from "@/types/ui/music-modal";
import { Coordinate } from "@/types";

const lineToSpaceRatio = 1.5;

type ModalMeasureDisplayProps = {
  measures: Measure[];
  aboveBelowCt: number;
  aspectRatio: number;
  onPositionClick: (position: Coordinate, positionData: PositionData) => void;
  isYPosSelected: (measureIndex: number, xPos: number, yPos: number) => boolean;
  isSegmentSelected: (measureIndex: number, xPos: number) => boolean;
};

const ModalMeasureDisplay: FunctionComponent<ModalMeasureDisplayProps> = ({
  measures,
  aboveBelowCt,
  aspectRatio,
  onPositionClick,
  isSegmentSelected,
  isYPosSelected,
}) => {
  const dimensions = useMemo(
    () => MusicLayout.getMarginlessSheetMusic(aspectRatio, 1, measures.length),
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
      aspectRatio={aspectRatio}
      dimensions={dimensions}
      measurements={measurements}
      sectionToggleList={{ note: true }}
      drawAboveBelow
    >
      <SegmentedMeasures
        measures={measures}
        componentFractions={measurements.getComponentFractions()}
        onPositionClick={onPositionClick}
        componentIterator={measureComponents.iterateMeasureComponents.bind(
          measureComponents
        )}
        isYPosSelected={isYPosSelected}
        noteOffset={dimensions.measureDimensions.noteYOffset}
        noteHeight={dimensions.measureDimensions.noteSpaceHeight}
        isSegmentSelected={isSegmentSelected}
      />
    </MusicCanvas>
  );
};

export default ModalMeasureDisplay;

import classes from "./index.module.css";

import { Measure } from "@/components/providers/music/types";
import { FunctionComponent, useMemo } from "react";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { NoteIdentifier } from "@/types/music-rendering/canvas/clickable-beat-canvas";
import ComponentNoteSelectCanvas from "@/components/ui/reusable/music-canvas/component-note-select-canvas";
import SegmentedMeasures from "./segmented-measures";
import { Measurements } from "@/objects/measurement/measurements";
import { BODY_CT } from "@/objects/measurement/constants";
import MusicCanvas from "@/components/ui/reusable/music-canvas";
import { MusicPosition } from "@/types/ui/music-modal";

const lineToSpaceRatio = 1.5;

type ModalMeasureDisplayProps = {
  measures: Measure[];
  aboveBelowCt: number;
  startMeasureGlobalIndex: number;
  aspectRatio: number;
  onPositionClick: (position: MusicPosition) => void;
};

const ModalMeasureDisplay: FunctionComponent<ModalMeasureDisplayProps> = ({
  measures,
  aboveBelowCt,
  startMeasureGlobalIndex,
  aspectRatio,
  onPositionClick,
}) => {
  const dimensions = useMemo(
    () => MusicLayout.getMarginlessSheetMusic(aspectRatio, 1, measures.length),
    [measures.length]
  );
  const measurements = useMemo(
    () => new Measurements(aboveBelowCt, BODY_CT, lineToSpaceRatio),
    []
  );
  const measureComponents = measurements.getMeasureComponents();
  return (
    <MusicCanvas
      measures={measures}
      aspectRatio={aspectRatio}
      dimensions={dimensions}
      measurements={measurements}
      drawAboveBelow
    >
      <SegmentedMeasures
        measures={measures}
        componentFractions={measurements.getComponentFractions()}
        onPositionClick={onPositionClick}
        componentIterator={measureComponents.iterateMeasureComponents.bind(
          measureComponents
        )}
        startMeasureGlobalIndex={startMeasureGlobalIndex}
        noteOffset={dimensions.measureDimensions.noteYOffset}
        noteHeight={dimensions.measureDimensions.noteSpaceHeight}
      />
    </MusicCanvas>
  );
};

export default ModalMeasureDisplay;

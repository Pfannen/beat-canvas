import classes from "./index.module.css";

import { Measure } from "@/components/providers/music/types";
import { FunctionComponent, useMemo } from "react";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { NoteIdentifier } from "@/types/music-rendering/canvas/clickable-beat-canvas";
import ComponentNoteSelectCanvas from "@/components/ui/reusable/music-canvas/component-note-select-canvas";
import SegmentedMeasures from "./segmented-measures";
import { Measurements } from "@/objects/measurement/measurements";
import { BODY_CT } from "@/objects/measurement/constants";

const aspectRatio = 4;
const lineToSpaceRatio = 1.5;

type ModalMeasureDisplayProps = {
  measures: Measure[];
  aboveBelowCt: number;
  onNoteClick: (identifier: NoteIdentifier) => void;
  getNoteOverlayClassName: (identifier: NoteIdentifier) => string;
  onComponentClick: (identifier: {
    measureIndex: number;
    yPos: number;
  }) => void;
  // onSegmentClick: (measureIndex: number, xPos: number, yPos: number) => void;
};

const ModalMeasureDisplay: FunctionComponent<ModalMeasureDisplayProps> = ({
  measures,
  aboveBelowCt,
  onNoteClick,
  getNoteOverlayClassName,
  onComponentClick,
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
    <ComponentNoteSelectCanvas
      measures={measures}
      aspectRatio={aspectRatio}
      dimensions={dimensions}
      measurements={measurements}
      aboveBelowCount={aboveBelowCt}
      onNoteClick={onNoteClick}
      getNoteClassName={getNoteOverlayClassName}
      onMeasureComponentClick={onComponentClick}
    >
      <SegmentedMeasures
        measures={measures}
        componentFractions={measurements.getComponentFractions()}
        onSegmentClick={(location) => console.log(location)}
        componentIterator={measureComponents.iterateMeasureComponents.bind(
          measureComponents
        )}
        noteOffset={dimensions.measureDimensions.noteYOffset}
        noteHeight={dimensions.measureDimensions.noteSpaceHeight}
      />
    </ComponentNoteSelectCanvas>
  );
};

export default ModalMeasureDisplay;

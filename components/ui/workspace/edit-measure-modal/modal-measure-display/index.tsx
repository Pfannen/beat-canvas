import classes from "./index.module.css";

import { Measure } from "@/components/providers/music/types";
import { FunctionComponent, useMemo } from "react";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { NoteIdentifier } from "@/types/music-rendering/canvas/clickable-beat-canvas";
import ComponentNoteSelectCanvas from "@/components/ui/reusable/music-canvas/component-note-select-canvas";
import SegmentedMeasures from "./segmented-measures";

const aspectRatio = 4;

type ModalMeasureDisplayProps = {
  measures: Measure[];
  aboveBelowCt: number;
  onNoteClick: (identifier: NoteIdentifier) => void;
  getNoteOverlayClassName: (identifier: NoteIdentifier) => string;
  onComponentClick: (identifier: {
    measureIndex: number;
    yPos: number;
  }) => void;
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
  return (
    <ComponentNoteSelectCanvas
      measures={measures}
      aspectRatio={aspectRatio}
      dimensions={dimensions}
      aboveBelowCount={aboveBelowCt}
      onNoteClick={onNoteClick}
      getNoteClassName={getNoteOverlayClassName}
      onMeasureComponentClick={onComponentClick}
    >
      <SegmentedMeasures measures={measures} />
    </ComponentNoteSelectCanvas>
  );
};

export default ModalMeasureDisplay;

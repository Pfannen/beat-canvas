import {
  MeasureComponentIdentifier,
  NoteIdentifier,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { FunctionComponent, ReactNode } from "react";
import MusicCanvas from "..";
import { Measure } from "@/components/providers/music/types";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";
import { Measurements } from "@/objects/measurement/measurements";

type ComponentNoteSelectCanvasProps = {
  measures: Measure[];
  aspectRatio: number;
  aboveBelowCount: number;
  dimensions: MusicDimensionData;
  measurements: Measurements;
  onNoteClick: (identifier: NoteIdentifier) => void;
  getNoteClassName: (identifier: NoteIdentifier) => string;
  onMeasureComponentClick: (identifier: MeasureComponentIdentifier) => void;
  children?: ReactNode;
};

const ComponentNoteSelectCanvas: FunctionComponent<
  ComponentNoteSelectCanvasProps
> = ({
  measures,
  aspectRatio,
  dimensions,
  measurements,
  onNoteClick,
  getNoteClassName,
  onMeasureComponentClick,
  children,
}) => {
  const getNoteProps = (identifiers: NoteIdentifier) => {
    return {
      onClick: onNoteClick.bind(null, identifiers),
      className: getNoteClassName(identifiers),
    };
  };

  const getMeasureComponentProps = (identifier: MeasureComponentIdentifier) => {
    return {
      onClick: onMeasureComponentClick.bind(null, { ...identifier }),
      style: { cursor: "pointer" },
    };
  };

  return (
    <MusicCanvas
      measures={measures}
      aspectRatio={aspectRatio}
      dimensions={dimensions}
      measurements={measurements}
      propDelegates={{ getNoteProps, getMeasureComponentProps }}
      drawAboveBelow
    >
      {children}
    </MusicCanvas>
  );
};

export default ComponentNoteSelectCanvas;

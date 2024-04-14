import {
  MeasureComponentIdentifier,
  NoteIdentifier,
  RelativeMeasureComponentIdentifier,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { FunctionComponent, ReactNode } from "react";
import MusicCanvas from "..";
import { Measure } from "@/components/providers/music/types";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";

type ComponentNoteSelectCanvasProps = {
  measures: Measure[];
  aspectRatio: number;
  aboveBelowCount: number;
  dimensions: MusicDimensionData;
  onNoteClick: (identifier: NoteIdentifier) => void;
  getNoteClassName: (identifier: NoteIdentifier) => string;
  onMeasureComponentClick: (
    identifier: RelativeMeasureComponentIdentifier
  ) => void;
  children?: ReactNode;
};

const ComponentNoteSelectCanvas: FunctionComponent<
  ComponentNoteSelectCanvasProps
> = ({
  measures,
  aspectRatio,
  aboveBelowCount,
  dimensions,
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
    const yPos = absoluteToYPos(identifier.absoluteYPos, aboveBelowCount);
    return {
      onClick: onMeasureComponentClick.bind(null, { ...identifier, yPos }),
      style: { cursor: "pointer" },
    };
  };

  return (
    <MusicCanvas
      measures={measures}
      aboveBelowCount={aboveBelowCount}
      aspectRatio={aspectRatio}
      dimensions={dimensions}
      lineToSpaceRatio={1.5}
      propDelegates={{ getNoteProps, getMeasureComponentProps }}
    >
      {children}
    </MusicCanvas>
  );
};

export default ComponentNoteSelectCanvas;

const absoluteToYPos = (absolutePos: number, aboveBelowCt: number) => {
  return absolutePos - aboveBelowCt - 1;
};

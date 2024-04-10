import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { FunctionComponent, useMemo } from "react";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { getHTMLCanvas } from "@/utils/music-rendering";
import { NoteIdentifier } from "@/types/music-rendering/canvas/clickable-beat-canvas";

const aspectRatio = 4;

type ModalMeasureDisplayProps = {
  measures: Measure[];
  bodyCt: number;
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
  bodyCt,
  aboveBelowCt,
  onNoteClick,
  getNoteOverlayClassName,
  onComponentClick,
}) => {
  const dimensions = useMemo(
    () => MusicLayout.getMarginlessSheetMusic(aspectRatio, 1, measures.length),
    [measures.length]
  );
  return getHTMLCanvas(
    aspectRatio,
    measures,
    dimensions,
    {
      getMeasureComponentProps: ({ measureIndex, absoluteYPos }) => ({
        onClick: () => {
          const yPos = absoluteToYPos(absoluteYPos, aboveBelowCt);
          onComponentClick({ measureIndex, yPos });
        },
        style: { cursor: "pointer" },
      }),
      getNoteProps: (identifier) => {
        return {
          onClick: onNoteClick.bind(null, identifier),
          className: getNoteOverlayClassName(identifier),
        };
      },
    },

    2
  );
};

export default ModalMeasureDisplay;

const absoluteToYPos = (absolutePos: number, aboveBelowCt: number) => {
  return absolutePos - aboveBelowCt - 1;
};

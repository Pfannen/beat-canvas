import classes from "./index.module.css";
import { FunctionComponent, useState } from "react";
import NotePosition from "@/objects/note-position";
import { getNoteDuration } from "@/components/providers/music/utils";
import { useMusic } from "@/components/providers/music";
import DisplayMeasure from "./display-measure";
import DisplayNote from "../note/display-note";
import { concatClassNames } from "@/utils/css";

const spaceCount = 3;
const lineCount = 2;
const bodyCt = 7;

type DisplayMeasuresProps = {
  onMeasureClick: (index: number) => void;
  className?: string;
  selectedMeasures?: number[];
  selectedMeasureClassName?: string;
};

const DisplayMeasures: FunctionComponent<DisplayMeasuresProps> = ({
  onMeasureClick,
  className,
  selectedMeasures,
  selectedMeasureClassName,
}) => {
  const { measures } = useMusic();
  const [notePosition, setNotePosition] = useState(() => {
    return new NotePosition((spaceCount + lineCount) * 2 + bodyCt, 25, 100);
  });
  const padding =
    lineCount * notePosition.heights.line +
    spaceCount * notePosition.heights.space;
  const bodyPercent = 1 - padding * 2;
  const noteComponents = measures.map(({ notes }) => {
    return notes.map((note) => {
      const length = getNoteDuration(note.type, 4);
      const { x, y } = notePosition.getNoteOffset({ ...note, length });
      const component = (
        <DisplayNote
          bottom={y + "%"}
          left={x + "%"}
          type={note.type}
          height={notePosition.heights.space * 100 + "%"}
          key={`${x}-${y}`}
        />
      );
      return component;
    });
  });
  return (
    <div className={concatClassNames(classes.measures, className)}>
      {noteComponents.map((measureNotes, i) => {
        return (
          <DisplayMeasure
            notesComponents={measureNotes}
            componentPercentages={notePosition.heights}
            height={bodyPercent * 100 + "%"}
            padding={padding * 100 + "%"}
            onClick={onMeasureClick.bind(null, i)}
            className={
              selectedMeasures?.includes(i)
                ? selectedMeasureClassName
                : undefined
            }
          />
        );
      })}
    </div>
  );
};

export default DisplayMeasures;

import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { getNoteDuration } from "@/components/providers/music/utils";
import { useMusic } from "@/components/providers/music";
import DisplayMeasure from "./display-measure";
import DisplayNote from "../note/display-note";
import { concatClassNames } from "@/utils/css";
import Measure from "@/objects/music/measure";

const measure = new Measure(5, 25, 100);

type DisplayMeasuresProps = {
  onMeasureClick: (index: number) => void;
  className?: string;
  isMeasureSelected: (index: number) => boolean;
  selectedMeasureClassName?: string;
  notSelectedMeasureClassName?: string;
};

const DisplayMeasures: FunctionComponent<DisplayMeasuresProps> = ({
  onMeasureClick,
  className,
  isMeasureSelected,
  selectedMeasureClassName,
  notSelectedMeasureClassName,
}) => {
  const { measures } = useMusic();
  const linePercent = measure.getLinePercent();
  const spacePercent = measure.getSpacePercent();
  const padding =
    measure.getAboveBelowLines() * linePercent +
    measure.getAboveBelowSpaces() * spacePercent;
  const bodyPercent = 1 - padding * 2;
  const noteComponents = measures.map(({ notes }) => {
    return notes.map((note) => {
      const length = getNoteDuration(note.type, 4);
      const { x, y } = measure.getNoteOffset({ ...note, length });
      const component = (
        <DisplayNote
          bottom={y + "%"}
          left={x + "%"}
          type={note.type}
          height={measure.getSpacePercent() * 100 + "%"}
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
            noteComponents={measureNotes}
            componentPercentages={{ space: spacePercent, line: linePercent }}
            height={bodyPercent * 100 + "%"}
            padding={padding * 100 + "%"}
            onClick={onMeasureClick.bind(null, i)}
            className={
              isMeasureSelected(i)
                ? selectedMeasureClassName
                : notSelectedMeasureClassName
            }
          />
        );
      })}
    </div>
  );
};

export default DisplayMeasures;

import { minimalSegmentGenerator } from "@/components/ui/reusable/segment-split/utils";
import { SegmentActionHandler } from "../../types";
import classes from "./index.module.css";
import { FunctionComponent, useState } from "react";
import Measure from "..";
import SplitSegment from "../../segment/split-segment";
import { useMusic } from "@/components/providers/music";
import NoteSelection from "@/components/ui/reusable/note-selection";
import { NoteType } from "@/components/providers/music/types";
import { addNote } from "@/components/providers/music/hooks/useMeasures/utils";

type ModifiableMeasureProps = { measureIndex: number };

const ModifiableMeasure: FunctionComponent<ModifiableMeasureProps> = ({
  measureIndex,
}) => {
  const { getMeasures, invokeMeasureModifier } = useMusic();
  const [noteSelected, setNoteSelected] = useState<NoteType | undefined>();
  const actionHandler: SegmentActionHandler<"click"> = (action, x, y) => {
    if (noteSelected) {
      const del = addNote({ note: { x, y, type: noteSelected }, measureIndex });
      invokeMeasureModifier(del);
      console.log(del);
    } else console.log(action, x, y);
  };
  const noteSelectHandler = (type: NoteType) => {
    setNoteSelected((prevState) => {
      if (type === prevState) {
        return undefined;
      }
      return type;
    });
  };
  return (
    <>
      <NoteSelection
        selectedNote={noteSelected}
        onNoteClicked={noteSelectHandler}
      />
      <div className={classes.measures}>
        {getMeasures(measureIndex, 1).map(({ notes }) => {
          return (
            <Measure
              segmentGenerator={minimalSegmentGenerator}
              notes={notes}
              timeSignature={{ beatNote: 4, beatsPerMeasure: 4 }}
              renderSegment={(props) => {
                return (
                  <SplitSegment actionHandler={actionHandler} {...props} />
                );
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default ModifiableMeasure;

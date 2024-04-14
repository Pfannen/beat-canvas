import { minimalSegmentGenerator } from "@/components/ui/reusable/segment-split/utils";
import classes from "./index.module.css";
import { FunctionComponent, useState } from "react";
import SegmentedMeasure from "../../../reusable/segments";
import SplitSegment from "../../segment/split-segment";
import { useMusic } from "@/components/providers/music";
import NoteSelection from "@/components/ui/reusable/note-selection";
import { Note, NoteType } from "@/components/providers/music/types";
import { addNote } from "@/components/providers/music/hooks/useMeasures/utils";
import { ModificationBehavior } from "../../utils";
import useSplitSegmentRegistry from "@/components/hooks/useSplitSegement/useSplitSegmentRegistry";
import ModifiableMeasure from "./modifiable-measure";

type ModifiableMeasuresProps = {
  measureIndex: number;
  count?: number;
  modificationBehavior: ModificationBehavior<any>;
};

const ModifiableMeasures: FunctionComponent<ModifiableMeasuresProps> = ({
  measureIndex,
  count = 1,
  modificationBehavior,
}) => {
  //To make modificationBehavior fully complete, need to take in additional props to pass into the split segment
  //{props: ..., modificationBehavior: }
  const { getMeasures, invokeMeasureModifier } = useMusic();
  const [noteSelected, setNoteSelected] = useState<NoteType | undefined>();
  const noteSelectHandler = (type: NoteType) => {
    setNoteSelected((prevState) => {
      if (type === prevState) {
        return undefined;
      }
      return type;
    });
  };
  const placeNote = (note: Note, measureIndex: number) => {
    invokeMeasureModifier(addNote({ note, measureIndex }));
  };
  return (
    <>
      <NoteSelection
        selectedNote={noteSelected}
        onNoteClicked={noteSelectHandler}
      />
      <div className={classes.measures}>
        {getMeasures(measureIndex, count).map(({ notes }, i) => {
          return (
            <ModifiableMeasure
              index={i + measureIndex}
              notes={notes}
              modificationBehavior={modificationBehavior}
              noteSelected={noteSelected}
              placeNote={placeNote}
            />
          );
        })}
      </div>
    </>
  );
};

export default ModifiableMeasures;

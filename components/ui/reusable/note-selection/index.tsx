import { NoteType } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { FunctionComponent, ReactNode } from "react";
import { concatClassNames } from "@/utils/css";

const notes: { type: NoteType; label: ReactNode }[] = [
  { type: "whole", label: "Whole" },
  { type: "half", label: "Half" },
  { type: "quarter", label: "Quarter" },
  { type: "eighth", label: "Eighth" },
  { type: "sixteenth", label: "Sixteenth" },
];

type NoteSelectionProps = {
  selectedNote?: NoteType;
  onNoteClicked: (type: NoteType) => void;
};

const NoteSelection: FunctionComponent<NoteSelectionProps> = ({
  selectedNote,
  onNoteClicked,
}) => {
  return (
    <div className={classes.notes}>
      {notes.map(({ type, label }) => {
        return (
          <button
            className={concatClassNames(
              classes.note,
              selectedNote === type && classes.selected
            )}
            onClick={() => {
              onNoteClicked(type);
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default NoteSelection;

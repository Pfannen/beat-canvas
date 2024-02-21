import { NoteType } from "@/components/providers/music/types";
import Note from "@/lib/notes/ui/note";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type DisplayNoteProps = {
  bottom: string;
  left: string;
  height: string;
  type: NoteType;
};

const DisplayNote: FunctionComponent<DisplayNoteProps> = ({
  bottom,
  left,
  height,
  type,
}) => {
  return (
    <div style={{ bottom, left, height }} className={classes.note}>
      <Note type={type} />
    </div>
  );
};

export default DisplayNote;

import { NoteType } from "@/components/providers/music/types";
import Note from "..";
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
  return <Note style={{ bottom, left, height }} className={classes.note} />;
};

export default DisplayNote;

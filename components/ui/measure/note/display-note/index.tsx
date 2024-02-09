import Note from "..";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type DisplayNoteProps = {
  bottom: string;
  left: string;
};

const DisplayNote: FunctionComponent<DisplayNoteProps> = ({ bottom, left }) => {
  return <Note style={{ bottom, left }} className={classes.note} />;
};

export default DisplayNote;

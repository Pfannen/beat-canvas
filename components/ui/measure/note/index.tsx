import DropItem from "../../reusable/drag-drop/drop-item";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type NoteProps = {};

const Note: FunctionComponent<NoteProps> = () => {
  return (
    <DropItem className={classes.note} dataName="note" dataValue="quarter" />
  );
};

export default Note;

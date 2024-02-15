import NoteBody from "../note-body";
import NoteStaff from "../note-staff";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type NoteProps = {};

const Note: FunctionComponent<NoteProps> = () => {
  return (
    <NoteBody height="100%" fill>
      <NoteStaff
        bodyHeight={1}
        heightMultiplier={2}
        unit={"%"}
        direction={"up"}
      />
    </NoteBody>
  );
};

export default Note;

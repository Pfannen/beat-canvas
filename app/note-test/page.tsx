import Note from "@/lib/notes/ui/note";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type NoteTestProps = {};

const NoteTest: FunctionComponent<NoteTestProps> = () => {
  return (
    <div className={classes.page}>
      <Note
        type="quarter"
        bodyHeight={1}
        attributes={["line-through", "sixteenth-flag"]}
        direction="up"
      ></Note>
    </div>
  );
};

export default NoteTest;

import Note from "@/lib/notes/ui/note";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { getLineThrough } from "@/lib/notes/ui/note-attributes";

type NoteTestProps = {};

const NoteTest: FunctionComponent<NoteTestProps> = () => {
  return (
    <div className={classes.page}>
      <Note
        type="eighth"
        bodyHeight={0.5}
        direction="up"
        extraAttributes={[getLineThrough({ lineHeight: "5%" })]}
      ></Note>
    </div>
  );
};

export default NoteTest;

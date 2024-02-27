import Note from "@/lib/notes/ui/note";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { getLineThrough, getNoteBeam } from "@/lib/notes/ui/note-attributes";

type NoteTestProps = {};

const NoteTest: FunctionComponent<NoteTestProps> = () => {
  return (
    <div className={classes.page}>
      <Note
        type="half"
        bodyHeight={0.5}
        direction="up"
        extraAttributes={[
          getLineThrough({ lineHeight: "5%" }),
          getNoteBeam({
            lengthInBodyUnits: 5,
            widthFraction: 1,
            angleDeg: 135,
          }),
        ]}
      ></Note>
    </div>
  );
};

export default NoteTest;

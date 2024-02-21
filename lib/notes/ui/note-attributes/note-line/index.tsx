import AbsoluteContainer from "../../absolute-container";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";

type NoteLineProps = {
  lineHeight: string;
};

const NoteLine: FunctionComponent<NoteLineProps> = ({ lineHeight }) => {
  return (
    <AbsoluteContainer
      style={{ "--height": lineHeight } as CSSProperties}
      className={classes.note_line}
      centerX
      centerY
    />
  );
};

export default NoteLine;

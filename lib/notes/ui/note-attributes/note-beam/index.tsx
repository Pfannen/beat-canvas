import { AxisProps } from "@/lib/notes/types";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";
import AbsoluteContainer from "../../absolute-container";

type NoteBeamProps = {
  angle: string;
  width: string;
  length: string;
};

const NoteBeam: FunctionComponent<NoteBeamProps> = ({
  angle,
  width,
  length,
}) => {
  return (
    <AbsoluteContainer
      style={
        {
          "--height": length,
          "--width": width,
          "--angle": angle,
        } as CSSProperties
      }
      className={classes.note_beam}
      yAxis="bottom"
      yPercent="100%"
    />
  );
};

export default NoteBeam;

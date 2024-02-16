import { UnitMeasurement } from "@/types";
import NoteBody from "../note-body";
import NoteStaff from "../note-staff";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { NoteDirection, NoteProps } from "../../types";
import { numToUnit } from "@/utils";
import NoteDot from "../note-attributes/note-dot";

type Props = {
  bodyHeight?: number;
  staffHeightMultiplier?: number;
  unit?: UnitMeasurement;
  direction?: NoteDirection;
};

const Note: FunctionComponent<NoteProps<Props>> = (props) => {
  const {
    bodyHeight = 1,
    staffHeightMultiplier = 1.75,
    unit = "%",
    direction = "up",
  } = props;
  return (
    <NoteBody height={numToUnit(bodyHeight, unit)}>
      <NoteStaff
        heightMultiplier={staffHeightMultiplier}
        direction={direction}
      />
      <NoteDot yAxis={"top"} xAxis="right" />
    </NoteBody>
  );
};

export default Note;

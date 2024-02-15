import { UnitMeasurement } from "@/types";
import NoteBody from "../note-body";
import NoteStaff from "../note-staff";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { NoteDirection } from "../../types";
import { numToUnit } from "@/utils";

type NoteProps = {
  bodyHeight?: number;
  staffHeightMultiplier?: number;
  unit?: UnitMeasurement;
  direction?: NoteDirection;
};

const Note: FunctionComponent<NoteProps> = ({
  bodyHeight = 1,
  staffHeightMultiplier = 1.75,
  unit = "%",
  direction = "up",
}) => {
  return (
    <NoteBody height={numToUnit(bodyHeight, unit)}>
      <NoteStaff
        heightMultiplier={staffHeightMultiplier}
        direction={direction}
      />
    </NoteBody>
  );
};

export default Note;

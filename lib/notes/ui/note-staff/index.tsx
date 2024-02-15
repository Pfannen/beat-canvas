import { numToPercent, numToUnit } from "@/utils";
import { NoteDirection } from "../../types";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";
import { UnitMeasurement } from "@/types";

type NoteStaffProps = {
  heightMultiplier: number;
  direction: NoteDirection;
  children?: ReactNode;
};

const NoteStaff: FunctionComponent<NoteStaffProps> = ({
  heightMultiplier,
  direction,
  children,
}) => {
  let yAxis = "top";
  let xAxis = "left";
  if (direction === "up") {
    yAxis = "bottom";
    xAxis = "right";
  }
  return (
    <div
      className={classes.note_staff}
      style={
        {
          "--height": numToUnit(heightMultiplier, "%"),
          [yAxis]: "50%",
          [xAxis]: "0%",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
};

export default NoteStaff;

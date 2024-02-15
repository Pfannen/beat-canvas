import { numToPercent, numToUnit } from "@/utils";
import { NoteDirection } from "../../types";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";

type NoteStaffProps = {
  bodyHeight: number;
  heightMultiplier: number;
  unit: "px" | "%";
  direction: NoteDirection;
  children?: ReactNode;
};

const NoteStaff: FunctionComponent<NoteStaffProps> = ({
  bodyHeight,
  heightMultiplier,
  unit,
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
          "--height": numToUnit(bodyHeight * heightMultiplier, unit),
          "--body-width": numToUnit(bodyHeight, unit),
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

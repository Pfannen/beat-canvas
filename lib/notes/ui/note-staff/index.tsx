import { numToPercent, numToUnit } from "@/utils";
import { NoteDirection, XAxis, YAxis } from "../../types";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";
import { UnitMeasurement } from "@/types";
import AbsoluteContainer from "../absolute-container";

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
  let yAxis: YAxis = "top";
  let xAxis: XAxis = "left";
  if (direction === "up") {
    yAxis = "bottom";
    xAxis = "right";
  }
  return (
    <AbsoluteContainer
      className={classes.note_staff}
      style={
        {
          "--height": numToUnit(heightMultiplier, "%"),
        } as CSSProperties
      }
      xAxis={xAxis}
      yAxis={yAxis}
      yPercent={"50%"}
      xPercent={"0%"}
    >
      {children}
    </AbsoluteContainer>
  );
};

export default NoteStaff;

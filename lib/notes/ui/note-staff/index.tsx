import { fractionToPercent } from "@/utils";
import { Axis, NoteDirection, XAxis, YAxis } from "../../types";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";
import AbsoluteContainer from "../absolute-container";

type NoteStaffProps = {
  heightMultiplier: number;
  widthMultiplier: number;
  direction: NoteDirection;
  children?: ReactNode;
  hide?: boolean;
};

const NoteStaff: FunctionComponent<NoteStaffProps> = ({
  heightMultiplier,
  widthMultiplier,
  direction,
  children,
  hide,
}) => {
  if (hide) return null;
  return (
    <AbsoluteContainer
      className={classes.note_staff}
      style={
        {
          "--height": fractionToPercent(heightMultiplier),
          "--width": fractionToPercent(widthMultiplier),
        } as CSSProperties
      }
      {...getAxisInfo(direction)}
      yPercent={"50%"}
    >
      {children}
    </AbsoluteContainer>
  );
};

export default NoteStaff;

const getAxisInfo = (direction: NoteDirection): Axis => {
  let yAxis: YAxis = "top";
  let xAxis: XAxis = "left";
  if (direction === "up") {
    yAxis = "bottom";
    xAxis = "right";
  }
  return { xAxis, yAxis };
};

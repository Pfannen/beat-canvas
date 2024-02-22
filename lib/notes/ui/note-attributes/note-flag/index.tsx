import { fractionToPercent } from "@/utils";
import AbsoluteContainer from "../../absolute-container";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { AxisProps } from "@/lib/notes/types";

type NoteFlagProps = {
  offsetPercentage?: number;
  flagNumber?: number;
} & AxisProps;

const NoteFlag: FunctionComponent<NoteFlagProps> = ({
  offsetPercentage = 0.15,
  flagNumber = 0,
  xAxis,
  yAxis,
}) => {
  return (
    <AbsoluteContainer
      className={classes.note_flag}
      yPercent={fractionToPercent(offsetPercentage * flagNumber)}
      xAxis={xAxis}
      yAxis={yAxis}
    />
  );
};

export default NoteFlag;

import { numToPercent } from "@/utils";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";
import { AxisProps, XAxis } from "@/lib/notes/types";
import AbsoluteContainer from "../../absolute-container";

type NoteDotProps = {
  percentOfBody?: number;
} & AxisProps;

const NoteDot: FunctionComponent<NoteDotProps> = ({
  percentOfBody = 0.25,
  xAxis,
  yAxis,
}) => {
  const translateX = centerX(xAxis);
  return (
    <AbsoluteContainer
      className={classes.note_dot}
      style={
        {
          "--percent-of-body": numToPercent(percentOfBody),
          translate: translateX,
        } as CSSProperties
      }
      yAxis={yAxis}
      xAxis={xAxis}
      yPercent={numToPercent(-1.5 * percentOfBody)}
      xPercent={"50%"}
    />
  );
};

export default NoteDot;

const centerX = (xAxis: XAxis) => {
  if (xAxis === "left") return "-50%";
  return "50%";
};

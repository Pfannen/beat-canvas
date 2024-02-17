import { numToPercent } from "@/utils";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";
import AbsoluteContainer, {
  AbsoluteContainerProps,
} from "../../absolute-container";

type NoteDotProps = {
  percentOfBody?: number;
  xPercentOffset?: number;
  yPercentOffset?: number;
};

const NoteDot: FunctionComponent<
  AbsoluteContainerProps<"div", NoteDotProps>
> = ({
  percentOfBody = 0.25,
  yPercentOffset = 0,
  xPercentOffset = 0,
  ...restProps
}) => {
  return (
    <AbsoluteContainer
      className={classes.note_dot}
      style={
        {
          "--percent-of-body": numToPercent(percentOfBody),
        } as CSSProperties
      }
      xPercent={
        xPercentOffset
          ? numToPercent(xPercentOffset * percentOfBody)
          : undefined
      }
      yPercent={
        yPercentOffset
          ? numToPercent(yPercentOffset * percentOfBody)
          : undefined
      }
      {...restProps}
    />
  );
};

export default NoteDot;

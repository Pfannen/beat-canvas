import { fractionToPercent } from "@/utils";
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
  percentOfBody = 0.2,
  yPercentOffset = 0,
  xPercentOffset = 0,
  ...restProps
}) => {
  return (
    <AbsoluteContainer
      className={classes.note_dot}
      style={
        {
          "--percent-of-body": fractionToPercent(percentOfBody),
        } as CSSProperties
      }
      xPercent={
        xPercentOffset
          ? fractionToPercent(xPercentOffset * percentOfBody)
          : undefined
      }
      yPercent={
        yPercentOffset
          ? fractionToPercent(yPercentOffset * percentOfBody)
          : undefined
      }
      {...restProps}
    />
  );
};

export default NoteDot;

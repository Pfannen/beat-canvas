import { fractionToPercent } from "@/utils";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";

const widthMap: { [key: string]: string } = { "1": "orange" };

type SegmentPaneProps = {
  onClick: () => void;
  width: number;
};

const SegmentPane: FunctionComponent<SegmentPaneProps> = ({
  onClick,
  width,
}) => {
  return (
    <div
      className={classes.pane}
      style={
        {
          "--width": fractionToPercent(width),
          "--color": widthMap[width] || "orange",
        } as CSSProperties
      }
      onClick={onClick}
    />
  );
};

export default SegmentPane;
